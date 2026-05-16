/**
 * Phase 2: Copy product images from Supabase Storage public URLs to R2, then update `products.image` / `products.images`.
 *
 * Usage:
 *   node scripts/migrate-product-images-to-r2.mjs --dry-run
 *   node scripts/migrate-product-images-to-r2.mjs --limit=3
 *   node scripts/migrate-product-images-to-r2.mjs
 *
 * Env (shell or repo root `.env` — never commit secrets):
 *   SUPABASE_URL (or VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY (recommended) or SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL
 * Optional: SUPABASE_STORAGE_BUCKET=product-images (hint for log line only)
 */
import { readFileSync, existsSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const DEFAULT_BUCKET = 'product-images';
const __dirname = dirname(fileURLToPath(import.meta.url));

function loadRootEnv() {
  const envPath = join(__dirname, '..', '.env');
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
}

function parseArgs(argv) {
  const dryRun = argv.includes('--dry-run');
  const limitEq = argv.find((a) => a.startsWith('--limit='));
  let limit = null;
  if (limitEq) {
    limit = Number(limitEq.split('=')[1]);
  } else {
    const i = argv.indexOf('--limit');
    if (i >= 0 && argv[i + 1] != null) limit = Number(argv[i + 1]);
  }
  return {
    dryRun,
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
  };
}

function isSupabaseObjectUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('.supabase.co') && url.includes('/storage/v1/object/');
}

function guessContentType(url, buffer) {
  const ext = extname(new URL(url, 'https://x').pathname).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
  if (buffer.length >= 2 && buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
  return 'image/jpeg';
}

function r2KeyFromUrl(oldUrl) {
  const base = basename(new URL(oldUrl).pathname) || 'image.jpg';
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
  return `products/migrated/${Date.now()}-${randomUUID()}-${safe}`;
}

async function main() {
  loadRootEnv();
  const { dryRun, limit } = parseArgs(process.argv.slice(2));

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBase = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL) and a Supabase key (SERVICE_ROLE recommended).');
    process.exit(1);
  }
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    console.error('Missing R2 env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL');
    process.exit(1);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY not set; using anon key. Ensure RLS allows updating products.');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const { data: rows, error: fetchErr } = await supabase.from('products').select('id, image, images');
  if (fetchErr) {
    console.error('Failed to fetch products:', fetchErr.message);
    process.exit(1);
  }

  let products = rows || [];
  if (limit) products = products.slice(0, limit);

  /** @type {Map<string, string>} */
  const urlMap = new Map();

  const uniqueUrls = new Set();
  for (const p of products) {
    if (isSupabaseObjectUrl(p.image)) uniqueUrls.add(p.image);
    for (const u of p.images || []) {
      if (isSupabaseObjectUrl(u)) uniqueUrls.add(u);
    }
  }

  console.log(`Products: ${products.length} (of ${rows?.length ?? 0} total). Unique Supabase image URLs: ${uniqueUrls.size}. dryRun=${dryRun}`);

  for (const oldUrl of uniqueUrls) {
    if (publicBase && oldUrl.startsWith(publicBase)) {
      urlMap.set(oldUrl, oldUrl);
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] would migrate: ${oldUrl.slice(0, 100)}`);
      continue;
    }

    const res = await fetch(oldUrl, { redirect: 'follow' });
    if (!res.ok) {
      console.error(`Skip (download failed ${res.status}): ${oldUrl.slice(0, 100)}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const ctHeader = res.headers.get('content-type') || '';
    const ct = ctHeader.startsWith('image/') ? ctHeader : guessContentType(oldUrl, buf);
    const key = r2KeyFromUrl(oldUrl);

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buf,
          ContentType: ct,
        })
      );
    } catch (e) {
      console.error(`Skip (R2 put failed): ${oldUrl.slice(0, 80)}`, e?.message || e);
      continue;
    }

    const newUrl = `${publicBase}/${key}`;
    urlMap.set(oldUrl, newUrl);
    console.log(`OK: …${oldUrl.slice(-50)} → ${newUrl}`);
  }

  if (dryRun) {
    console.log('Dry run complete. Run without --dry-run to upload + update DB.');
    return;
  }

  let updated = 0;
  for (const p of products) {
    let newImage = p.image;
    let newImages = Array.isArray(p.images) ? [...p.images] : [];
    let changed = false;

    if (isSupabaseObjectUrl(p.image) && urlMap.has(p.image)) {
      const nu = urlMap.get(p.image);
      if (nu && nu !== p.image) {
        newImage = nu;
        changed = true;
      }
    }
    newImages = newImages.map((u) => {
      if (isSupabaseObjectUrl(u) && urlMap.has(u)) {
        const nu = urlMap.get(u);
        if (nu && nu !== u) {
          changed = true;
          return nu;
        }
      }
      return u;
    });

    if (!changed) continue;

    const { error: upErr } = await supabase.from('products').update({ image: newImage, images: newImages }).eq('id', p.id);
    if (upErr) {
      console.error(`Update failed ${p.id}:`, upErr.message);
    } else {
      updated += 1;
      console.log(`Updated product ${p.id}`);
    }
  }

  console.log(`Done. Rows updated: ${updated}.`);
  console.log(`Optional: remove objects under "${storageBucket}" in Supabase Storage after verifying the site.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

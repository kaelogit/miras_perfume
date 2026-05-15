import { supabase, PRODUCT_IMAGES_BUCKET } from '../supabase';

const PUT_TIMEOUT_MS = 120_000;

function isLikelyNetworkBlock(err) {
  const m = String(err?.message ?? err ?? '').toLowerCase();
  return (
    m.includes('networkerror') ||
    m.includes('failed to fetch') ||
    m.includes('load failed') ||
    m.includes('network request failed')
  );
}

function extFromContentType(ct) {
  if (ct === 'image/png') return 'png';
  if (ct === 'image/webp') return 'webp';
  return 'jpg';
}

function fileToBase64Payload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const i = dataUrl.indexOf(',');
      const base64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Could not read file for upload.'));
    reader.readAsDataURL(file);
  });
}

async function uploadToSupabaseStorage(file) {
  const ct = file.type || 'image/jpeg';
  const ext = extFromContentType(ct);
  const path = `products/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    contentType: ct,
    upsert: false,
  });
  if (error) throw new Error(error.message || 'Supabase Storage upload failed');

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Supabase Storage returned no public URL');
  return data.publicUrl;
}

/**
 * Same-origin or configured API: JSON body with base64 image; server writes to R2 (no browser→R2 CORS).
 */
async function uploadViaR2Proxy(file, accessToken) {
  const proxyUrl = String(import.meta.env.VITE_R2_UPLOAD_PROXY_URL || '').replace(/\/$/, '');
  if (!proxyUrl.startsWith('https://')) {
    throw new Error('VITE_R2_UPLOAD_PROXY_URL must be a full https URL (e.g. https://mirasperfume.com/api/r2-upload).');
  }
  const base64 = await fileToBase64Payload(file);
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64,
      contentType: file.type || 'image/jpeg',
    }),
    mode: 'cors',
    cache: 'no-store',
  });
  const text = await res.text().catch(() => '');
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = {};
  }
  if (!res.ok) {
    throw new Error(json.error || text.slice(0, 200) || `Proxy upload failed (${res.status})`);
  }
  if (!json.url) throw new Error('Proxy response missing url');
  return json.url;
}

/**
 * Upload a compressed image: Supabase-only, Vercel R2 proxy, or presigned PUT to R2 (see .env.example).
 */
export async function uploadProductImage(file) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('You must be logged in as admin to upload images.');
  }

  const driver = String(import.meta.env.VITE_PRODUCT_IMAGES_DRIVER || '').toLowerCase();
  if (driver === 'supabase') {
    return uploadToSupabaseStorage(file);
  }

  const proxyUrl = import.meta.env.VITE_R2_UPLOAD_PROXY_URL;
  if (proxyUrl) {
    return uploadViaR2Proxy(file, session.access_token);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl?.startsWith('https://')) {
    throw new Error('VITE_SUPABASE_URL must be a full https URL (check .env / Vercel env).');
  }

  let presignPayload;
  try {
    const { data, error } = await supabase.functions.invoke('upload-product-image', {
      body: {
        contentType: file.type,
        sizeBytes: file.size,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      const msg = error.message || String(error);
      if (isLikelyNetworkBlock({ message: msg })) {
        throw new Error(
          'Could not reach Supabase (presign step). Check internet, ad blockers/VPN, VITE_SUPABASE_URL, and run: supabase functions deploy upload-product-image'
        );
      }
      throw new Error(msg || 'Presign failed');
    }
    presignPayload = data;
  } catch (err) {
    if (isLikelyNetworkBlock(err)) {
      throw new Error(
        'Could not reach Supabase (presign step). Check internet, ad blockers/VPN, VITE_SUPABASE_URL, and run: supabase functions deploy upload-product-image'
      );
    }
    throw err instanceof Error ? err : new Error(String(err));
  }

  const { uploadUrl, publicUrl } = presignPayload || {};
  if (!uploadUrl || !publicUrl) {
    throw new Error('Presign response missing uploadUrl or publicUrl. Redeploy upload-product-image.');
  }

  const putController = new AbortController();
  const putTimer = setTimeout(() => putController.abort(), PUT_TIMEOUT_MS);

  let putRes;
  try {
    putRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      signal: putController.signal,
      mode: 'cors',
      cache: 'no-store',
    });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error(
        'Upload to R2 timed out. Try a smaller image or check network. If presign works but PUT always hangs, set R2 bucket CORS (supabase/R2-PHASE-1.md Part C.5).'
      );
    }
    if (isLikelyNetworkBlock(err)) {
      if (String(import.meta.env.VITE_R2_FALLBACK_SUPABASE || '') === '1') {
        try {
          return await uploadToSupabaseStorage(file);
        } catch (fallbackErr) {
          const fb = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          throw new Error(
            `R2 upload was blocked and Supabase fallback failed: ${fb}. Original: Browser blocked the upload to Cloudflare R2 (often CORS). Set VITE_R2_UPLOAD_PROXY_URL to your deployed /api/r2-upload, or fix R2 CORS — see supabase/R2-PHASE-1.md Part C.6.`
          );
        }
      }
      throw new Error(
        'Browser blocked the direct upload to Cloudflare R2 (usually CORS). Use the Vercel proxy so files still land in R2: set VITE_R2_UPLOAD_PROXY_URL to https://mirasperfume.com/api/r2-upload (same hostname you deploy). See supabase/R2-PHASE-1.md Part C.6.'
      );
    }
    throw err instanceof Error ? err : new Error(String(err));
  } finally {
    clearTimeout(putTimer);
  }

  if (!putRes.ok) {
    const detail = await putRes.text().catch(() => '');
    throw new Error(
      `R2 rejected upload (${putRes.status}). ${detail.slice(0, 180)}`.trim() +
        ' Check bucket name, presigned URL expiry, and that Content-Type matches the signed request.'
    );
  }

  return publicUrl;
}

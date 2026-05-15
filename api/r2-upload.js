/**
 * Vercel Serverless: receives image as JSON base64, verifies Supabase session, uploads to R2.
 * Avoids browser → r2.cloudflarestorage.com CORS entirely.
 * Netlify equivalent: netlify/functions/r2-upload.mjs (+ netlify.toml rewrite /api/r2-upload).
 *
 * Set in Vercel project env (not VITE_*):
 *   SUPABASE_URL, SUPABASE_ANON_KEY
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL
 * Optional: R2_UPLOAD_CORS_ORIGINS=comma,separated,origins
 */
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const MAX_BYTES = 2_500_000;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function defaultCorsOrigins() {
  const extra = process.env.R2_UPLOAD_CORS_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) || [];
  return new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://mirasperfume.com',
    'https://www.mirasperfume.com',
    ...extra,
  ]);
}

function setCors(res, req) {
  const origin = req.headers.origin;
  const allowed = defaultCorsOrigins();
  if (origin && allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  setCors(res, req);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBase = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');

  if (!supabaseUrl || !supabaseAnonKey) {
    return sendJson(res, 500, { error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY on server' });
  }
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return sendJson(res, 500, { error: 'Missing R2 env vars on server (see api/r2-upload.js header comment)' });
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return sendJson(res, 401, { error: 'Missing Authorization' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return sendJson(res, 401, { error: 'Invalid or expired session' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON body' });
  }

  const { base64, contentType } = body;
  if (!base64 || typeof base64 !== 'string') {
    return sendJson(res, 400, { error: 'Missing base64' });
  }
  const ct = String(contentType || 'image/jpeg');
  if (!ct.startsWith('image/')) {
    return sendJson(res, 400, { error: 'contentType must be an image/*' });
  }

  let buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    return sendJson(res, 400, { error: 'Invalid base64' });
  }
  if (buffer.length > MAX_BYTES) {
    return sendJson(res, 400, { error: `Image too large (max ${MAX_BYTES} bytes)` });
  }

  const ext = ct === 'image/png' ? 'png' : ct === 'image/webp' ? 'webp' : 'jpg';
  const key = `products/${Date.now()}-${randomUUID()}.${ext}`;

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: ct,
      })
    );
  } catch (e) {
    console.error('R2 PutObject failed', e);
    return sendJson(res, 502, { error: e?.message || 'R2 upload failed' });
  }

  const url = `${publicBase}/${key}`;
  return sendJson(res, 200, { ok: true, url });
}

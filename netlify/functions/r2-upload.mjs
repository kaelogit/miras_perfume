/**
 * Netlify Function: JSON { base64, contentType } → verify Supabase JWT → PutObject to R2.
 * Same env vars as api/r2-upload.js (Vercel): SUPABASE_URL, SUPABASE_ANON_KEY, R2_*.
 * Optional: R2_UPLOAD_CORS_ORIGINS
 */
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const MAX_BYTES = 2_500_000;

function getHeader(headers, name) {
  const want = name.toLowerCase();
  for (const [k, v] of Object.entries(headers || {})) {
    if (k.toLowerCase() === want) return typeof v === 'string' ? v : v?.[0] ?? '';
  }
  return '';
}

function defaultCorsOrigins() {
  const raw = process.env.R2_UPLOAD_CORS_ORIGINS;
  const extra = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
  return new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://mirasperfume.com',
    'https://www.mirasperfume.com',
    ...extra,
  ]);
}

function corsHeaders(origin) {
  const allowed = defaultCorsOrigins();
  const h = {
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (origin && allowed.has(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h.Vary = 'Origin';
  }
  return h;
}

function jsonResponse(statusCode, payload, origin) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
    body: JSON.stringify(payload),
  };
}

export const handler = async (event) => {
  const origin = getHeader(event.headers, 'origin');

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' }, origin);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBase = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse(500, { error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY on server' }, origin);
  }
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return jsonResponse(500, { error: 'Missing R2 env vars on server (see netlify/functions/r2-upload.mjs)' }, origin);
  }

  const auth = getHeader(event.headers, 'authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return jsonResponse(401, { error: 'Missing Authorization' }, origin);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: auth } },
  });
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return jsonResponse(401, { error: 'Invalid or expired session' }, origin);
  }

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' }, origin);
  }

  const { base64, contentType } = body;
  if (!base64 || typeof base64 !== 'string') {
    return jsonResponse(400, { error: 'Missing base64' }, origin);
  }
  const ct = String(contentType || 'image/jpeg');
  if (!ct.startsWith('image/')) {
    return jsonResponse(400, { error: 'contentType must be an image/*' }, origin);
  }

  let buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    return jsonResponse(400, { error: 'Invalid base64' }, origin);
  }
  if (buffer.length > MAX_BYTES) {
    return jsonResponse(400, { error: `Image too large (max ${MAX_BYTES} bytes)` }, origin);
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
    return jsonResponse(502, { error: e?.message || 'R2 upload failed' }, origin);
  }

  const url = `${publicBase}/${key}`;
  return jsonResponse(200, { ok: true, url }, origin);
};

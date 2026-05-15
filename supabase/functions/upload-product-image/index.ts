// Presign R2 PUT uploads (admin-only). Supabase Edge → R2 TLS can fail (HandshakeFailure);
// the browser uploads directly to the presigned URL instead.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { AwsClient } from 'https://esm.sh/aws4fetch@1.0.20';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const MAX_BYTES = 2_500_000;
const PRESIGN_EXPIRES_SEC = 600;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const accountId = Deno.env.get('R2_ACCOUNT_ID');
  const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
  const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
  const bucket = Deno.env.get('R2_BUCKET_NAME');
  const publicBase = (Deno.env.get('R2_PUBLIC_BASE_URL') || '').replace(/\/$/, '');

  if (!supabaseUrl || !supabaseAnonKey) return json(500, { error: 'Missing Supabase env' });
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return json(500, { error: 'Missing R2 secrets. See supabase/R2-PHASE-1.md' });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json(401, { error: 'Unauthorized' });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json(401, { error: 'Admin login required' });

  const ct = req.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return json(400, { error: 'Content-Type must be application/json with { contentType, sizeBytes }' });
  }

  try {
    const body = (await req.json()) as { contentType?: string; sizeBytes?: number };
    const contentType = String(body?.contentType || '').trim();
    const sizeBytes = Number(body?.sizeBytes);

    if (!ALLOWED_TYPES.has(contentType)) {
      return json(400, { error: 'contentType must be image/jpeg, image/png, or image/webp' });
    }
    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_BYTES) {
      return json(400, { error: `sizeBytes must be between 1 and ${MAX_BYTES}` });
    }

    const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
    const key = `products/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    const objectUrl = `${endpoint}/${bucket}/${key}`;
    const urlWithExpiry = `${objectUrl}?X-Amz-Expires=${PRESIGN_EXPIRES_SEC}`;

    const aws = new AwsClient({
      accessKeyId,
      secretAccessKey,
      service: 's3',
      region: 'auto',
      retries: 0,
    });

    // Do NOT bind Content-Type into the signature. R2/S3 + browsers often disagree on
    // exact header casing/whitespace; a 403 from R2 may omit CORS headers and surfaces as
    // "browser blocked" / NetworkError. Unsigned Content-Type on PUT is fine for our use case.
    const signedRequest = await aws.sign(urlWithExpiry, {
      method: 'PUT',
      aws: {
        signQuery: true,
        service: 's3',
        region: 'auto',
      },
    });

    const uploadUrl = signedRequest.url;
    const publicUrl = `${publicBase}/${key}`;

    return json(200, {
      ok: true,
      uploadUrl,
      publicUrl,
      expiresInSeconds: PRESIGN_EXPIRES_SEC,
    });
  } catch (error) {
    console.error('upload-product-image (presign) error:', error);
    return json(500, { error: error instanceof Error ? error.message : 'Presign failed' });
  }
});

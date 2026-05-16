# Phase 1: Move new product images to Cloudflare R2

Goal: **Stop new uploads from using Supabase Storage** (fixes growing cached egress).  
Database, Auth, and checkout verification stay on Supabase.

---

## Part A — Cloudflare R2 setup (do this first)

### 1. Create R2 bucket

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **R2 Object Storage** → **Create bucket**.
3. Name: `miras-product-images` (or any name you like).
4. Location: pick closest to Nigeria if offered (otherwise default).
5. Create bucket.

### 2. Create R2 API token

1. R2 → **Manage R2 API Tokens** → **Create API token**.
2. Permissions: **Object Read & Write**.
3. Scope: this bucket only.
4. Create and copy:
   - **Access Key ID**
   - **Secret Access Key**
5. Copy your **Account ID** (shown on R2 overview page).

### 3. Public URL for images (choose one)

**Option A — R2.dev subdomain (fastest, good for Phase 1)**

1. Open your bucket → **Settings**.
2. Enable **Public access** / **R2.dev subdomain** if available.
3. Note the public base URL, e.g. `https://pub-xxxxxxxx.r2.dev`

**Option B — Custom domain (best for production)**

1. Bucket → **Settings** → **Custom Domains**.
2. Add e.g. `cdn.mirasperfume.com` (must be on Cloudflare DNS).
3. Public base URL: `https://cdn.mirasperfume.com`

You will set this as `R2_PUBLIC_BASE_URL` (no trailing slash).

---

## Part B — Supabase Edge Function secrets

In your project folder (with [Supabase CLI](https://supabase.com/docs/guides/cli) linked):

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Set secrets (replace values):

```bash
supabase secrets set R2_ACCOUNT_ID=your_cloudflare_account_id
supabase secrets set R2_ACCESS_KEY_ID=your_r2_access_key_id
supabase secrets set R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
supabase secrets set R2_BUCKET_NAME=miras-product-images
supabase secrets set R2_PUBLIC_BASE_URL=https://pub-xxxxxxxx.r2.dev
```

Deploy the upload function:

```bash
supabase functions deploy upload-product-image
```

Also deploy checkout verification if not done yet:

```bash
supabase functions deploy verify-paystack-checkout
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx
```

---

## Part C — Frontend (already wired in code)

- Admin **Add Product** compresses images in the browser.
- The Edge Function **only presigns** a temporary R2 `PUT` URL (signing is local crypto — no TLS from Supabase to R2). This avoids **TLS HandshakeFailure** some hosts hit when calling `*.r2.cloudflarestorage.com` from Edge.
- The **browser** uploads the file directly to that presigned URL (same TLS as normal web traffic).
- Only logged-in admin (Supabase session) can get a presigned URL.
- No R2 secrets in `.env` on the website — keys stay on Supabase only.

Your `.env` / Vercel env still needs:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_PAYSTACK_KEY=pk_live_...
```

---

### If CORS looks correct but upload still “blocked”

A **403 SignatureDoesNotMatch** (or similar) from R2 often comes **without** `Access-Control-Allow-Origin` on the error response, so the browser reports a **generic network / CORS** failure.

The Edge function was updated to **not** put `Content-Type` into the presigned signature (avoids subtle header mismatches). **Redeploy** after pulling the change:

`supabase functions deploy upload-product-image`

---

## Part C.5 — R2 bucket CORS (required for browser uploads)

Without CORS, the browser `PUT` to the presigned URL will fail (blocked by the browser). You will see our message: *“Browser blocked the upload to Cloudflare R2 (often CORS).”*

### Your case: `http://localhost:5173`

The **Origin** header the browser sends is exactly:

`http://localhost:5173`

(not `https://`, not a trailing slash, not `/admin/...` — only scheme + host + port)

That string **must** appear in your allowed origins list (`AllowedOrigins` in the **Dashboard** JSON, or `allowed.origins` in **Wrangler** JSON).

### Steps (Cloudflare Dashboard)

1. Cloudflare → **R2** → open your bucket (e.g. `miras-product-images`).
2. **Settings** → **CORS policy** → **Add CORS policy** (or edit existing).
3. Open the **JSON** tab and paste **only** the **Dashboard** block below (not the Wrangler block).
4. **Save**. Propagation can take **up to ~30 seconds** (Cloudflare docs).

### Two different JSON shapes (common mistake)

Cloudflare accepts **different JSON** depending on **where** you paste it:

| Where you configure CORS | JSON shape |
|--------------------------|------------|
| **R2 bucket → Settings → CORS → JSON tab** (Dashboard) | **Array** of rules using `AllowedOrigins`, `AllowedMethods`, … (S3-style, below **Dashboard**). |
| **`wrangler r2 bucket cors set --file`** (CLI) | **Object** with `"rules": [ { "allowed": { "origins", "methods", "headers" } } ]` (below **Wrangler**). |

If you paste the **Dashboard** array into a **Wrangler** file (or the other way around), Cloudflare will reject it or it will not apply — that is **not correct** for that path.

---

### Dashboard JSON (use in bucket → Settings → CORS → **JSON** tab)

Use this **only** in the R2 dashboard **JSON** tab. Match [Cloudflare’s presigned-upload CORS example](https://developers.cloudflare.com/r2/buckets/cors/#use-cors-with-a-presigned-url); `AllowedHeaders` lists headers the browser may send on preflight (add more if your Network tab shows others):

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://mirasperfume.com",
      "https://www.mirasperfume.com"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag", "Content-Length"],
    "MaxAgeSeconds": 3600
  }
]
```

Notes:

- Cloudflare’s own example uses **`PUT` only** for presigned uploads; `GET` / `HEAD` are included so public reads of objects still work from the browser. You can add **`OPTIONS`** to `AllowedMethods` if your browser’s preflight requires it; many setups work without it.
- If the preflight request lists extra headers (check DevTools → Network → the **OPTIONS** call → request headers), add each name to `AllowedHeaders` (lowercase in the request is normal; the policy values are matched case-insensitively by most stacks).

---

### Wrangler JSON (`npx wrangler r2 bucket cors set <BUCKET> --file cors.json`)

If you set CORS from the **CLI**, the file must use **`rules`** / **`allowed`**, **not** `AllowedOrigins`:

```json
{
  "rules": [
    {
      "allowed": {
        "origins": [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "https://mirasperfume.com",
          "https://www.mirasperfume.com"
        ],
        "methods": ["GET", "PUT", "HEAD", "OPTIONS"],
        "headers": ["Content-Type", "Content-Length"]
      },
      "exposeHeaders": ["ETag", "Content-Length"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

Then:

```bash
npx wrangler r2 bucket cors set miras-product-images --file cors.json
```

(Replace `miras-product-images` with your bucket name.)

---

### Quick test (localhost only, Dashboard JSON tab)

```json
[
  {
    "AllowedOrigins": ["http://localhost:5173", "http://127.0.0.1:5173"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

After upload works locally, replace with the full **Dashboard** policy including production.

Then try upload again (hard refresh the admin page after saving CORS).

- If you use another Vite port (e.g. `5174`), add `http://localhost:5174` as another origin.
- For **Vercel previews**, add each origin explicitly, e.g. `https://miras-perfume-xxxx.vercel.app`.

---

## Part C.6 — Recommended when presigned R2 `PUT` fails: same-origin upload proxy (still **R2**, not Supabase Storage)

Presigned uploads send the file **from the browser** straight to `*.r2.cloudflarestorage.com`. If that keeps failing with `NetworkError` / “browser blocked” (CORS, extensions, or opaque failures), you do **not** have to give up on R2.

The admin UI POSTs JSON `{ base64, contentType }` to **your own domain**; a serverless handler checks the Supabase session and writes to **R2** with the AWS SDK. Public image URLs stay on your **R2 public base URL**.

**mirasperfume.com is hosted on Netlify** (see response headers: `Server: Netlify`). Use the Netlify function in this repo:

- `netlify/functions/r2-upload.mjs`
- `netlify.toml` rewrites **`/api/r2-upload`** → that function (same path as the optional Vercel `api/r2-upload.js`).

### Netlify checklist (mirasperfume.com)

1. Commit **`netlify.toml`** and **`netlify/functions/`**, push, and let Netlify build. After deploy, open **`https://mirasperfume.com/api/r2-upload`** — expect **405** (GET) or **401** without a session, **not** 404.
2. **Netlify → Site configuration → Environment variables** (same names as the Vercel serverless doc — **no** `VITE_` prefix for these):
   - `SUPABASE_URL` = same value as `VITE_SUPABASE_URL`
   - `SUPABASE_ANON_KEY` = same as `VITE_SUPABASE_ANON_KEY`
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL` = same as your Edge Function secrets for `upload-product-image`
3. **Build / client** env in Netlify (exposed to Vite at build time — **use** `VITE_` prefix):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PAYSTACK_KEY`
   - `VITE_R2_UPLOAD_PROXY_URL=https://mirasperfume.com/api/r2-upload` (match apex vs **www** to your real admin URL)  
   If uploads still return HTML instead of JSON, either redeploy after fixing `public/_redirects` (see below) or set **`VITE_R2_UPLOAD_PROXY_URL=https://mirasperfume.com/.netlify/functions/r2-upload`** (bypasses the `/api/*` rewrite).
4. **Localhost admin** can use the same `VITE_R2_UPLOAD_PROXY_URL` pointing at production; the function allows `Origin: http://localhost:5173`.
5. Optional: `R2_UPLOAD_CORS_ORIGINS` — comma-separated extra allowed origins (e.g. Netlify branch deploy URLs). Defaults include `https://mirasperfume.com`, `https://www.mirasperfume.com`, and localhost.

If you already manage redirects only in the Netlify UI, ensure **`/api/r2-upload`** is rewritten to **`/.netlify/functions/r2-upload`** *before* any catch-all `/* → /index.html` rule (first match wins). This repo ships **`public/_redirects`** with the API line **above** the SPA line so `dist/_redirects` is correct on every build.

### Vercel (alternative)

If the project is deployed on **Vercel** instead, use **`api/r2-upload.js`** and the same server env vars + `VITE_R2_UPLOAD_PROXY_URL` pointing at `https://your-domain.com/api/r2-upload`.

### Presigned `PUT` only (no proxy)

If you **do not** set `VITE_R2_UPLOAD_PROXY_URL`, the app still uses the Edge Function presign + browser `PUT` to R2 — then **Part C.5** CORS must be correct.

### Not recommended if you left Supabase Storage on purpose

`VITE_PRODUCT_IMAGES_DRIVER=supabase` and `VITE_R2_FALLBACK_SUPABASE=1` send uploads to the **Supabase** `product-images` bucket again. Only use if you explicitly accept that path (e.g. temporary debugging), not as the main R2 strategy.

---

## Part D — Test

1. Log in at `/admin/login`.
2. Add a product with 1–2 images.
3. After save, open product on the shop — image should load from your **R2 URL** (not `supabase.co/storage`).
4. In Supabase **Storage**, confirm **no new files** appear in `product-images`.

---

## What Phase 1 does NOT do yet

- Old products still use old Supabase image URLs (still count toward egress until Phase 2 migration).
- Phase 2: bulk-copy images to R2 and update `products.image` / `products.images` in the database.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| `401` on upload | Log out/in at admin; session expired |
| `Missing function secrets` | Run all `supabase secrets set` commands |
| `Upload timed out` | **Redeploy** `upload-product-image`. Presign is fast; a long wait is usually the browser `PUT` to R2 (network/CORS). |
| `HandshakeFailure` / `error sending request for url ...r2.cloudflarestorage.com` | Fixed by current flow: Edge **does not** connect to R2 anymore. **Redeploy** `upload-product-image` and ensure **R2 CORS** (Part C.5) allows your site origin. |
| Images 403/404 | Check `R2_PUBLIC_BASE_URL` and bucket public access / custom domain |
| CORS JSON “invalid” or policy not applying | Dashboard **JSON tab** needs the **`[ { "AllowedOrigins": ... } ]`** array. **`wrangler r2 bucket cors set`** needs **`{ "rules": [ { "allowed": { "origins": ... } } ] }`**. They are not interchangeable. |
| `NetworkError when attempting to fetch resource` | Usually the **browser → R2** `PUT` (CORS / wrong **AllowedOrigins**). Prefer **Part C.6**: `VITE_R2_UPLOAD_PROXY_URL=https://mirasperfume.com/api/r2-upload` (Netlify: `netlify/functions/r2-upload.mjs` + rewrite in `netlify.toml`). If you stay on presigned `PUT`, origins must match **exactly**. Less often: blocked **presign** — ad blockers, `VITE_SUPABASE_URL`, deploy `upload-product-image`. |

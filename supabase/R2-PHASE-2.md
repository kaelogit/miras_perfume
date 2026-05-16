# Phase 2 — Migrate existing product images (Supabase Storage → R2)

After **Phase 1**, new uploads use R2. **Phase 2** moves **old** `products.image` / `products.images` URLs that still point at Supabase Storage so traffic stops hitting Supabase **cached egress**.

## What the script does

1. Reads every row from `products` (`id`, `image`, `images`).
2. Collects unique URLs that look like Supabase Storage object URLs (`*.supabase.co` + `/storage/v1/object/`).
3. For each URL: **HTTP GET** the file, **PutObject** to R2 under `products/migrated/…` (deduped: same URL uploaded once).
4. **Updates** each product row with new R2 public URLs.

It does **not** delete Supabase Storage objects (do that manually after you verify the shop).

## Prerequisites

- R2 bucket + `R2_PUBLIC_BASE_URL` match what you use in production.
- Same R2 API credentials you use for uploads (S3-compatible).
- **Supabase service role key** (Dashboard → Settings → API → `service_role`) in `.env` as `SUPABASE_SERVICE_ROLE_KEY` for the script only. **Never** expose it in the browser or commit it.

Optional: your schema’s `products` policy must allow `UPDATE` for that key. The default schema policy `"Allow all for products"` works with anon too; service role is still recommended.

## `.env` (local only, not committed)

Add alongside your existing keys:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...

R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=miras-product-images
R2_PUBLIC_BASE_URL=https://pub-xxxxx.r2.dev
```

You can omit `SUPABASE_URL` if `VITE_SUPABASE_URL` is already set (the script reads either).

## Run

From the repo root:

```bash
# 1) See what would be migrated (no uploads, no DB writes)
npm run migrate:images-r2 -- --dry-run

# 2) Test on first 3 products only
npm run migrate:images-r2 -- --limit=3

# 3) Full migration
npm run migrate:images-r2
```

## Signed / private Storage URLs

The script only migrates URLs matching **public object** paths (`/storage/v1/object/...`). If any product still uses **short-lived signed** URLs in the DB, fix those in admin first (re-save with public URLs) or extend the script to use the Storage API with a service key.

## After migration

1. Spot-check shop, product pages, and admin edit screens.
2. In Supabase → Storage → `product-images`, delete old objects if you no longer need rollback.
3. Watch Supabase **cached egress** over the next days; it should drop once traffic uses R2 URLs only.

## Phase 3 (optional)

Put a **Cloudflare custom domain** in front of R2 (`cdn.mirasperfume.com`), set `R2_PUBLIC_BASE_URL` to that host for **new** uploads, then run a small SQL or script pass to rewrite old `pub-*.r2.dev` URLs if you care about branding (not required for egress).

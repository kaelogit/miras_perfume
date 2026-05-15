# Supabase migration (from Firebase + Cloudinary)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Settings → API** copy:
   - **Project URL** → `VITE_SUPABASE_URL` in `.env`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY` in `.env`

## 2. Run the database schema

1. In Supabase Dashboard open **SQL Editor**.
2. Paste and run the contents of `supabase/schema.sql`.
3. This creates tables: `products`, `orders`, `messages`, `subscribers` and permissive RLS policies.

## 3. Create the storage bucket and policies for product images

1. Go to **Storage** in the Supabase Dashboard.
2. Click **New bucket**.
3. Name: `product-images`.
4. Enable **Public bucket** (so product image URLs work on the site).
5. Create the bucket.
6. **Run storage policies:** Open **SQL Editor**, paste and run the contents of `supabase/storage-policies.sql`. This allows the admin (authenticated user) to upload images; without it, uploads will fail silently or with "new row violates row-level security".

## 4. Create an admin user (for admin panel login)

1. Go to **Authentication → Users** in the Supabase Dashboard.
2. Click **Add user** → **Create new user**.
3. Enter the email and password you want to use for the admin panel (e.g. admin@miras.com).
4. Use these same credentials on `/admin/login`.

## 5. Product images on Cloudflare R2 (recommended)

Supabase Storage egress can exceed the free tier when many product images are served.  
For **new uploads**, use R2 instead: follow **`supabase/R2-PHASE-1.md`**. The Edge Function returns a **presigned URL**; the browser uploads directly to R2 (avoids TLS issues from some Edge runtimes to R2).

## 6. Install dependencies and run

```bash
npm install --legacy-peer-deps
npm run dev
```

Fill in `.env` with your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Paystack key is unchanged.

## 7. Enable secure server-side payment verification (recommended)

This step ensures checkout totals are re-calculated on the server (live DB prices, including flash sales) before an order is created.

1. Deploy edge function:

```bash
supabase functions deploy verify-paystack-checkout
```

2. Set edge function secrets (Supabase project):

```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically in Supabase Edge Functions.

3. Add idempotency/duplicate protection for payment refs in existing DBs:
   - Run `supabase/payment-hardening.sql` in SQL Editor.

4. Ensure your frontend `.env` has:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PAYSTACK_KEY`

After this, checkout will call the edge function to:
- verify Paystack transaction reference and paid amount
- recompute total from server-side product pricing
- create order only if amounts match

## Data migration from Firebase (optional)

If you had existing products/orders in Firestore:

- **Products:** Export from Firebase (e.g. Firestore export or manual copy), then insert into `products` with the column names from `schema.sql` (snake_case). You can use Supabase **Table Editor** or a small script.
- **Orders / messages / subscribers:** Same idea; match the JSON shape (e.g. `customer` as JSONB, `items` as JSONB).

Firebase Auth users do not transfer; create the admin user in Supabase as in step 4.

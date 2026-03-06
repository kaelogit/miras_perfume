-- Run this in Supabase Dashboard → SQL Editor
-- Required for admin product image uploads to work (bucket: product-images)

-- Allow authenticated users (e.g. admin) to upload to product-images bucket
CREATE POLICY "Authenticated can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow public read so product image URLs work on the site
CREATE POLICY "Public read for product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users to update/delete their uploads (optional)
CREATE POLICY "Authenticated can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

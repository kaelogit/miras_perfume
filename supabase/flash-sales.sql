-- Run this in Supabase SQL Editor for existing projects

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_flash_sale BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS flash_sale_price NUMERIC;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_flash_price_check'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_flash_price_check
      CHECK (
        (is_flash_sale = false AND flash_sale_price IS NULL)
        OR
        (is_flash_sale = true AND flash_sale_price IS NOT NULL AND flash_sale_price > 0 AND flash_sale_price < price)
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_flash_sale ON products(is_flash_sale);

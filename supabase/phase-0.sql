-- Phase 0 migration: social-proof + flash-countdown foundations
-- Run in Supabase SQL Editor

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sold_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS flash_sale_ends_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_sold_count ON public.products(sold_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_flash_ends ON public.products(flash_sale_ends_at);

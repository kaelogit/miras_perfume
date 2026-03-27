-- Phase 2 migration: flash countdown support
-- Run in Supabase SQL Editor

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS flash_sale_ends_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_products_flash_ends ON public.products(flash_sale_ends_at);

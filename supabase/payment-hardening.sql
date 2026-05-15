-- Payment hardening migration
-- Run this in Supabase SQL Editor for existing projects

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_ref_unique
ON public.orders(payment_ref)
WHERE payment_ref IS NOT NULL;

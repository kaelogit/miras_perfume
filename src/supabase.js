import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/** Map product row (snake_case) to app shape (camelCase) */
export function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    price: Number(row.price),
    stock: row.stock ?? 0,
    gender: row.gender,
    scentFamily: row.scent_family,
    collectionType: row.collection_type,
    description: row.description,
    notes: row.notes || [],
    image: row.image,
    images: row.images || [],
    searchKeywords: row.search_keywords || [],
    soldCount: Number(row.sold_count || 0),
    isBestSeller: row.is_best_seller ?? false,
    isNewArrival: row.is_new_arrival ?? false,
    isFlashSale: row.is_flash_sale ?? false,
    flashSalePrice: row.flash_sale_price != null ? Number(row.flash_sale_price) : null,
    flashSaleEndsAt: row.flash_sale_ends_at || null,
    createdAt: row.created_at,
  };
}

export function isFlashSaleActive(product) {
  if (!product) return false;
  const basePrice = Number(product.price) || 0;
  const flashPrice = Number(product.flashSalePrice);
  if (!(Boolean(product.isFlashSale) && Number.isFinite(flashPrice) && flashPrice > 0 && flashPrice < basePrice)) {
    return false;
  }

  if (product.flashSaleEndsAt) {
    const end = new Date(product.flashSaleEndsAt).getTime();
    if (Number.isFinite(end) && Date.now() >= end) return false;
  }

  return true;
}

export function getEffectivePrice(product) {
  if (isFlashSaleActive(product)) return Number(product.flashSalePrice);
  return Number(product?.price) || 0;
}

export function getFlashCountdownParts(endsAt) {
  if (!endsAt) return null;
  const endMs = new Date(endsAt).getTime();
  if (!Number.isFinite(endMs)) return null;
  const diffMs = endMs - Date.now();
  if (diffMs <= 0) return null;

  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { days, hours, minutes, seconds };
}

export function formatFlashCountdown(endsAt) {
  const parts = getFlashCountdownParts(endsAt);
  if (!parts) return null;

  const pad = (n) => String(n).padStart(2, '0');
  if (parts.days > 0) return `${parts.days}d ${pad(parts.hours)}h ${pad(parts.minutes)}m`;
  return `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}

/** Map order row to app shape; date is ISO string */
export function mapOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    date: row.date,
    customer: row.customer,
    items: row.items || [],
    total: Number(row.total),
    paymentRef: row.payment_ref,
    status: row.status,
    courier: row.courier,
    trackingNumber: row.tracking_number,
  };
}

/** Format order date for display (Supabase returns ISO string) */
export function formatOrderDate(date) {
  if (!date) return 'Date Unknown';
  const d = typeof date === 'string' ? new Date(date) : date;
  return isNaN(d.getTime()) ? 'Date Unknown' : d.toLocaleString();
}

/** Storage bucket name for product images */
export const PRODUCT_IMAGES_BUCKET = 'product-images';

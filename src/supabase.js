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
    isBestSeller: row.is_best_seller ?? false,
    isNewArrival: row.is_new_arrival ?? false,
    createdAt: row.created_at,
  };
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

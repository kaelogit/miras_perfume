-- Run this in Supabase Dashboard → SQL Editor

-- Products (replaces Firestore "products")
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  gender TEXT NOT NULL DEFAULT 'women',
  scent_family TEXT NOT NULL DEFAULT 'woody',
  collection_type TEXT NOT NULL DEFAULT 'designer',
  description TEXT,
  notes TEXT[] DEFAULT '{}',
  image TEXT,
  images TEXT[] DEFAULT '{}',
  search_keywords TEXT[] DEFAULT '{}',
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders (replaces Firestore "orders")
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  payment_ref TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  courier TEXT,
  tracking_number TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date DESC);

-- Messages (replaces Firestore "messages")
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  read BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date DESC);

-- Subscribers (replaces Firestore "subscribers")
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now()
);

-- Allow public read/write for now (you can restrict with RLS later)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for subscribers" ON subscribers FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for product images (create in Dashboard → Storage if not exists)
-- Bucket name: product-images, Public bucket: yes

-- 001_schema.sql
-- Wild About Greens: core database schema

-- Products
CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  category        text NOT NULL,   -- 'salad-greens' | 'sauces' | 'dips' | 'dressings' | 'subscriptions' | 'gift-boxes' | 'samplers'
  description     text,
  nutrition_notes text,
  is_bundle       boolean DEFAULT false,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label            text NOT NULL,              -- e.g. "100g tray", "Bundle · 3 trays"
  net_weight_grams int,
  price_paise      int NOT NULL,               -- store money as integer paise
  stock_qty        int NOT NULL DEFAULT 0,
  is_active        boolean DEFAULT true
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name           text NOT NULL,
  customer_phone          text NOT NULL,
  customer_email          text,
  delivery_address        text NOT NULL,
  delivery_pincode        text NOT NULL,
  purchase_type           text NOT NULL,       -- 'one_time' | 'subscription'
  subscription_frequency  text,                -- 'weekly' | 'monthly' | null
  subtotal_paise          int NOT NULL,
  total_paise             int NOT NULL,
  razorpay_order_id       text,
  razorpay_payment_id     text,
  payment_status          text DEFAULT 'pending',  -- 'pending' | 'paid' | 'failed'
  created_at              timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id uuid NOT NULL REFERENCES product_variants(id),
  quantity           int NOT NULL,
  unit_price_paise   int NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

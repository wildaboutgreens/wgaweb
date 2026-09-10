-- 009_product_images_and_tags.sql
-- Add real image and tag support to products

ALTER TABLE products ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id
  ON product_images(product_id);
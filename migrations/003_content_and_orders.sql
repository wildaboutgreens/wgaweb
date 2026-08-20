-- 003_content_and_orders.sql
-- Blog posts, carousel slides, and order fulfillment tracking

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  excerpt       text,
  content       text NOT NULL,
  cover_image_url text,
  is_published  boolean DEFAULT false,
  published_at  timestamptz,
  created_at    timestamptz DEFAULT now()
);

-- Carousel Slides
CREATE TABLE IF NOT EXISTS carousel_slides (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     text NOT NULL,
  link_url      text,
  display_order int NOT NULL DEFAULT 0,
  is_active     boolean DEFAULT true
);

-- Add fulfillment_status to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS fulfillment_status text DEFAULT 'unfulfilled';
  -- 'unfulfilled' | 'shipped' | 'delivered' | 'cancelled'

-- Add email_sent flag for dedup of confirmation emails
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS confirmation_email_sent boolean DEFAULT false;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_active ON carousel_slides(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment ON orders(fulfillment_status);

-- 014_alt_text_fields.sql
-- Add alt_text columns alongside image fields for accessibility

-- Product gallery images
ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS alt_text text;

-- Carousel slides
ALTER TABLE carousel_slides
  ADD COLUMN IF NOT EXISTS alt_text text;

-- Product thumbnails
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS thumbnail_alt_text text;

-- Blog post covers
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS cover_image_alt_text text;

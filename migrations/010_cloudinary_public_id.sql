-- 010_cloudinary_public_id.sql
-- Add cloudinary_public_id to product_images and carousel_slides for automated Cloudinary asset deletion

ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS cloudinary_public_id text;

ALTER TABLE carousel_slides
  ADD COLUMN IF NOT EXISTS cloudinary_public_id text;

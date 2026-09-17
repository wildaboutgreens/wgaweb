-- 017: Convert single category to categories array
ALTER TABLE products ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}'::text[];
UPDATE products SET categories = ARRAY[category] WHERE category IS NOT NULL AND category != '';
ALTER TABLE products DROP COLUMN IF EXISTS category;

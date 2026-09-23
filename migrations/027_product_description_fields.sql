-- 027: Add description_lead and description_highlight to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_lead text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_highlight text;

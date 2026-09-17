-- 016: Add badge_label, highlight_1, highlight_2 to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge_label text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS highlight_1 text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS highlight_2 text;

-- 028: Add detail_accordions and pairs_well_with to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_accordions jsonb DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pairs_well_with jsonb DEFAULT '[]'::jsonb;

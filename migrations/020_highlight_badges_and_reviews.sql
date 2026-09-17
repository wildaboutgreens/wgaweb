-- 020: Add detail_highlight_badges to products and create product_reviews table

-- 1. Add detail_highlight_badges to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_highlight_badges jsonb DEFAULT '[]'::jsonb;

-- Seed default highlight badges for existing products
UPDATE products 
SET detail_highlight_badges = '[
  {"icon": "⚡", "label": "40x Sulforaphane"},
  {"icon": "🛡️", "label": "Zero Pesticides"},
  {"icon": "💧", "label": "Mineral RO Grown"},
  {"icon": "✂️", "label": "Cut to Order"}
]'::jsonb
WHERE detail_highlight_badges IS NULL OR detail_highlight_badges = '[]'::jsonb;

-- 2. Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  reviewer_name text NOT NULL,
  reviewer_location text,
  review_text text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Seed current 4 reviews if not already present
INSERT INTO product_reviews (product_id, reviewer_name, reviewer_location, review_text, rating, display_order, is_active)
SELECT NULL, 'Dr. Neha Verma', 'Sector 8, Chandigarh',
       'I recommend these to all my clinical nutrition patients. The sulforaphane density in living broccoli microgreens is incomparable to anything in a polythene bag at the store.',
       5, 1, true
WHERE NOT EXISTS (SELECT 1 FROM product_reviews WHERE reviewer_name = 'Dr. Neha Verma');

INSERT INTO product_reviews (product_id, reviewer_name, reviewer_location, review_text, rating, display_order, is_active)
SELECT NULL, 'Vikramjit Singh', 'Phase 7, Mohali',
       'They arrive completely alive in their tray! We snip a handful every morning over our eggs and dal. It stays crunchy in the kitchen for over a week.',
       5, 2, true
WHERE NOT EXISTS (SELECT 1 FROM product_reviews WHERE reviewer_name = 'Vikramjit Singh');

INSERT INTO product_reviews (product_id, reviewer_name, reviewer_location, review_text, rating, display_order, is_active)
SELECT NULL, 'Ananya Sharma', 'Sector 14, Panchkula',
       'My kids actually ask for “the baby trees” with their sandwiches. Knowing it is grown with RO mineral water and zero chemicals gives me total peace of mind.',
       5, 3, true
WHERE NOT EXISTS (SELECT 1 FROM product_reviews WHERE reviewer_name = 'Ananya Sharma');

INSERT INTO product_reviews (product_id, reviewer_name, reviewer_location, review_text, rating, display_order, is_active)
SELECT NULL, 'Chef Kabir Grover', 'Sector 26, Chandigarh',
       'The texture, color intensity, and peppery punch are on par with international vertical farms. Absolute game changer for the Tricity.',
       5, 4, true
WHERE NOT EXISTS (SELECT 1 FROM product_reviews WHERE reviewer_name = 'Chef Kabir Grover');

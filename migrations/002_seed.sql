-- 002_seed.sql
-- Test data for development

-- Products
INSERT INTO products (slug, name, category, description, nutrition_notes, is_bundle)
VALUES
  ('broccoli-microgreens', 'Broccoli Microgreens', 'salad-greens',
   'Tender broccoli microgreens packed with sulforaphane. Mild, slightly peppery flavour.',
   'Rich in vitamins C, K, and sulforaphane. High in antioxidants.', false),

  ('sunflower-microgreens', 'Sunflower Microgreens', 'salad-greens',
   'Crunchy sunflower shoots with a nutty, fresh taste. Great in salads and sandwiches.',
   'Excellent source of protein, zinc, and B vitamins.', false),

  ('radish-microgreens', 'Radish Microgreens', 'salad-greens',
   'Spicy radish microgreens that add a kick to any dish.',
   'High in vitamins A, B, C, E, and K. Good source of iron.', false),

  ('classic-trio-bundle', 'Classic Trio Bundle', 'samplers',
   'Our three most popular microgreens — Broccoli, Sunflower, and Radish — in one convenient bundle.',
   NULL, true)
ON CONFLICT (slug) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, label, net_weight_grams, price_paise, stock_qty)
VALUES
  -- Broccoli
  ((SELECT id FROM products WHERE slug = 'broccoli-microgreens'), '50g tray',  50,  9900, 25),
  ((SELECT id FROM products WHERE slug = 'broccoli-microgreens'), '100g tray', 100, 17900, 20),

  -- Sunflower
  ((SELECT id FROM products WHERE slug = 'sunflower-microgreens'), '50g tray',  50,  8900, 30),
  ((SELECT id FROM products WHERE slug = 'sunflower-microgreens'), '100g tray', 100, 15900, 15),

  -- Radish
  ((SELECT id FROM products WHERE slug = 'radish-microgreens'), '50g tray',  50,  7900, 35),
  ((SELECT id FROM products WHERE slug = 'radish-microgreens'), '100g tray', 100, 13900, 25),

  -- Classic Trio Bundle (3 × 50g trays)
  ((SELECT id FROM products WHERE slug = 'classic-trio-bundle'), 'Bundle · 3 trays (50g each)', 150, 24900, 10);

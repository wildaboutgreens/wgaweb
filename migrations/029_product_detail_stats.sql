-- 029: Seed nutrient stat content blocks for product-detail page
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES 
  ('product-detail', 'stats_item_1_number', 'text', '+1500%', now()),
  ('product-detail', 'stats_item_1_text', 'text', 'Sulforaphane concentration compared to full-grown broccoli', now()),
  ('product-detail', 'stats_item_2_number', 'text', '+400%', now()),
  ('product-detail', 'stats_item_2_text', 'text', 'Bioavailable Vitamin C and beta-carotene per gram of greens', now()),
  ('product-detail', 'stats_item_3_number', 'text', '+600%', now()),
  ('product-detail', 'stats_item_3_text', 'text', 'Antioxidant capacity (ORAC value) protecting cells against oxidative stress', now())
ON CONFLICT (page, key) DO NOTHING;

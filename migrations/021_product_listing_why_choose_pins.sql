-- 021: Seed product_listing_why_choose pins for the product listing page

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'product_listing_why_choose', '01 Purity', 'Soil Free & Clean', 'Zero compost pathogens, pests, or dirt grit',
       NULL, NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'product_listing_why_choose' AND title = 'Soil Free & Clean');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'product_listing_why_choose', '02 Water', 'Mineral RO Water', 'Pure drinking-grade reverse osmosis supply',
       NULL, NULL, 2, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'product_listing_why_choose' AND title = 'Mineral RO Water');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'product_listing_why_choose', '03 Timing', '10 Day Peak', 'Maximum biological micronutrient density',
       NULL, NULL, 3, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'product_listing_why_choose' AND title = '10 Day Peak');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'product_listing_why_choose', '04 Freshness', 'Cut to Order', 'Living tray still breathing in your kitchen',
       NULL, NULL, 4, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'product_listing_why_choose' AND title = 'Cut to Order');

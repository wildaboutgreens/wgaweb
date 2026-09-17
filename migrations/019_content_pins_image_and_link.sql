-- 019: Add image_url and link_url to content_pins and seed homepage_shop_by_goal pins
ALTER TABLE content_pins ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE content_pins ADD COLUMN IF NOT EXISTS link_url text;

-- Seed the 8 Shop by Health Goal cards if not already present
INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'Immunity', 'Boost Immunity', 'Broccoli & radish blends',
       'https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products?category=immunity', 1, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'Boost Immunity');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'Weight', 'Weight Management', 'Low cal, high fibre trays',
       'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products?category=weight', 2, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'Weight Management');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'Kids', 'Kids Nutrition', 'Mild, sweet pea shoots',
       'https://plus.unsplash.com/premium_photo-1666184891926-68f52da26f15?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products?category=kids', 3, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'Kids Nutrition');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'Fitness', 'Fitness & Recovery', 'Protein forward sunflower',
       'https://images.unsplash.com/photo-1610622930110-3c076902312a?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products?category=fitness', 4, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'Fitness & Recovery');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'Low GI', 'Diabetes Friendly', 'Low glycemic greens',
       'https://plus.unsplash.com/premium_photo-1699976106481-02baab9811da?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products?category=low-gi', 5, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'Diabetes Friendly');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'Heart', 'Heart Health', 'Potassium rich mixes',
       'https://images.unsplash.com/photo-1647613233075-e0d5546b0f22?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products?category=heart', 6, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'Heart Health');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'Aging', 'Healthy Aging', 'Antioxidant dense trays',
       'https://plus.unsplash.com/premium_photo-1675368982408-ee5a9e0fab6c?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products?category=aging', 7, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'Healthy Aging');

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
SELECT 'homepage_shop_by_goal', 'All', 'All Trays', 'Every variety we grow',
       'https://plus.unsplash.com/premium_photo-1661635029307-2183e966e5a8?fm=jpg&q=80&w=700&auto=format&fit=crop',
       '/products', 8, true
WHERE NOT EXISTS (SELECT 1 FROM content_pins WHERE group_key = 'homepage_shop_by_goal' AND title = 'All Trays');

-- 022: PLP Redesign Content Blocks, Pins, and Global Reviews

-- 1. Insert/Update product-listing content blocks
INSERT INTO content_blocks (page, key, value_type, value)
VALUES
  ('product-listing', 'trust_title', 'text', 'Each tray harvested,\nnear you.'),
  ('product-listing', 'trust_tagline', 'text', 'Grown 10 min away. Cut to order.'),
  ('product-listing', 'trust_bullet_1', 'text', 'Harvested the day you order — never pulled from cold storage.'),
  ('product-listing', 'trust_bullet_2', 'text', 'Zero pesticides, ever — grown indoors on soil-free racks.'),
  ('product-listing', 'trust_bullet_3', 'text', 'Non-GMO seeds only, sourced and verified before sowing.'),
  ('product-listing', 'trust_bullet_4', 'text', 'Zero days in transit — grown right here in the tricity.'),
  ('product-listing', 'trust_bullet_5', 'text', 'You can come see the racks your greens grew on.'),
  ('product-listing', 'why_choose_title', 'text', 'Why is this the right choice for you?'),
  ('product-listing', 'reviews_title', 'text', 'Straight from the gut.'),
  ('product-listing', 'faq_title', 'text', 'Frequently Asked Questions'),
  ('product-listing', 'faq_q1', 'text', 'How fresh are the greens when they arrive?'),
  ('product-listing', 'faq_a1', 'textarea', 'Every tray is cut after you place your order, not pulled from cold storage. Most orders reach you within a few hours of harvest, across Chandigarh, Mohali and Panchkula.'),
  ('product-listing', 'faq_q2', 'text', 'How long do they stay fresh at home?'),
  ('product-listing', 'faq_a2', 'textarea', 'Refrigerated and unwashed, most varieties hold up well for 5–7 days. We''ll include specific care instructions with every order.'),
  ('product-listing', 'faq_q3', 'text', 'Are these actually pesticide-free?'),
  ('product-listing', 'faq_a3', 'textarea', 'Yes — grown indoors on soil-free racks, with nothing sprayed at any stage. We''re working toward publishing third-party lab results as we scale.'),
  ('product-listing', 'faq_q4', 'text', 'Do you deliver outside the tricity?'),
  ('product-listing', 'faq_a4', 'textarea', 'Not yet — we''re starting hyperlocal in Chandigarh, Mohali and Panchkula so every tray reaches you within hours of being cut.'),
  ('product-listing', 'faq_q5', 'text', 'Can restaurants order in bulk?'),
  ('product-listing', 'faq_a5', 'textarea', 'Yes — reach out via our restaurants page for standing orders and bulk pricing.')
ON CONFLICT (page, key) DO UPDATE
SET value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    updated_at = NOW();

-- 2. Update content_pins for group_key = 'product_listing_why_choose'
DELETE FROM content_pins WHERE group_key = 'product_listing_why_choose';

INSERT INTO content_pins (group_key, icon, title, description, image_url, link_url, display_order, is_active)
VALUES
  ('product_listing_why_choose', NULL, E'Grown,\nnot made.', 'seed → sprout · 7-10 days', '/images/why-choose/10-day-peak.jpg', NULL, 1, true),
  ('product_listing_why_choose', NULL, E'RO water as\nprimary source.', 'no heaviness · easy on your gut', '/images/why-choose/mineral-ro-water.jpg', NULL, 2, true),
  ('product_listing_why_choose', NULL, E'Coco-Peat is\nwhere it starts.', 'soil-free · sustainable', '/images/why-choose/soil-free-clean.jpg', NULL, 3, true),
  ('product_listing_why_choose', NULL, E'No Pesticides:\nnever ever.', 'zero spray · zero residue', NULL, NULL, 4, true);

-- 3. Seed 8 global reviews (product_id IS NULL)
-- Deactivate previous placeholder reviews if any
UPDATE product_reviews
SET is_active = false
WHERE product_id IS NULL;

INSERT INTO product_reviews (product_id, reviewer_name, reviewer_location, review_text, rating, display_order, is_active)
VALUES
  (NULL, 'Siddhant Tewari', NULL, 'It''s <strong>very light</strong> like almost drinking water and <strong>no heaviness</strong> on stomach. It''s very light to drink with almost no taste because sweetness is negligible. It cocoa taste which is good', 5, 1, true),
  (NULL, 'Avi Dayal', NULL, '<strong>Clean and easy on gut.</strong> I love you guys added dates and monk fruit for sweetness and also it <strong>felt light</strong> after consuming it. There were no burps and protein farts 🤙', 5, 2, true),
  (NULL, 'Abhishek Nair', NULL, 'Perfect. The taste which was very neutral is what I liked.', 4, 3, true),
  (NULL, 'Hrishikesh', NULL, 'Perfect Mixability', 5, 4, true),
  (NULL, 'Synthia Nathan', NULL, 'This is a <strong>good protein powder.</strong> From a taste perspective it is tasteless and that is ok because you are using <strong>all natural ingredients.</strong> It keeps me filling for a long time and I did not feel any discomfort after...', 4, 5, true),
  (NULL, 'Dr Thanvi', NULL, 'Best till date that I''ve tried. Taste, <strong>non-bloating</strong>', 5, 6, true),
  (NULL, 'Dinesh Choithani', NULL, 'Light on stomach. It is not unnecessarily sweet', 4, 7, true),
  (NULL, 'Meera Kapoor', NULL, 'No jitters, no crash. Just <strong>steady energy</strong> through my whole workday. Didn''t expect that from a greens mix.', 5, 8, true);

-- 011_content_registry_seed.sql
-- Seed fixed content blocks registry for homepage, product-listing, product-detail, and our-story

-- ================= HOMEPAGE =================
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'hero_eyebrow', 'text', 'Grown Locally · Chandigarh · Mohali · Panchkula', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'hero_title', 'text', 'Let''s Eat Well.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'hero_subtitle', 'textarea', 'Non GMO seeds. Mineral water. Coco peat. Clean air.
100% pesticide free. Absolutely nothing else.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'hero_trust_text', 'text', 'Join over 1000+ families eating microgreens across Chandigarh · Mohali · Panchkula', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'hero_image_url', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_badge', 'text', '🔬 The Actual Data', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_title', 'text', 'Why microgreens?', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_headline', 'text', 'Day 10 beats day 30.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_body_1', 'textarea', 'Nutrients don''t wait around. The moment a vegetable is cut, its vitamin content starts to fall, sitting in trucks, warehouses, and shop shelves for days before it reaches you.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_quote', 'textarea', 'We harvest at the exact peak of density, ten days in, then it comes straight to your door, still breathing.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_body_2', 'textarea', 'A single tray of broccoli microgreens can carry many times the vitamin C and antioxidant load of the mature vegetable, by weight.*', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_cta_text', 'text', 'Pathshala →', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'goals_badge', 'text', '🎯 Find Your Fit', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'goals_title', 'text', 'Shop by health goal.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'recipes_badge', 'text', '🍽️ Recipe Khazana', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'recipes_subtitle', 'text', 'Good for you. Easy for you. Delicious for you.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'recipes_title', 'text', 'Sneak greens into your meals.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'recipes_bg_image', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'recipes_cta_text', 'text', 'The Recipe Khazana →', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'story_eyebrow', 'text', 'The Long Story', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'story_title', 'text', 'From a small idea to a healthier tomorrow.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'story_body', 'textarea', 'We started with a simple question: why is it so hard to eat truly fresh, nutrient dense greens in our busy urban lives?

That question led us to microgreens. To science. To clean growing. To long nights perfecting our system. And today, to your table.

We''re not just growing greens. We''re growing a movement for real food, real nutrition, and real change.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'story_cta_text', 'text', 'Our Story →', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'final_cta_title', 'text', 'Join the revolution. Live healthily.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'final_cta_subtitle', 'text', 'One tray at a time, grown ten minutes from your kitchen.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

-- ================= PRODUCT-LISTING =================
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'hero_eyebrow', 'text', '🌱 LIVING HARVEST · TRICITY GROWN', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'hero_title', 'text', 'Cut to order, delivered still breathing.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'hero_subtitle', 'textarea', 'Living microgreen trays delivered on harvest morning across Chandigarh, Mohali & Panchkula. Snip fresh into your daily meals for up to 10 days.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'hero_image_url', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'salad_greens_title', 'text', 'SALAD GREENS', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'salad_greens_desc', 'textarea', 'Crunchy, peppery, living shoots harvested at peak biological density. Keep on your counter for 7 to 10 days living.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'samplers_title', 'text', 'SAMPLERS & BUNDLES', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'samplers_desc', 'textarea', 'Experience the full spectrum of cellular nutrition. Three signature living varieties delivered together at special bundle pricing.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'comparison_title', 'text', 'Living Trays vs Cut Supermarket Packs', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'comparison_subtitle', 'textarea', 'Real nutrient density measured at harvest hour, not after a week in cold transport.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-listing', 'why_choose_title', 'text', 'The Lesser Known Fact', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

-- ================= PRODUCT-DETAIL =================
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'bundle_banner_title', 'text', 'Go For All Three', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'bundle_banner_subtitle', 'textarea', 'Broccoli for sulforaphane, Radish for spice and zinc, Sunflower shoots for protein and crunch. Get our signature 3-tray variety pack delivered together.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'bundle_banner_image', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'bundle_banner_cta_text', 'text', 'Try the Hat Trick Pack →', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'stats_banner_title', 'text', 'Tiny leaves, massive impact.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'stats_banner_subtitle', 'textarea', 'Because microgreens are harvested just after the cotyledon leaves emerge, all the energy concentrated in the seed is available right in the young shoot.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'stats_banner_image', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'reasons_title', 'text', 'Six reasons why we grow this way.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'reasons_subtitle', 'text', 'Clean agriculture engineered for urban nutrition.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'reviews_title', 'text', 'Straight from the gut.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'reviews_subtitle', 'text', 'Verified reviews from our Tricity community', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('product-detail', 'guarantee_text', 'textarea', 'Living Guarantee: If your tray doesn''t stay fresh for 7 days on your counter, we replace it free.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

-- ================= OUR-STORY =================
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'hero_eyebrow', 'text', 'Our Mission', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'hero_title', 'text', 'Helping India rediscover the power of living food', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'hero_cta_text', 'text', 'Know More →', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'movement_title', 'text', 'We''re leading a movement to reimagine healthier living', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'movement_body', 'textarea', 'Every tray we grow represents a simple belief: healthy food shouldn''t be complicated. It shouldn''t be expensive. And it certainly shouldn''t feel like a luxury. Our goal is to help families make one small decision every day that leads to a healthier tomorrow.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'story_eyebrow', 'text', 'Our Story', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'story_title', 'text', 'We have a different relationship with food and we''re out to change yours', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'journey_title', 'text', 'Our journey began with a simple question: why has eating healthy become so difficult?', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'journey_body', 'textarea', 'And then we discovered the extraordinary nutritional power of microgreens, and we realized something surprising. Nature had already created one of the most nutrient-rich foods. Most people had simply never experienced it. That realization became our purpose. Sometimes the smallest ingredients can create the biggest impact. Adding one handful of fresh greens to today''s meal is enough to begin.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'belief_eyebrow', 'text', 'Our Belief', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'belief_title', 'text', 'We believe food should look alive, taste alive, and nourish life.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'belief_image', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'principles_title', 'text', 'Every tray we harvest is a reminder of why we began.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'sampler_banner_title', 'text', 'New to microgreens?', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'sampler_banner_subtitle', 'textarea', 'Start small. One sampler tray, different ways to use it, zero commitment.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'sampler_banner_cta_text', 'text', 'Try the sampler pack →', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'newsletter_title', 'text', 'Want 15% off and the inside scoop?', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'newsletter_subtitle', 'textarea', 'Get 15% off your first order, plus early access to new varieties, growing tips and tricity-only drops.', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;


-- 031: Add health_goals array to products and update homepage_shop_by_goal links
ALTER TABLE products ADD COLUMN IF NOT EXISTS health_goals text[] DEFAULT '{}'::text[];

-- Update link_url in content_pins for homepage_shop_by_goal
UPDATE content_pins
SET link_url = '/health-goals/boost-immunity'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%Immunity%' OR icon ILIKE '%Immunity%');

UPDATE content_pins
SET link_url = '/health-goals/weight-management'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%Weight%' OR icon ILIKE '%Weight%');

UPDATE content_pins
SET link_url = '/health-goals/kids-nutrition'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%Kids%' OR icon ILIKE '%Kids%');

UPDATE content_pins
SET link_url = '/health-goals/fitness-recovery'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%Fitness%' OR icon ILIKE '%Fitness%');

UPDATE content_pins
SET link_url = '/health-goals/diabetes-friendly'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%Diabetes%' OR icon ILIKE '%Low GI%' OR icon ILIKE '%Diabetes%');

UPDATE content_pins
SET link_url = '/health-goals/heart-health'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%Heart%' OR icon ILIKE '%Heart%');

UPDATE content_pins
SET link_url = '/health-goals/healthy-aging'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%Aging%' OR icon ILIKE '%Aging%');

UPDATE content_pins
SET link_url = '/health-goals/all-trays'
WHERE group_key = 'homepage_shop_by_goal' AND (title ILIKE '%All Trays%' OR icon ILIKE '%All%');

-- Seed initial health goals on existing products if not already set
UPDATE products
SET health_goals = ARRAY['boost-immunity', 'healthy-aging', 'diabetes-friendly']
WHERE slug = 'broccoli-microgreens' AND (health_goals IS NULL OR cardinality(health_goals) = 0);

UPDATE products
SET health_goals = ARRAY['fitness-recovery', 'kids-nutrition', 'heart-health']
WHERE slug = 'sunflower-microgreens' AND (health_goals IS NULL OR cardinality(health_goals) = 0);

UPDATE products
SET health_goals = ARRAY['boost-immunity', 'weight-management', 'diabetes-friendly']
WHERE slug = 'radish-microgreens' AND (health_goals IS NULL OR cardinality(health_goals) = 0);

UPDATE products
SET health_goals = ARRAY['boost-immunity', 'kids-nutrition', 'healthy-aging']
WHERE slug = 'carrot-microgreens' AND (health_goals IS NULL OR cardinality(health_goals) = 0);

UPDATE products
SET health_goals = ARRAY['all-trays', 'boost-immunity', 'fitness-recovery', 'weight-management']
WHERE slug = 'classic-trio-bundle' AND (health_goals IS NULL OR cardinality(health_goals) = 0);

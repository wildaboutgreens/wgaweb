-- 026: Add recipe-specific fields to blog_posts table

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS recipe_ingredients jsonb;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS recipe_method_steps jsonb;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS recipe_prep_time text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS recipe_cook_time text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS recipe_difficulty text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS recipe_serves text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS recipe_categories text[] DEFAULT '{}';

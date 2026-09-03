-- 007_recipe_post_type.sql
-- Add post_type to blog_posts for Recipe Khazana

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'article';

CREATE INDEX IF NOT EXISTS idx_blog_posts_type ON blog_posts(post_type);

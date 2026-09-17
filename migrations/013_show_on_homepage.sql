-- 013_show_on_homepage.sql
-- Add show_on_homepage flag to blog_posts for homepage featured recipes

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_blog_posts_homepage ON blog_posts(show_on_homepage) WHERE show_on_homepage = true;

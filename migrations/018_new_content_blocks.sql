-- 018_new_content_blocks.sql
-- Seed new content blocks for hero video, why image, and our-story images

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'hero_video_url', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('homepage', 'why_image', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'story_image_1', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'story_image_2', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('our-story', 'story_image_3', 'image_url', '', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

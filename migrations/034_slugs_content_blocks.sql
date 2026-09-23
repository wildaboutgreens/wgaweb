-- 034: Sync content_blocks for new slugs: 'recipe' and 'pathshala'

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
SELECT 'recipe', key, value_type, value, NOW()
FROM content_blocks
WHERE page = 'recipe-khazana'
ON CONFLICT (page, key) DO UPDATE
SET value = EXCLUDED.value, value_type = EXCLUDED.value_type, updated_at = NOW();

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
SELECT 'pathshala', key, value_type, value, NOW()
FROM content_blocks
WHERE page = 'blog'
ON CONFLICT (page, key) DO UPDATE
SET value = EXCLUDED.value, value_type = EXCLUDED.value_type, updated_at = NOW();

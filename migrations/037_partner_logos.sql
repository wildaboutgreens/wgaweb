-- 037: Create partner_logos table and seed homepage content settings
CREATE TABLE IF NOT EXISTS partner_logos (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed default content blocks for homepage partner logos section
INSERT INTO content_blocks (page, key, value_type, value)
VALUES
  ('homepage', 'homepage_partner_logos_enabled', 'string', 'true'),
  ('homepage', 'homepage_partner_logos_eyebrow', 'string', 'TRUSTED BY'),
  ('homepage', 'homepage_partner_logos_title', 'string', 'Leading organizations choose Wild About Greens.')
ON CONFLICT (page, key) DO NOTHING;

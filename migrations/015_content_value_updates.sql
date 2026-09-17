-- 015_content_value_updates.sql
-- Update existing content_blocks values to match new defaults from client feedback

-- Item 1: "Why Choose Us" → "The Lesser Known Fact"
UPDATE content_blocks
SET value = 'The Lesser Known Fact', updated_at = now()
WHERE page = 'product-listing' AND key = 'why_choose_title'
  AND value = 'Why Choose Wild About Greens?';

-- Item 2: "Shop Fresh Trays" → "Pathshala"
UPDATE content_blocks
SET value = 'Pathshala →', updated_at = now()
WHERE page = 'homepage' AND key = 'why_cta_text'
  AND value = 'Shop Fresh Trays →';

-- Item 9: Bundle CTA → "Try the Hat Trick Pack"
UPDATE content_blocks
SET value = 'Try the Hat Trick Pack →', updated_at = now()
WHERE page = 'product-detail' AND key = 'bundle_banner_cta_text'
  AND value = 'Shop Tricity Trio Bundle →';

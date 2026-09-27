-- 040_remove_regional_terms.sql: Remove regional location names (Tricity, Chandigarh, Mohali, Panchkula) for general access nationwide

-- 1. Content blocks updates
UPDATE content_blocks 
SET value = 'Grown Locally · Delivered Fresh Daily', updated_at = now()
WHERE page = 'homepage' AND key = 'hero_eyebrow';

UPDATE content_blocks 
SET value = 'Regular salad greens are fine. They''re just not doing enough. Here''s why thousands of health-conscious households added a spoonful to every plate.', updated_at = now()
WHERE page = 'product-detail' AND key = 'reasons_subtitle';

UPDATE content_blocks 
SET value = 'Verified reviews from our community', updated_at = now()
WHERE page = 'product-detail' AND key = 'reviews_subtitle';

UPDATE content_blocks 
SET value = '🌱 LIVING HARVEST · HARVESTED TO ORDER', updated_at = now()
WHERE page = 'product-listing' AND key = 'hero_eyebrow';

UPDATE content_blocks 
SET value = 'Living microgreen trays delivered on harvest morning to your doorstep. Snip fresh into your daily meals for up to 10 days.', updated_at = now()
WHERE page = 'product-listing' AND key = 'hero_subtitle';

UPDATE content_blocks 
SET value = 'Zero days in transit, harvested fresh on the morning of delivery.', updated_at = now()
WHERE page = 'product-listing' AND key = 'trust_bullet_4';

UPDATE content_blocks 
SET value = 'Every tray is cut after you place your order, not pulled from cold storage. Most orders reach your doorstep freshly packed for peak vitality.', updated_at = now()
WHERE page = 'product-listing' AND key = 'faq_a1';

UPDATE content_blocks 
SET value = 'How is delivery handled?', updated_at = now()
WHERE page = 'product-listing' AND key = 'faq_q4';

UPDATE content_blocks 
SET value = 'We harvest on schedule so every living tray reaches your doorstep fresh within hours of harvest.', updated_at = now()
WHERE page = 'product-listing' AND key = 'faq_a4';

UPDATE content_blocks 
SET value = 'Get 15% off your first order, plus early access to new varieties, growing tips and exclusive seasonal drops.', updated_at = now()
WHERE key = 'newsletter_subtitle';

UPDATE content_blocks 
SET value = 'Enter your order number along with your phone number and email address to view the live harvest and delivery status.', updated_at = now()
WHERE page = 'track-order' AND key = 'track_subtitle';

UPDATE content_blocks 
SET value = 'Grown with mineral water & clean air · Harvested morning of delivery', updated_at = now()
WHERE page = 'track-order' AND key = 'track_harvest_note';

-- 2. Product reviews updates
UPDATE product_reviews
SET reviewer_location = 'Verified Buyer'
WHERE reviewer_location ILIKE '%chandigarh%' 
   OR reviewer_location ILIKE '%mohali%' 
   OR reviewer_location ILIKE '%panchkula%'
   OR reviewer_location ILIKE '%tricity%';

UPDATE product_reviews
SET review_text = 'The texture, color intensity, and peppery punch are on par with international vertical farms. Absolute game changer for fresh dining.'
WHERE review_text ILIKE '%Absolute game changer for the Tricity%';

-- 3. Health goals content updates
UPDATE health_goals_content
SET popup_description = 'Browse our complete living microgreen lineup. Grown with 100% mineral RO water and zero pesticides on vertical indoor climate racks.', updated_at = now()
WHERE id = 'all-trays';

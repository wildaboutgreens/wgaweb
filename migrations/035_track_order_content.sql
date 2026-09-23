-- Migration 035: Track Order Content Blocks
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES
  ('track-order', 'track_eyebrow', 'text', 'Real-Time Harvest & Delivery Tracking', now()),
  ('track-order', 'track_title', 'text', 'Track Your Order', now()),
  ('track-order', 'track_subtitle', 'text', 'Enter your order number along with your phone number or email to view the live harvest and delivery status across Chandigarh, Mohali & Panchkula.', now()),
  ('track-order', 'track_support_phone', 'text', '+91 98XXXXXXXX', now()),
  ('track-order', 'track_support_email', 'text', 'hello@wildaboutgreens.com', now()),
  ('track-order', 'track_harvest_note', 'text', 'Grown with mineral water & clean air · Harvested morning of delivery in Tricity', now())
ON CONFLICT (page, key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

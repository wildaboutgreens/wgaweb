-- 030: Add subscription_trays and subscription_weeks to order_items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS subscription_trays INT DEFAULT NULL;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS subscription_weeks INT DEFAULT NULL;

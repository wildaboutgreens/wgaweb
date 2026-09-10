-- 008_order_number.sql
-- Add human-friendly order number column to orders

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

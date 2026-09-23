-- Migration 036: Return and Exchange Requests Table
CREATE TABLE IF NOT EXISTS return_exchange_requests (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number  text UNIQUE NOT NULL,
  order_id       uuid REFERENCES orders(id) ON DELETE SET NULL,
  order_number   text NOT NULL,
  customer_name  text,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  request_type   text NOT NULL DEFAULT 'return', -- 'return' | 'exchange'
  reason         text NOT NULL,
  status         text NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected' | 'completed'
  admin_notes    text,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_return_requests_order_number ON return_exchange_requests(order_number);
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON return_exchange_requests(status);
CREATE INDEX IF NOT EXISTS idx_return_requests_created_at ON return_exchange_requests(created_at DESC);

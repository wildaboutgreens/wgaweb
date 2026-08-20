-- 004_leads.sql
-- Newsletter subscribers, business inquiries, and stock management

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  source        text,                 -- e.g. 'homepage', nullable
  subscribed_at timestamptz DEFAULT now()
);

-- Business / Restaurant Inquiries
CREATE TABLE IF NOT EXISTS business_inquiries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_name  text NOT NULL,
  phone         text NOT NULL,
  email         text,
  message       text,
  status        text DEFAULT 'new',    -- 'new' | 'contacted' | 'closed'
  created_at    timestamptz DEFAULT now()
);

-- Add stock_decremented flag to orders for dedup on stock decrement
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS stock_decremented boolean DEFAULT false;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_business_inquiries_status ON business_inquiries(status);

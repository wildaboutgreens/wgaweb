-- 005_rate_limits.sql
-- Rate limiting log for public routes

CREATE TABLE IF NOT EXISTS rate_limit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address  text NOT NULL,
  route       text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Index for efficient lookups by IP + route + time window
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup
  ON rate_limit_log (ip_address, route, created_at DESC);

-- Periodic cleanup: delete rows older than 1 hour to keep the table small.
-- Run this manually or via a cron job:
--   DELETE FROM rate_limit_log WHERE created_at < now() - interval '1 hour';

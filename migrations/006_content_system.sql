-- Migration 006: Content Management System
-- Adds content_blocks, content_pins tables and extends carousel_slides

-- Content blocks: key-value store for editable text/images per page
CREATE TABLE IF NOT EXISTS content_blocks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page        text NOT NULL,
  key         text NOT NULL,
  value_type  text NOT NULL DEFAULT 'text',
  value       text NOT NULL DEFAULT '',
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(page, key)
);

-- Content pins: repeatable icon+title+description groups
CREATE TABLE IF NOT EXISTS content_pins (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key     text NOT NULL,
  icon          text,
  title         text NOT NULL,
  description   text,
  display_order int NOT NULL DEFAULT 0,
  is_active     boolean DEFAULT true
);

-- Extend carousel_slides with carousel_key for multi-carousel support
ALTER TABLE carousel_slides
  ADD COLUMN IF NOT EXISTS carousel_key text NOT NULL DEFAULT 'homepage_hero';

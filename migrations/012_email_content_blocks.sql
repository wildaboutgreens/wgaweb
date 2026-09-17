-- 012_email_content_blocks.sql
-- Seed newsletter thank-you email content blocks

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'newsletter_thankyou_subject', 'text', 'Welcome to Wild About Greens! [placeholder — replace with real copy]', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'newsletter_thankyou_body', 'textarea', E'Hi there!\n\nWelcome to Wild About Greens — we''re so glad you''re here. 🌱\n\n[placeholder — replace with real copy]\n\nStay fresh,\nThe Wild About Greens Team', now())
ON CONFLICT (page, key) DO UPDATE SET value_type = EXCLUDED.value_type;

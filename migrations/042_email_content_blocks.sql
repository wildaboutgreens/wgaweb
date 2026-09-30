-- 042_email_content_blocks.sql
-- Seed Order Confirmation & Newsletter Email content blocks for Resend

-- Order Confirmation Email
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'order_confirmation_subject', 'text', 'Wild About Greens: Order #{order_number} Confirmed! 🌱', now())
ON CONFLICT (page, key) DO NOTHING;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'order_confirmation_heading', 'text', 'Thanks for your order, {customer_name}!', now())
ON CONFLICT (page, key) DO NOTHING;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'order_confirmation_intro', 'textarea', 'We''ve received your order and payment. Our urban farm team will harvest and prepare your living microgreens fresh for delivery.', now())
ON CONFLICT (page, key) DO NOTHING;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'order_confirmation_footer', 'textarea', 'Questions about your delivery? Reply directly to this email or reach us on WhatsApp. Thank you for supporting sustainable urban farming!', now())
ON CONFLICT (page, key) DO NOTHING;

-- Newsletter Welcome Email
INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'newsletter_thankyou_subject', 'text', 'Welcome to Wild About Greens! 🌱', now())
ON CONFLICT (page, key) DO NOTHING;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'newsletter_thankyou_heading', 'text', 'Welcome to the Wild About Greens Family!', now())
ON CONFLICT (page, key) DO NOTHING;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'newsletter_thankyou_body', 'textarea', E'Hi there!\n\nWelcome to Wild About Greens, we''re thrilled to have you with us. 🌱\n\nHere is your exclusive 15% discount for your first order: USE CODE: WELCOME15\n\nStay fresh,\nThe Wild About Greens Team', now())
ON CONFLICT (page, key) DO NOTHING;

INSERT INTO content_blocks (page, key, value_type, value, updated_at)
VALUES ('emails', 'newsletter_thankyou_footer', 'textarea', 'Fresh living harvest delivered straight from our indoor farm to your doorstep.', now())
ON CONFLICT (page, key) DO NOTHING;

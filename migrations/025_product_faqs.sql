-- 025: Add faqs jsonb column to products table and seed default FAQs

ALTER TABLE products ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;

-- Seed initial FAQs for existing products if empty
UPDATE products
SET faqs = '[
  {
    "question": "How fresh are the greens when they arrive?",
    "answer": "Every tray is cut after you place your order, not pulled from cold storage. Most orders reach you within a few hours of harvest, across Chandigarh, Mohali and Panchkula."
  },
  {
    "question": "How long do they stay fresh at home?",
    "answer": "Refrigerated and unwashed, most varieties hold up well for 5–7 days. We include specific care instructions with every order."
  },
  {
    "question": "Are these actually pesticide-free?",
    "answer": "Yes, grown indoors on soil-free racks, with nothing sprayed at any stage. We''re working toward publishing third-party lab results as we scale."
  },
  {
    "question": "Do you deliver outside the tricity?",
    "answer": "Not yet. We''re starting hyperlocal in Chandigarh, Mohali and Panchkula so every tray reaches you within hours of being cut."
  },
  {
    "question": "Can restaurants order in bulk?",
    "answer": "Yes, reach out via our restaurants page for standing orders and bulk pricing."
  },
  {
    "question": "What if a tray shows up wilted or damaged?",
    "answer": "Send us a quick photo on WhatsApp within 12 hours of delivery, and we''ll replace the tray on our next delivery run or refund it immediately, no questions asked."
  }
]'::jsonb
WHERE faqs IS NULL OR faqs = '[]'::jsonb;

-- 024: Populate badges, highlights, and thumbnails for products if missing
UPDATE products
SET
  badge_label = COALESCE(badge_label, 'Customer Favorite'),
  highlight_1 = COALESCE(highlight_1, 'Nutty · protein-forward crunch'),
  highlight_2 = COALESCE(highlight_2, '7-day shelf · zero pesticide'),
  thumbnail_url = COALESCE(thumbnail_url, 'https://res.cloudinary.com/qjoihkpr/image/upload/v1789480608/products/sunflower-microgreens/gallery/resxy8nojrz1jnlaosgc.avif')
WHERE slug = 'sunflower-microgreens';

UPDATE products
SET
  badge_label = COALESCE(badge_label, 'Peak Flavour'),
  highlight_1 = COALESCE(highlight_1, 'Peppery bite · purple stems'),
  highlight_2 = COALESCE(highlight_2, '6-day shelf · zero pesticide')
WHERE slug = 'radish-microgreens';

UPDATE products
SET
  badge_label = COALESCE(badge_label, 'Value Bundle'),
  highlight_1 = COALESCE(highlight_1, 'Bundle · 3 living trays'),
  highlight_2 = COALESCE(highlight_2, 'Broccoli + Sunflower + Radish'),
  thumbnail_url = COALESCE(thumbnail_url, 'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=800&auto=format&fit=crop')
WHERE slug = 'classic-trio-bundle';

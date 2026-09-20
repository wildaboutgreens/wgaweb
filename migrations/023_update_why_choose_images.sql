-- 023: Update content_pins for product_listing_why_choose with the 4 transparent PNG images from /right choice/

UPDATE content_pins
SET image_url = '/right%20choice/grown-not-made.png'
WHERE group_key = 'product_listing_why_choose' AND display_order = 1;

UPDATE content_pins
SET image_url = '/right%20choice/ro-water.png'
WHERE group_key = 'product_listing_why_choose' AND display_order = 2;

UPDATE content_pins
SET image_url = '/right%20choice/coco-peat.png'
WHERE group_key = 'product_listing_why_choose' AND display_order = 3;

UPDATE content_pins
SET image_url = '/right%20choice/no-pest.png'
WHERE group_key = 'product_listing_why_choose' AND display_order = 4;

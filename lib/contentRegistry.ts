export interface ContentFieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image_url' | 'recipe_select' | 'product_select' | 'mascot_select';
  defaultValue: string;
  description?: string;
}

export const CONTENT_REGISTRY: Record<string, ContentFieldDef[]> = {
  homepage: [
    {
      key: 'hero_eyebrow',
      label: 'Hero Eyebrow / Pill',
      type: 'text',
      defaultValue: 'Grown Locally · Chandigarh · Mohali · Panchkula',
    },
    {
      key: 'hero_title',
      label: 'Hero Headline',
      type: 'text',
      defaultValue: "Let's Eat Well.",
    },
    {
      key: 'hero_subtitle',
      label: 'Hero Subtitle',
      type: 'textarea',
      defaultValue:
        'Non GMO seeds. Mineral water. Coco peat. Clean air.\n100% pesticide free. Absolutely nothing else.',
    },
    {
      key: 'hero_trust_text',
      label: 'Hero Trust Line / Social Proof',
      type: 'text',
      defaultValue:
        'Join over 1000+ families eating microgreens across Chandigarh · Mohali · Panchkula',
    },
    {
      key: 'hero_image_url',
      label: 'Hero Background Image',
      type: 'image_url',
      defaultValue: '',
      description: 'Upload a custom photo for the homepage hero background.',
    },
    {
      key: 'hero_video_url',
      label: 'Hero Background Video (Optional)',
      type: 'image_url',
      defaultValue: '',
      description: 'Upload a video for the homepage hero background. Autoplay, muted, loop. If set, replaces the hero photo.',
    },
    {
      key: 'why_badge',
      label: 'Why Microgreens Badge',
      type: 'text',
      defaultValue: '🔬 The Actual Data',
    },
    {
      key: 'why_title',
      label: 'Why Microgreens Section Title',
      type: 'text',
      defaultValue: 'Why microgreens?',
    },
    {
      key: 'why_headline',
      label: 'Why Microgreens Callout Headline',
      type: 'text',
      defaultValue: 'Day 10 beats day 30.',
    },
    {
      key: 'why_body_1',
      label: 'Why Microgreens Paragraph 1',
      type: 'textarea',
      defaultValue:
        "Nutrients don't wait around. The moment a vegetable is cut, its vitamin content starts to fall, sitting in trucks, warehouses, and shop shelves for days before it reaches you.",
    },
    {
      key: 'why_quote',
      label: 'Why Microgreens Quote Callout',
      type: 'textarea',
      defaultValue:
        'We harvest at the exact peak of density, ten days in, then it comes straight to your door, still breathing.',
    },
    {
      key: 'why_body_2',
      label: 'Why Microgreens Paragraph 2',
      type: 'textarea',
      defaultValue:
        'A single tray of broccoli microgreens can carry many times the vitamin C and antioxidant load of the mature vegetable, by weight.*',
    },
    {
      key: 'why_cta_text',
      label: 'Why Microgreens CTA Button',
      type: 'text',
      defaultValue: 'Pathshala →',
    },
    {
      key: 'why_image',
      label: 'Why Microgreens Section Image',
      type: 'image_url',
      defaultValue: '',
      description: 'Optional image to show in the "Day X beats Day Y" section alongside the data chart.',
    },
    {
      key: 'goals_badge',
      label: 'Health Goals Section Badge',
      type: 'text',
      defaultValue: '🎯 Find Your Fit',
    },
    {
      key: 'goals_title',
      label: 'Health Goals Section Title',
      type: 'text',
      defaultValue: 'Shop by health goal.',
    },
    {
      key: 'recipes_badge',
      label: 'Recipe Khazana Badge',
      type: 'text',
      defaultValue: '🍽️ Recipe Khazana',
    },
    {
      key: 'recipes_subtitle',
      label: 'Recipe Khazana Subtitle',
      type: 'text',
      defaultValue: 'Good for you. Easy for you. Delicious for you.',
    },
    {
      key: 'recipes_title',
      label: 'Recipe Khazana Headline',
      type: 'text',
      defaultValue: 'Sneak greens into your meals.',
    },
    {
      key: 'recipes_pinned_1',
      label: 'Featured Recipe 01 (Recipe 01 / 02)',
      type: 'recipe_select',
      defaultValue: 'pea-shoot-citrus-summer-salad',
      description: 'Select the 1st recipe displayed as Recipe 01 / 02 in homepage Recipe Khazana.',
    },
    {
      key: 'recipes_pinned_2',
      label: 'Featured Recipe 02 (Recipe 02 / 02)',
      type: 'recipe_select',
      defaultValue: 'crispy-broccoli-microgreen-toast',
      description: 'Select the 2nd recipe displayed as Recipe 02 / 02 in homepage Recipe Khazana.',
    },
    {
      key: 'recipes_bg_image',
      label: 'Recipe Khazana Background Image',
      type: 'image_url',
      defaultValue: '',
      description: 'Background image for the Recipe Khazana section.',
    },
    {
      key: 'recipes_cta_text',
      label: 'Recipe Khazana CTA Button',
      type: 'text',
      defaultValue: 'The Recipe Khazana →',
    },
    {
      key: 'story_eyebrow',
      label: 'Story Section Eyebrow',
      type: 'text',
      defaultValue: 'The Long Story',
    },
    {
      key: 'story_title',
      label: 'Story Section Headline',
      type: 'text',
      defaultValue: 'From a small idea to a healthier tomorrow.',
    },
    {
      key: 'story_body',
      label: 'Story Section Body',
      type: 'textarea',
      defaultValue:
        "We started with a simple question: why is it so hard to eat truly fresh, nutrient dense greens in our busy urban lives?\n\nThat question led us to microgreens. To science. To clean growing. To long nights perfecting our system. And today, to your table.\n\nWe're not just growing greens. We're growing a movement for real food, real nutrition, and real change.",
    },
    {
      key: 'story_cta_text',
      label: 'Story Section CTA Button',
      type: 'text',
      defaultValue: 'Our Story →',
    },
    {
      key: 'final_cta_title',
      label: 'Final CTA Headline',
      type: 'text',
      defaultValue: 'Join the revolution. Live healthily.',
    },
    {
      key: 'final_cta_subtitle',
      label: 'Final CTA Subtitle',
      type: 'text',
      defaultValue: 'One tray at a time, grown ten minutes from your kitchen.',
    },
  ],

  'product-listing': [
    {
      key: 'hero_eyebrow',
      label: 'Hero Eyebrow / Pill',
      type: 'text',
      defaultValue: '🌱 LIVING HARVEST · TRICITY GROWN',
    },
    {
      key: 'hero_title',
      label: 'Hero Headline',
      type: 'text',
      defaultValue: 'Cut to order, delivered still breathing.',
    },
    {
      key: 'hero_subtitle',
      label: 'Hero Subtitle',
      type: 'textarea',
      defaultValue:
        'Living microgreen trays delivered on harvest morning across Chandigarh, Mohali & Panchkula. Snip fresh into your daily meals for up to 10 days.',
    },
    {
      key: 'hero_image_url',
      label: 'Hero Banner Image',
      type: 'image_url',
      defaultValue: '',
      description: 'Right column photo for the product catalog hero section.',
    },
    {
      key: 'salad_greens_title',
      label: 'Salad Greens Category Title',
      type: 'text',
      defaultValue: 'SALAD GREENS',
    },
    {
      key: 'salad_greens_desc',
      label: 'Salad Greens Category Description',
      type: 'textarea',
      defaultValue:
        'Crunchy, peppery, living shoots harvested at peak biological density. Keep on your counter for 7 to 10 days living.',
    },
    {
      key: 'samplers_title',
      label: 'Samplers & Bundles Category Title',
      type: 'text',
      defaultValue: 'SAMPLERS & BUNDLES',
    },
    {
      key: 'samplers_desc',
      label: 'Samplers & Bundles Category Description',
      type: 'textarea',
      defaultValue:
        'Experience the full spectrum of cellular nutrition. Three signature living varieties delivered together at special bundle pricing.',
    },
    {
      key: 'trust_title',
      label: 'Trust Hero Headline',
      type: 'text',
      defaultValue: 'Each tray harvested,\nnear you.',
    },
    {
      key: 'trust_tagline',
      label: 'Trust Hero Handwritten Tagline',
      type: 'text',
      defaultValue: 'Grown 10 min away. Cut to order.',
    },
    {
      key: 'trust_bullet_1',
      label: 'Trust Hero Bullet 1',
      type: 'text',
      defaultValue: 'Harvested the day you order, never pulled from cold storage.',
    },
    {
      key: 'trust_bullet_2',
      label: 'Trust Hero Bullet 2',
      type: 'text',
      defaultValue: 'Zero pesticides, ever. Grown indoors on soil-free racks.',
    },
    {
      key: 'trust_bullet_3',
      label: 'Trust Hero Bullet 3',
      type: 'text',
      defaultValue: 'Non-GMO seeds only, sourced and verified before sowing.',
    },
    {
      key: 'trust_bullet_4',
      label: 'Trust Hero Bullet 4',
      type: 'text',
      defaultValue: 'Zero days in transit, grown right here in the tricity.',
    },
    {
      key: 'trust_bullet_5',
      label: 'Trust Hero Bullet 5',
      type: 'text',
      defaultValue: 'You can come see the racks your greens grew on.',
    },
    {
      key: 'why_choose_title',
      label: 'Why Choose Us Title',
      type: 'text',
      defaultValue: 'Why is this the right choice for you?',
    },
    {
      key: 'reviews_title',
      label: 'Reviews Section Title',
      type: 'text',
      defaultValue: 'Straight from the gut.',
    },
    {
      key: 'sampler_banner_title',
      label: 'Sampler Banner Title',
      type: 'text',
      defaultValue: 'New to microgreens?',
    },
    {
      key: 'sampler_banner_subtitle',
      label: 'Sampler Banner Subtitle',
      type: 'textarea',
      defaultValue:
        'Start small. One sampler tray, different ways to use it, zero commitment.',
    },
    {
      key: 'sampler_banner_cta_text',
      label: 'Sampler Banner CTA Text',
      type: 'text',
      defaultValue: 'Try the sampler pack →',
    },
    {
      key: 'faq_title',
      label: 'FAQ Section Title',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
    },
    {
      key: 'faq_q1',
      label: 'FAQ Question 1',
      type: 'text',
      defaultValue: 'How fresh are the greens when they arrive?',
    },
    {
      key: 'faq_a1',
      label: 'FAQ Answer 1',
      type: 'textarea',
      defaultValue:
        'Every tray is cut after you place your order, not pulled from cold storage. Most orders reach you within a few hours of harvest, across Chandigarh, Mohali and Panchkula.',
    },
    {
      key: 'faq_q2',
      label: 'FAQ Question 2',
      type: 'text',
      defaultValue: 'How long do they stay fresh at home?',
    },
    {
      key: 'faq_a2',
      label: 'FAQ Answer 2',
      type: 'textarea',
      defaultValue:
        "Refrigerated and unwashed, most varieties hold up well for 5–7 days. We'll include specific care instructions with every order.",
    },
    {
      key: 'faq_q3',
      label: 'FAQ Question 3',
      type: 'text',
      defaultValue: 'Are these actually pesticide-free?',
    },
    {
      key: 'faq_a3',
      label: 'FAQ Answer 3',
      type: 'textarea',
      defaultValue:
        "Yes, grown indoors on soil-free racks, with nothing sprayed at any stage. We're working toward publishing third-party lab results as we scale.",
    },
    {
      key: 'faq_q4',
      label: 'FAQ Question 4',
      type: 'text',
      defaultValue: 'Do you deliver outside the tricity?',
    },
    {
      key: 'faq_a4',
      label: 'FAQ Answer 4',
      type: 'textarea',
      defaultValue:
        "Not yet. We're starting hyperlocal in Chandigarh, Mohali and Panchkula so every tray reaches you within hours of being cut.",
    },
    {
      key: 'faq_q5',
      label: 'FAQ Question 5',
      type: 'text',
      defaultValue: 'Can restaurants order in bulk?',
    },
    {
      key: 'faq_a5',
      label: 'FAQ Answer 5',
      type: 'textarea',
      defaultValue:
        'Yes, reach out via our restaurants page for standing orders and bulk pricing.',
    },
    {
      key: 'newsletter_title',
      label: 'Newsletter Title',
      type: 'text',
      defaultValue: 'Want 15% off and the inside scoop?',
    },
    {
      key: 'newsletter_subtitle',
      label: 'Newsletter Subtitle',
      type: 'textarea',
      defaultValue:
        'Get 15% off your first order, plus early access to new varieties, growing tips and tricity-only drops.',
    },
  ],

  'product-detail': [
    {
      key: 'bundle_banner_title',
      label: 'Tricity Trio Banner Title',
      type: 'text',
      defaultValue: 'Go For All Three',
    },
    {
      key: 'bundle_banner_subtitle',
      label: 'Tricity Trio Banner Subtitle',
      type: 'textarea',
      defaultValue:
        'Broccoli for sulforaphane, Radish for spice and zinc, Sunflower shoots for protein and crunch. Get our signature 3-tray variety pack delivered together.',
    },
    {
      key: 'bundle_banner_image',
      label: 'Tricity Trio Banner Image',
      type: 'image_url',
      defaultValue: '',
      description: 'Media image for the Tricity Trio bundle promo banner.',
    },
    {
      key: 'bundle_banner_cta_text',
      label: 'Tricity Trio Banner CTA Button',
      type: 'text',
      defaultValue: 'Try the Hat Trick Pack →',
    },
    {
      key: 'stats_banner_title',
      label: 'Nutrient Stats Banner Title',
      type: 'text',
      defaultValue: 'Tiny leaves, massive impact.',
    },
    {
      key: 'stats_banner_subtitle',
      label: 'Nutrient Stats Banner Subtitle',
      type: 'textarea',
      defaultValue:
        'Because microgreens are harvested just after the cotyledon leaves emerge, all the energy concentrated in the seed is available right in the young shoot.',
    },
    {
      key: 'stats_banner_image',
      label: 'Nutrient Stats Banner Image',
      type: 'image_url',
      defaultValue: '',
      description: 'Media image for the Nutrient Stats section.',
    },
    {
      key: 'stats_item_1_number',
      label: 'Nutrient Stat 1 — Value / Metric',
      type: 'text',
      defaultValue: '+1500%',
      description: 'First stat metric or percentage, e.g. +1500%',
    },
    {
      key: 'stats_item_1_text',
      label: 'Nutrient Stat 1 — Description',
      type: 'text',
      defaultValue: 'Sulforaphane concentration compared to full-grown broccoli',
      description: 'Description text next to Stat 1.',
    },
    {
      key: 'stats_item_2_number',
      label: 'Nutrient Stat 2 — Value / Metric',
      type: 'text',
      defaultValue: '+400%',
      description: 'Second stat metric or percentage, e.g. +400%',
    },
    {
      key: 'stats_item_2_text',
      label: 'Nutrient Stat 2 — Description',
      type: 'text',
      defaultValue: 'Bioavailable Vitamin C and beta-carotene per gram of greens',
      description: 'Description text next to Stat 2.',
    },
    {
      key: 'stats_item_3_number',
      label: 'Nutrient Stat 3 — Value / Metric',
      type: 'text',
      defaultValue: '+600%',
      description: 'Third stat metric or percentage, e.g. +600%',
    },
    {
      key: 'stats_item_3_text',
      label: 'Nutrient Stat 3 — Description',
      type: 'text',
      defaultValue: 'Antioxidant capacity (ORAC value) protecting cells against oxidative stress',
      description: 'Description text next to Stat 3.',
    },
    {
      key: 'reasons_title',
      label: 'Six Reasons Section Title',
      type: 'text',
      defaultValue: 'Six reasons why we grow this way.',
    },
    {
      key: 'reasons_subtitle',
      label: 'Six Reasons Section Subtitle',
      type: 'text',
      defaultValue: 'Clean agriculture engineered for urban nutrition.',
    },
    {
      key: 'reviews_title',
      label: 'Customer Reviews Section Title',
      type: 'text',
      defaultValue: 'Straight from the gut.',
    },
    {
      key: 'reviews_subtitle',
      label: 'Customer Reviews Section Subtitle',
      type: 'text',
      defaultValue: 'Verified reviews from our Tricity community',
    },
  ],

  'our-story': [
    {
      key: 'hero_eyebrow',
      label: 'Hero Eyebrow / Pill',
      type: 'text',
      defaultValue: 'Our Mission',
    },
    {
      key: 'hero_title',
      label: 'Hero Headline',
      type: 'text',
      defaultValue: 'Helping India rediscover the power of living food',
    },
    {
      key: 'hero_cta_text',
      label: 'Hero CTA Button',
      type: 'text',
      defaultValue: 'Know More →',
    },
    {
      key: 'movement_title',
      label: 'Movement Section Title',
      type: 'text',
      defaultValue: "We're leading a movement to reimagine healthier living",
    },
    {
      key: 'movement_body',
      label: 'Movement Section Body',
      type: 'textarea',
      defaultValue:
        "Every tray we grow represents a simple belief: healthy food shouldn't be complicated. It shouldn't be expensive. And it certainly shouldn't feel like a luxury. Our goal is to help families make one small decision every day that leads to a healthier tomorrow.",
    },
    {
      key: 'story_eyebrow',
      label: 'Story Section Eyebrow',
      type: 'text',
      defaultValue: 'Our Story',
    },
    {
      key: 'story_title',
      label: 'Story Section Headline',
      type: 'text',
      defaultValue:
        "We have a different relationship with food and we're out to change yours",
    },
    {
      key: 'story_image_1',
      label: 'Our Story Photo 1 (Left)',
      type: 'image_url',
      defaultValue: '',
      description: 'First image in the diagonal slice collage of the Our Story section.',
    },
    {
      key: 'story_image_2',
      label: 'Our Story Photo 2 (Middle)',
      type: 'image_url',
      defaultValue: '',
      description: 'Second image in the diagonal slice collage of the Our Story section.',
    },
    {
      key: 'story_image_3',
      label: 'Our Story Photo 3 (Right)',
      type: 'image_url',
      defaultValue: '',
      description: 'Third image in the diagonal slice collage of the Our Story section.',
    },
    {
      key: 'journey_title',
      label: 'Journey Section Title',
      type: 'text',
      defaultValue:
        'Our journey began with a simple question: why has eating healthy become so difficult?',
    },
    {
      key: 'journey_body',
      label: 'Journey Section Body',
      type: 'textarea',
      defaultValue:
        "And then we discovered the extraordinary nutritional power of microgreens, and we realized something surprising. Nature had already created one of the most nutrient-rich foods. Most people had simply never experienced it. That realization became our purpose. Sometimes the smallest ingredients can create the biggest impact. Adding one handful of fresh greens to today's meal is enough to begin.",
    },
    {
      key: 'belief_eyebrow',
      label: 'Belief Section Eyebrow',
      type: 'text',
      defaultValue: 'Our Belief',
    },
    {
      key: 'belief_title',
      label: 'Belief Section Headline',
      type: 'text',
      defaultValue: 'We believe food should look alive, taste alive, and nourish life.',
    },
    {
      key: 'belief_image',
      label: 'Belief Section Image',
      type: 'image_url',
      defaultValue: '',
      description: 'Right photo for the Our Belief section.',
    },
    {
      key: 'principles_title',
      label: 'Principles Section Title',
      type: 'text',
      defaultValue: 'Every tray we harvest is a reminder of why we began.',
    },
    {
      key: 'sampler_banner_title',
      label: 'Sampler Pack Banner Title',
      type: 'text',
      defaultValue: 'New to microgreens?',
    },
    {
      key: 'sampler_banner_subtitle',
      label: 'Sampler Pack Banner Subtitle',
      type: 'textarea',
      defaultValue:
        'Start small. One sampler tray, different ways to use it, zero commitment.',
    },
    {
      key: 'sampler_banner_cta_text',
      label: 'Sampler Pack CTA Button',
      type: 'text',
      defaultValue: 'Try the sampler pack →',
    },
    {
      key: 'newsletter_title',
      label: 'Newsletter Section Title',
      type: 'text',
      defaultValue: 'Want 15% off and the inside scoop?',
    },
    {
      key: 'newsletter_subtitle',
      label: 'Newsletter Section Subtitle',
      type: 'textarea',
      defaultValue:
        'Get 15% off your first order, plus early access to new varieties, growing tips and tricity-only drops.',
    },
  ],
  'emails': [
    {
      key: 'newsletter_thankyou_subject',
      label: 'Newsletter Thank-You Email Subject',
      type: 'text',
      defaultValue: 'Welcome to Wild About Greens! [placeholder: replace with real copy]',
      description: 'Subject line for the welcome email sent after newsletter signup.',
    },
    {
      key: 'newsletter_thankyou_body',
      label: 'Newsletter Thank-You Email Body',
      type: 'textarea',
      defaultValue: 'Hi there!\n\nWelcome to Wild About Greens, we\'re so glad you\'re here. 🌱\n\n[placeholder: replace with real copy]\n\nStay fresh,\nThe Wild About Greens Team',
      description: 'Body content for the welcome email. Use plain text with line breaks.',
    },
  ],
  'recipes': [
    {
      key: 'hero_image_url',
      label: 'Hero Banner Image (Full-Width Panoramic)',
      type: 'image_url',
      defaultValue: '',
      description: 'Upload a wide edge-to-edge panoramic food banner photo (~1920x600px recommended) for the Recipes page. Displayed full-bleed with no overlay text.',
    },
    {
      key: 'hero_title',
      label: 'Page Heading',
      type: 'text',
      defaultValue: 'All Recipes',
      description: 'Page title displayed centered in crisp uppercase tracked editorial styling below the banner.',
    },
    {
      key: 'hero_subtitle',
      label: 'Page Subtitle (Optional)',
      type: 'textarea',
      defaultValue: 'Explore delicious and nutritious recipes crafted with fresh, living microgreens.',
      description: 'Optional short introductory subtitle displayed centered below the heading.',
    },
  ],
  'recipe': [
    {
      key: 'hero_image_url',
      label: 'Hero Banner Image (Full-Width Panoramic)',
      type: 'image_url',
      defaultValue: '',
      description: 'Upload a wide edge-to-edge panoramic food banner photo (~1920x600px recommended) for the Recipe page. Displayed full-bleed with no overlay text.',
    },
    {
      key: 'hero_title',
      label: 'Page Heading',
      type: 'text',
      defaultValue: 'All Recipes',
      description: 'Page title displayed centered in crisp uppercase tracked editorial styling below the banner.',
    },
    {
      key: 'hero_subtitle',
      label: 'Page Subtitle (Optional)',
      type: 'textarea',
      defaultValue: 'Explore delicious and nutritious recipes crafted with fresh, living microgreens.',
      description: 'Optional short introductory subtitle displayed centered below the heading.',
    },
  ],
  'recipe-khazana': [
    {
      key: 'hero_image_url',
      label: 'Hero Banner Image (Full-Width Panoramic)',
      type: 'image_url',
      defaultValue: '',
      description: 'Upload a wide edge-to-edge panoramic food banner photo (~1920x600px recommended) for the Recipe Khazana page. Displayed full-bleed with no overlay text.',
    },
    {
      key: 'hero_title',
      label: 'Page Heading',
      type: 'text',
      defaultValue: 'All Recipes',
      description: 'Page title displayed centered in crisp uppercase tracked editorial styling below the banner.',
    },
    {
      key: 'hero_subtitle',
      label: 'Page Subtitle (Optional)',
      type: 'textarea',
      defaultValue: 'Explore delicious and nutritious recipes crafted with fresh, living microgreens.',
      description: 'Optional short introductory subtitle displayed centered below the heading.',
    },
  ],
  'pathshala': [
    {
      key: 'hero_image_url',
      label: 'Hero Banner Image (Full-Width Panoramic)',
      type: 'image_url',
      defaultValue: '',
      description: 'Upload a wide edge-to-edge panoramic banner photo (~1920x600px recommended) for the Pathshala page. Displayed full-bleed with no overlay text.',
    },
    {
      key: 'hero_title',
      label: 'Page Heading',
      type: 'text',
      defaultValue: 'Pathshala',
      description: 'Page title displayed centered in crisp uppercase tracked editorial styling below the banner.',
    },
    {
      key: 'hero_subtitle',
      label: 'Page Subtitle (Optional)',
      type: 'textarea',
      defaultValue: 'Nutritional deep dives, cellular antioxidant science, and insights from our vertical indoor farm.',
      description: 'Optional short introductory subtitle displayed centered below the heading.',
    },
  ],
  'blog': [
    {
      key: 'hero_image_url',
      label: 'Hero Banner Image (Full-Width Panoramic)',
      type: 'image_url',
      defaultValue: '',
      description: 'Upload a wide edge-to-edge panoramic banner photo (~1920x600px recommended) for the Pathshala page. Displayed full-bleed with no overlay text.',
    },
    {
      key: 'hero_title',
      label: 'Page Heading',
      type: 'text',
      defaultValue: 'Pathshala',
      description: 'Page title displayed centered in crisp uppercase tracked editorial styling below the banner.',
    },
    {
      key: 'hero_subtitle',
      label: 'Page Subtitle (Optional)',
      type: 'textarea',
      defaultValue: 'Nutritional deep dives, cellular antioxidant science, and insights from our vertical indoor farm.',
      description: 'Optional short introductory subtitle displayed centered below the heading.',
    },
  ],
  'cart-drawer': [
    {
      key: 'cart_empty_title',
      label: 'Empty Cart Headline',
      type: 'text',
      defaultValue: 'This cart is empty inside!',
      description: 'Main heading displayed when the customer opens an empty cart drawer.',
    },
    {
      key: 'cart_empty_subtitle',
      label: 'Empty Cart Punchline / Humor Text',
      type: 'textarea',
      defaultValue: 'Fill it with living greens, before this poor cart decides to compost itself out of pure loneliness.',
      description: 'Quirky cursive humor line displayed below the empty cart cartoon mascot.',
    },
    {
      key: 'cart_mascot_variant',
      label: 'Cartoon Mascot Variation',
      type: 'mascot_select',
      defaultValue: 'pleading',
      description: 'Choose the cartoon character personality displayed in the empty cart drawer.',
    },
    {
      key: 'cart_rec_eyebrow',
      label: 'Recommendations Eyebrow',
      type: 'text',
      defaultValue: 'START WITH',
      description: 'Small uppercase tracking eyebrow above the recommendations title.',
    },
    {
      key: 'cart_rec_title',
      label: 'Recommendations Section Title',
      type: 'text',
      defaultValue: 'Our Bestsellers',
      description: 'Heading for the recommended products carousel inside the cart drawer.',
    },
    {
      key: 'cart_rec_product_1',
      label: 'Recommended Product #1',
      type: 'product_select',
      defaultValue: 'broccoli-microgreens',
      description: 'Select the 1st product to feature in the cart recommendations carousel.',
    },
    {
      key: 'cart_rec_badge_1',
      label: 'Product #1 Custom Badge (Optional Override)',
      type: 'text',
      defaultValue: '',
      description: 'Optional custom badge. If left blank, automatically syncs the badge label from the Products page.',
    },
    {
      key: 'cart_rec_product_2',
      label: 'Recommended Product #2',
      type: 'product_select',
      defaultValue: 'sunflower-microgreens',
      description: 'Select the 2nd product to feature in the cart recommendations carousel.',
    },
    {
      key: 'cart_rec_badge_2',
      label: 'Product #2 Custom Badge (Optional Override)',
      type: 'text',
      defaultValue: '',
      description: 'Optional custom badge. If left blank, automatically syncs the badge label from the Products page.',
    },
    {
      key: 'cart_rec_product_3',
      label: 'Recommended Product #3',
      type: 'product_select',
      defaultValue: 'radish-microgreens',
      description: 'Select the 3rd product to feature in the cart recommendations carousel.',
    },
    {
      key: 'cart_rec_badge_3',
      label: 'Product #3 Custom Badge (Optional Override)',
      type: 'text',
      defaultValue: '',
      description: 'Optional custom badge. If left blank, automatically syncs the badge label from the Products page.',
    },
    {
      key: 'cart_rec_product_4',
      label: 'Recommended Product #4',
      type: 'product_select',
      defaultValue: 'classic-trio-bundle',
      description: 'Select the 4th product to feature in the cart recommendations carousel.',
    },
    {
      key: 'cart_rec_badge_4',
      label: 'Product #4 Custom Badge (Optional Override)',
      type: 'text',
      defaultValue: '',
      description: 'Optional custom badge. If left blank, automatically syncs the badge label from the Products page.',
    },
  ],
  'track-order': [
    {
      key: 'track_eyebrow',
      label: 'Page Pill / Eyebrow',
      type: 'text',
      defaultValue: 'Real-Time Harvest & Delivery Tracking',
      description: 'The small pill badge above the headline on the track order page.',
    },
    {
      key: 'track_title',
      label: 'Page Headline',
      type: 'text',
      defaultValue: 'Track Your Order',
      description: 'Main editorial heading on the track order page.',
    },
    {
      key: 'track_subtitle',
      label: 'Page Subtitle',
      type: 'textarea',
      defaultValue:
        'Enter your order number along with your phone number and email address to view the live harvest and delivery status across Chandigarh, Mohali & Panchkula.',
      description: 'The descriptive sentence under the headline.',
    },
    {
      key: 'track_support_phone',
      label: 'Support Phone / WhatsApp Number',
      type: 'text',
      defaultValue: '+91 98XXXXXXXX',
      description: 'Phone or WhatsApp number displayed in the help and delivery inquiries section.',
    },
    {
      key: 'track_support_email',
      label: 'Support Email Address',
      type: 'text',
      defaultValue: 'hello@wildaboutgreens.com',
      description: 'Contact email displayed in the customer help section.',
    },
    {
      key: 'track_harvest_note',
      label: 'Harvest Promise Note',
      type: 'text',
      defaultValue: 'Grown with mineral water & clean air · Harvested morning of delivery in Tricity',
      description: 'Short trust badge displayed on the tracking result card.',
    },
  ],
};

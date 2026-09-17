export interface ContentFieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image_url';
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
      key: 'comparison_title',
      label: 'Comparison Section Title',
      type: 'text',
      defaultValue: 'Living Trays vs Cut Supermarket Packs',
    },
    {
      key: 'comparison_subtitle',
      label: 'Comparison Section Subtitle',
      type: 'textarea',
      defaultValue:
        'Real nutrient density measured at harvest hour, not after a week in cold transport.',
    },
    {
      key: 'why_choose_title',
      label: 'Why Choose Us Title',
      type: 'text',
      defaultValue: 'The Lesser Known Fact',
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
      defaultValue: 'Welcome to Wild About Greens! [placeholder — replace with real copy]',
      description: 'Subject line for the welcome email sent after newsletter signup.',
    },
    {
      key: 'newsletter_thankyou_body',
      label: 'Newsletter Thank-You Email Body',
      type: 'textarea',
      defaultValue: 'Hi there!\n\nWelcome to Wild About Greens — we\'re so glad you\'re here. 🌱\n\n[placeholder — replace with real copy]\n\nStay fresh,\nThe Wild About Greens Team',
      description: 'Body content for the welcome email. Use plain text with line breaks.',
    },
  ],
};

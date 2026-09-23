-- 032: Create health_goals_content table and seed initial content for the 8 goals
CREATE TABLE IF NOT EXISTS health_goals_content (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tag text NOT NULL,
  icon text DEFAULT '🌱',
  subtitle text NOT NULL,
  popup_title text NOT NULL,
  popup_description text NOT NULL,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed the 8 health goals
INSERT INTO health_goals_content (id, slug, title, tag, icon, subtitle, popup_title, popup_description, image_url, display_order, is_active)
VALUES
  (
    'boost-immunity',
    'boost-immunity',
    'Boost Immunity',
    'IMMUNITY',
    '🛡️',
    'Broccoli & radish blends',
    'Strengthen natural defenses with living sulforaphane & vitamin C.',
    'Living broccoli and peppery radish shoots packed with bioavailable antioxidants, glucosinolates, and immune-support enzymes harvested fresh on delivery morning.',
    'https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=700&auto=format&fit=crop',
    1,
    true
  ),
  (
    'weight-management',
    'weight-management',
    'Weight Management',
    'WEIGHT',
    '⚖️',
    'Low cal, high fibre trays',
    'High satiety, dense micronutrients, near-zero calorie burden.',
    'Fiber-rich, enzymatically active living greens that support gentle digestion, natural fullness, and sustained metabolic balance without empty fillers.',
    'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=700&auto=format&fit=crop',
    2,
    true
  ),
  (
    'kids-nutrition',
    'kids-nutrition',
    'Kids Nutrition',
    'KIDS',
    '👶',
    'Mild, sweet pea shoots & microgreens',
    'Deliciously mild green crunch that kids actually love.',
    'Tender, sweet, zero-bitterness shoots packed with natural folate, calcium, and vitamin A. Snip straight onto pizzas, pastas, sandwiches, and daily meals.',
    'https://plus.unsplash.com/premium_photo-1666184891926-68f52da26f15?fm=jpg&q=80&w=700&auto=format&fit=crop',
    3,
    true
  ),
  (
    'fitness-recovery',
    'fitness-recovery',
    'Fitness & Recovery',
    'FITNESS',
    '💪',
    'Protein forward sunflower & green power',
    'Complete plant amino acids and electrolytes for rapid recovery.',
    'Crunchy sunflower shoots and mineral-rich greens offering complete plant proteins, zinc, and natural magnesium to fuel active workouts and accelerate recovery.',
    'https://images.unsplash.com/photo-1610622930110-3c076902312a?fm=jpg&q=80&w=700&auto=format&fit=crop',
    4,
    true
  ),
  (
    'diabetes-friendly',
    'diabetes-friendly',
    'Diabetes Friendly',
    'LOW GI',
    '📊',
    'Low glycemic greens',
    'Naturally support stable glucose with zero-spike living greens.',
    'Clinical studies show living brassica microgreens support insulin sensitivity and cellular vitality. Ultra low glycemic index, grown pure with mineral RO water.',
    'https://plus.unsplash.com/premium_photo-1699976106481-02baab9811da?fm=jpg&q=80&w=700&auto=format&fit=crop',
    5,
    true
  ),
  (
    'heart-health',
    'heart-health',
    'Heart Health',
    'HEART',
    '❤️',
    'Potassium rich mixes',
    'Potassium and bio-active nitrates for healthy circulation.',
    'Naturally support vascular elasticity, balanced blood pressure, and cardiovascular health with living shoots rich in chlorophyll, potassium, and polyphenols.',
    'https://images.unsplash.com/photo-1647613233075-e0d5546b0f22?fm=jpg&q=80&w=700&auto=format&fit=crop',
    6,
    true
  ),
  (
    'healthy-aging',
    'healthy-aging',
    'Healthy Aging',
    'AGING',
    '✨',
    'Antioxidant dense trays',
    'Combat oxidative stress and support youthful cellular vitality.',
    'Up to 40x the antioxidant density of mature vegetables. Living sulforaphane, lutein, and glutathione precursors that nourish longevity and cellular repair from within.',
    'https://plus.unsplash.com/premium_photo-1675368982408-ee5a9e0fab6c?fm=jpg&q=80&w=700&auto=format&fit=crop',
    7,
    true
  ),
  (
    'all-trays',
    'all-trays',
    'All Trays',
    'ALL',
    '🌱',
    'Every variety we grow',
    'Every living variety harvested on the morning of delivery.',
    'Browse our complete living microgreen lineup. Grown with 100% mineral RO water and zero pesticides on vertical climate racks in the Tricity.',
    'https://plus.unsplash.com/premium_photo-1661635029307-2183e966e5a8?fm=jpg&q=80&w=700&auto=format&fit=crop',
    8,
    true
  )
ON CONFLICT (id) DO NOTHING;

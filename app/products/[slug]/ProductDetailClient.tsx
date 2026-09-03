'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { formatPrice } from '@/lib/format';
import { Product, Variant, RelatedProduct } from './page';

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?fm=jpg&q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1647613233075-e0d5546b0f22?fm=jpg&q=80&w=1200&auto=format&fit=crop',
  'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=1200&auto=format&fit=crop',
];

const REVIEWS = [
  {
    name: 'Dr. Neha Verma',
    loc: 'Sector 8, Chandigarh',
    text: 'I recommend these to all my clinical nutrition patients. The sulforaphane density in living broccoli microgreens is incomparable to anything in a polythene bag at the store.',
    rating: 5,
  },
  {
    name: 'Vikramjit Singh',
    loc: 'Phase 7, Mohali',
    text: 'They arrive completely alive in their tray! We snip a handful every morning over our eggs and dal. It stays crunchy in the kitchen for over a week.',
    rating: 5,
  },
  {
    name: 'Ananya Sharma',
    loc: 'Sector 14, Panchkula',
    text: 'My kids actually ask for “the baby trees” with their sandwiches. Knowing it is grown with RO mineral water and zero chemicals gives me total peace of mind.',
    rating: 5,
  },
  {
    name: 'Chef Kabir Grover',
    loc: 'Sector 26, Chandigarh',
    text: 'The texture, color intensity, and peppery punch are on par with international vertical farms. Absolute game changer for the Tricity.',
    rating: 5,
  },
];

const REASONS = [
  {
    icon: '🌿',
    title: 'Living on Delivery',
    desc: 'Never wilted in cold storage. Cut right into your bowl at the exact moment of eating.',
  },
  {
    icon: '🚫',
    title: 'Zero Pesticides',
    desc: 'Grown indoor in HEPA-filtered air. No chemical sprays, pesticides, or weedkillers ever.',
  },
  {
    icon: '⚡',
    title: '10-Day Peak Density',
    desc: 'Harvested at the exact biological apex when vitamins and antioxidants reach up to 40x mature greens.',
  },
  {
    icon: '📍',
    title: 'Tricity Local Radius',
    desc: 'Cultivated right here in our city, 10 minutes from your kitchen. Zero long-distance freight.',
  },
  {
    icon: '💧',
    title: 'Mineral RO Water',
    desc: 'Irrigated exclusively with pure potable drinking water, free of industrial runoff or heavy metals.',
  },
  {
    icon: '🥥',
    title: 'Sterile Coco-Peat',
    desc: 'Grown on clean, soil-free coco-peat medium ensuring grit-free, pristine stems and roots.',
  },
];

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: RelatedProduct[];
}) {
  const activeVariants = product.variants.filter((v) => v.is_active);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    activeVariants[0] || {
      id: 'default',
      product_id: product.id,
      label: '100g tray',
      net_weight_grams: 100,
      price_paise: 9900,
      stock_qty: 25,
      is_active: true,
    }
  );

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [plan, setPlan] = useState<'single' | 'subscription'>('single');
  const [frequency, setFrequency] = useState('weekly');
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState<number | null>(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const buyBoxRef = useRef<HTMLDivElement>(null);
  const reasonsTrackRef = useRef<HTMLDivElement>(null);
  const ogTrackRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const setIsOpen = useCartStore((s) => s.setIsOpen);

  // Price calculations
  const rawPrice = selectedVariant.price_paise;
  const effectivePrice =
    plan === 'subscription' ? Math.round(rawPrice * 0.85) : rawPrice;

  // Sticky bar intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (buyBoxRef.current) {
      observer.observe(buyBoxRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock_qty === 0) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        variantId: selectedVariant.id,
        productSlug: product.slug,
        productName: product.name,
        variantLabel: `${selectedVariant.label}${
          plan === 'subscription' ? ` (${frequency} sub)` : ''
        }`,
        pricePaise: effectivePrice,
        maxStock: selectedVariant.stock_qty,
      });
    }
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  const handleQuickAdd = (rel: RelatedProduct) => {
    addItem({
      variantId: rel.variant_id || rel.id,
      productSlug: rel.slug,
      productName: rel.name,
      variantLabel: 'Standard Tray',
      pricePaise: rel.price_paise,
      maxStock: 20,
    });
    setIsOpen(true);
  };

  const scrollReasons = (dir: 'left' | 'right') => {
    if (!reasonsTrackRef.current) return;
    const offset = dir === 'left' ? -320 : 320;
    reasonsTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const scrollOtherGreens = (dir: 'left' | 'right') => {
    if (!ogTrackRef.current) return;
    const offset = dir === 'left' ? -260 : 260;
    ogTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F3EEE0] text-[#151F19] min-h-screen">
      {/* ================= PDP HERO ================= */}
      <section className="pt-28 pb-16">
        <div className="wrap">
          {/* Breadcrumb */}
          <nav className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#5C6B60] mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#1C3F2D] transition-colors">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/products" className="hover:text-[#1C3F2D] transition-colors">
              Shop
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-[#122A1F] font-semibold">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* ================= GALLERY (sticky LHS) ================= */}
            <div className="lg:sticky lg:top-24">
              <div className="relative rounded-2xl overflow-hidden aspect-[1/1.08] bg-gradient-to-br from-[#EDE7D6] to-[#E1DAC3] p-4 sm:p-7 flex items-center justify-center border border-[#E4DDC8] shadow-sm">
                {/* Badge */}
                <span className="absolute top-4 left-4 z-10 font-mono text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-[#9C4A5C] text-[#FFFDF8] shadow-sm flex items-center gap-1.5">
                  <span>🌱</span> 100% Pesticide-Free
                </span>

                {/* Image counter */}
                <span className="absolute bottom-4 right-4 z-10 font-mono text-[10px] tracking-wide text-[#122A1F] bg-[#FFFDF8]/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-black/5 shadow-sm">
                  {activeImgIdx + 1} / {PRODUCT_IMAGES.length}
                </span>

                {/* Left / Right Nav Arrows */}
                <button
                  onClick={() =>
                    setActiveImgIdx((prev) =>
                      prev === 0 ? PRODUCT_IMAGES.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#122A1F] shadow-md hover:scale-105 transition-all"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActiveImgIdx((prev) =>
                      prev === PRODUCT_IMAGES.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#122A1F] shadow-md hover:scale-105 transition-all"
                  aria-label="Next image"
                >
                  ›
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={activeImgIdx}
                  src={PRODUCT_IMAGES[activeImgIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5 mt-3.5 overflow-x-auto pb-1">
                {PRODUCT_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIdx(i)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImgIdx === i
                        ? 'border-[#1C3F2D] ring-2 ring-[#CFFA57]'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ================= DETAIL & BUY BOX (RHS) ================= */}
            <div className="max-w-lg">
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#3E8F52] font-semibold mb-2.5 flex items-center gap-2">
                <span>🌱</span>
                <span>GROWN LOCALLY · DAY 10 HARVEST</span>
              </div>

              <h1 className="font-serif font-medium text-4xl sm:text-5xl text-[#151F19] leading-[1.05] tracking-tight mb-2">
                {product.name}
              </h1>

              <div className="font-mono text-xs tracking-wider uppercase text-[#5C6B60] mb-4">
                LIVING MICROGREENS · {selectedVariant.label || '100G LIVE TRAY'}
              </div>

              {/* Rating */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="text-[#1C3F2D] tracking-widest text-sm">★★★★★</span>
                <span className="font-mono text-[11px] tracking-wide text-[#5C6B60]">
                  4.9 (128 reviews)
                </span>
              </div>

              {/* Description in Newsreader Editorial Font */}
              <div className="font-editorial text-[17.5px] leading-[1.62] text-[#33402F] mb-7 space-y-3">
                <p>
                  <span className="font-medium italic text-[#122A1F]">
                    The heavyweight champion of plant nutrition.
                  </span>{' '}
                  {product.description ||
                    'Harvested at the biological apex on day 10, delivering peak cellular antioxidants straight to your door.'}
                </p>
                <p>
                  Carries up to{' '}
                  <u className="decoration-[#B7E23F] decoration-[3px] underline-offset-2 font-medium text-[#122A1F]">
                    40 times the concentrated sulforaphane
                  </u>{' '}
                  of a mature head of broccoli. Crisp, peppery, and alive until the moment you cut it.
                </p>
              </div>

              {/* Benefit Chips */}
              <div className="flex flex-wrap gap-2.5 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4DDC8] text-xs font-semibold text-[#122A1F] shadow-sm">
                  ⚡ 40x Sulforaphane
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4DDC8] text-xs font-semibold text-[#122A1F] shadow-sm">
                  🛡️ Zero Pesticides
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4DDC8] text-xs font-semibold text-[#122A1F] shadow-sm">
                  💧 Mineral RO Grown
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#E4DDC8] text-xs font-semibold text-[#122A1F] shadow-sm">
                  ✂️ Cut to Order
                </span>
              </div>

              {/* BUY BOX */}
              <div
                ref={buyBoxRef}
                className="bg-[#FFFDF8] border border-[#E4DDC8] rounded-[22px] p-6 sm:p-7 shadow-sm mb-9"
              >
                {/* Price Row */}
                <div className="flex items-baseline gap-2.5 mb-5">
                  <span className="font-display text-4xl text-[#122A1F] leading-none">
                    {formatPrice(effectivePrice)}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#5C6B60]">
                    / tray
                  </span>
                  {plan === 'subscription' && (
                    <span className="font-mono text-sm line-through text-[#5C6B60]/70 ml-1">
                      {formatPrice(rawPrice)}
                    </span>
                  )}
                </div>

                {/* Plan Selector */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <button
                    onClick={() => setPlan('single')}
                    className={`relative text-left p-3.5 rounded-xl border transition-all ${
                      plan === 'single'
                        ? 'border-[#1C3F2D] bg-[#F7FAF0] ring-1 ring-[#1C3F2D]'
                        : 'border-[#E4DDC8] hover:border-[#3E8F52]'
                    }`}
                  >
                    <span className="block text-[13.5px] font-bold text-[#122A1F] mb-0.5">
                      Single Tray
                    </span>
                    <span className="block font-mono text-[10px] tracking-wide uppercase text-[#5C6B60]">
                      Standard Order
                    </span>
                  </button>

                  <button
                    onClick={() => setPlan('subscription')}
                    className={`relative text-left p-3.5 rounded-xl border transition-all ${
                      plan === 'subscription'
                        ? 'border-[#1C3F2D] bg-[#F7FAF0] ring-1 ring-[#1C3F2D]'
                        : 'border-[#E4DDC8] hover:border-[#3E8F52]'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-2 bg-[#CFFA57] text-[#122A1F] font-mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
                      Save 15%
                    </span>
                    <span className="block text-[13.5px] font-bold text-[#122A1F] mb-0.5">
                      Subscribe
                    </span>
                    <span className="block font-mono text-[10px] tracking-wide uppercase text-[#5C6B60]">
                      Fresh Routine
                    </span>
                  </button>
                </div>

                {/* Subscription Frequency Picker */}
                {plan === 'subscription' && (
                  <div className="mb-4 bg-[#F3EEE0]/60 p-3 rounded-xl border border-[#E4DDC8]">
                    <label className="block font-mono text-[10px] tracking-wider uppercase text-[#5C6B60] mb-1 font-semibold">
                      Delivery Schedule
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-white border border-[#E4DDC8] rounded-lg px-3 py-2 text-xs font-medium text-[#122A1F] outline-none"
                    >
                      <option value="weekly">Every Week (Recommended for living trays)</option>
                      <option value="biweekly">Every 2 Weeks</option>
                    </select>
                  </div>
                )}

                {/* Variant Selector (if more than 1) */}
                {activeVariants.length > 1 && (
                  <div className="mb-4">
                    <label className="block font-mono text-[10px] tracking-wider uppercase text-[#5C6B60] mb-1.5 font-semibold">
                      Tray Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeVariants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selectedVariant.id === v.id
                              ? 'border-[#1C3F2D] bg-[#1C3F2D] text-white'
                              : 'border-[#E4DDC8] text-[#122A1F] hover:border-gray-400'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="flex gap-3 items-stretch mt-4">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E4DDC8] rounded-xl overflow-hidden bg-[#F3EEE0]/40 flex-shrink-0">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-full flex items-center justify-center text-base font-bold text-[#122A1F] hover:bg-[#E4DDC8]/60 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-[#122A1F]">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-full flex items-center justify-center text-base font-bold text-[#122A1F] hover:bg-[#E4DDC8]/60 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#122A1F] hover:bg-[#1C3F2D] text-[#FFFDF8] font-bold text-sm tracking-wide py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {addedFeedback ? (
                      <span className="text-[#CFFA57] font-semibold">✓ Added to Cart!</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        <span>Add to Cart · {formatPrice(effectivePrice * qty)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Note */}
                <div className="flex items-center gap-2 mt-4 text-xs text-[#5C6B60]">
                  <span>🌱</span>
                  <span>Harvested on the morning of delivery in Chandigarh, Mohali &amp; Panchkula</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-[#E4DDC8] pt-2">
                {/* Accordion 1 */}
                <div className="border-b border-[#E4DDC8]">
                  <button
                    onClick={() => setOpenAcc(openAcc === 0 ? null : 0)}
                    className="w-full flex items-center justify-between py-4 text-left font-serif text-[17px] font-semibold text-[#151F19]"
                  >
                    <span>How to Eat &amp; Store</span>
                    <span className="font-mono text-xl text-[#1C3F2D]">
                      {openAcc === 0 ? '−' : '+'}
                    </span>
                  </button>
                  {openAcc === 0 && (
                    <div className="pb-4 text-sm text-[#3B4A40] leading-relaxed space-y-2">
                      <p>
                        Keep your tray on the kitchen counter away from direct scorching sun. Add 50ml of
                        water to the bottom drip tray once a day.
                      </p>
                      <p>
                        When ready to eat, simply snip what you need with kitchen scissors right above the root
                        line. Your tray stays living and fresh for 7 to 10 days!
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 2 */}
                <div className="border-b border-[#E4DDC8]">
                  <button
                    onClick={() => setOpenAcc(openAcc === 1 ? null : 1)}
                    className="w-full flex items-center justify-between py-4 text-left font-serif text-[17px] font-semibold text-[#151F19]"
                  >
                    <span>Nutrient Profile &amp; Science</span>
                    <span className="font-mono text-xl text-[#1C3F2D]">
                      {openAcc === 1 ? '−' : '+'}
                    </span>
                  </button>
                  {openAcc === 1 && (
                    <div className="pb-4 text-sm text-[#3B4A40] leading-relaxed space-y-2">
                      <p>
                        USDA and university studies have confirmed that day-10 microgreens contain between
                        10x and 40x the vital micronutrients of their full-grown counterparts.
                      </p>
                      <p>
                        Broccoli microgreens are world-famous for glucoraphanin, which converts into active
                        sulforaphane—a potent natural cellular detoxifier.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 3 */}
                <div className="border-b border-[#E4DDC8]">
                  <button
                    onClick={() => setOpenAcc(openAcc === 2 ? null : 2)}
                    className="w-full flex items-center justify-between py-4 text-left font-serif text-[17px] font-semibold text-[#151F19]"
                  >
                    <span>Growing Method &amp; Purity</span>
                    <span className="font-mono text-xl text-[#1C3F2D]">
                      {openAcc === 2 ? '−' : '+'}
                    </span>
                  </button>
                  {openAcc === 2 && (
                    <div className="pb-4 text-sm text-[#3B4A40] leading-relaxed space-y-2">
                      <p>
                        We operate vertical indoor climate racks in the Tricity. No soil, no organic compost
                        pathogens, and absolutely zero pesticide or fertilizer residues.
                      </p>
                      <p>
                        Grown on sterilized coco-peat with 100% reverse-osmosis mineral drinking water.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 4 */}
                <div className="border-b border-[#E4DDC8]">
                  <button
                    onClick={() => setOpenAcc(openAcc === 3 ? null : 3)}
                    className="w-full flex items-center justify-between py-4 text-left font-serif text-[17px] font-semibold text-[#151F19]"
                  >
                    <span>Delivery &amp; Packaging</span>
                    <span className="font-mono text-xl text-[#1C3F2D]">
                      {openAcc === 3 ? '−' : '+'}
                    </span>
                  </button>
                  {openAcc === 3 && (
                    <div className="pb-4 text-sm text-[#3B4A40] leading-relaxed space-y-2">
                      <p>
                        Delivered in our reusable food-grade living trays. We dispatch orders within hours
                        of the final quality check across Chandigarh, Mohali, and Panchkula.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pairs Well With / Upsell */}
              {relatedProducts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#E4DDC8]">
                  <span className="font-mono text-[11px] tracking-wider uppercase text-[#5C6B60] block mb-3 font-semibold">
                    🌱 Pairs Well With
                  </span>
                  <div className="space-y-2.5">
                    {relatedProducts.slice(0, 2).map((rel) => (
                      <div
                        key={rel.id}
                        className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E4DDC8] hover:border-[#3E8F52] transition-all"
                      >
                        <div className="min-w-0">
                          <h5 className="font-serif text-sm font-semibold text-[#122A1F] truncate">
                            {rel.name}
                          </h5>
                          <span className="font-mono text-xs text-[#1C3F2D] font-bold">
                            {formatPrice(rel.price_paise)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleQuickAdd(rel)}
                          className="w-8 h-8 rounded-full bg-[#F3EEE0] hover:bg-[#CFFA57] flex items-center justify-center text-sm font-bold transition-all text-[#122A1F]"
                          title="Quick add to cart"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2a: FULL-BLEED "TRY THE TRICITY TRIO" BANNER ================= */}
      <section className="w-full bg-[#00A234] text-[#FFFDF8] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
          {/* Media Side */}
          <div className="relative bg-[#1C3F2D] min-h-[280px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1613769049987-b31b641f25b1?fm=jpg&q=85&w=1200&auto=format&fit=crop"
              alt="Tricity Trio"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Copy Side */}
          <div className="flex flex-col justify-center items-center text-center p-10 sm:p-14 lg:p-16 space-y-4">
            <h2 className="font-display uppercase text-3xl sm:text-4xl lg:text-5xl tracking-wide leading-tight">
              Go For All Three
            </h2>
            <p className="text-sm sm:text-[15px] leading-relaxed text-white/90 max-w-md">
              Broccoli for sulforaphane, Radish for spice and zinc, Sunflower shoots for protein and
              crunch. Get our signature 3-tray variety pack delivered together.
            </p>
            <Link
              href="/products?category=bundle"
              className="inline-flex items-center justify-center bg-[#151F19] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all mt-2"
            >
              Shop Tricity Trio Bundle →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2b: FULL-BLEED NUTRIENT STATS BANNER ================= */}
      <section className="w-full bg-white border-y border-[#E4DDC8]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] min-h-[440px]">
          {/* Copy Side */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#151F19] leading-tight mb-3">
              Tiny leaves, <em className="italic text-[#FF9F5A] font-normal">massive impact.</em>
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B60] leading-relaxed mb-6 max-w-lg">
              Because microgreens are harvested just after the cotyledon leaves emerge, all the energy
              concentrated in the seed is available right in the young shoot.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-serif italic font-semibold text-3xl sm:text-4xl text-[#1C3F2D] w-28 flex-shrink-0">
                  +1500%
                </span>
                <span className="text-sm text-[#151F19]">
                  Sulforaphane concentration compared to full-grown broccoli
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-serif italic font-semibold text-3xl sm:text-4xl text-[#1C3F2D] w-28 flex-shrink-0">
                  +400%
                </span>
                <span className="text-sm text-[#151F19]">
                  Bioavailable Vitamin C and beta-carotene per gram of greens
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-serif italic font-semibold text-3xl sm:text-4xl text-[#1C3F2D] w-28 flex-shrink-0">
                  +600%
                </span>
                <span className="text-sm text-[#151F19]">
                  Antioxidant capacity (ORAC value) protecting cells against oxidative stress
                </span>
              </div>
            </div>
          </div>

          {/* Media Side */}
          <div className="relative bg-[#E4DDC8] min-h-[260px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=85&w=1200&auto=format&fit=crop"
              alt="Fresh Microgreens Harvest"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 2c: SIX REASONS CAROUSEL ================= */}
      <section className="bg-[#E4EFDC] py-14 border-b border-[#E4DDC8]">
        <div className="wrap">
          <div className="max-w-xl mx-auto text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#151F19] mb-2">
              Six reasons why we grow this way.
            </h2>
            <p className="text-sm text-[#1C3F2D]">Clean agriculture engineered for urban nutrition.</p>
          </div>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() => scrollReasons('left')}
              className="hidden sm:flex flex-shrink-0 w-9 h-9 rounded-full bg-white border border-[#1C3F2D]/20 items-center justify-center text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-white transition-all shadow-sm"
              aria-label="Scroll left"
            >
              ‹
            </button>

            <div
              ref={reasonsTrackRef}
              className="flex-1 flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-2"
            >
              {REASONS.map((r, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-[#1C3F2D]/10 space-y-2"
                >
                  <span className="text-3xl block">{r.icon}</span>
                  <h4 className="font-serif text-base font-semibold text-[#151F19]">{r.title}</h4>
                  <p className="text-xs text-[#3B4A40] leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollReasons('right')}
              className="hidden sm:flex flex-shrink-0 w-9 h-9 rounded-full bg-white border border-[#1C3F2D]/20 items-center justify-center text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-white transition-all shadow-sm"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: REVIEWS ("STRAIGHT FROM THE GUT") ================= */}
      <section className="bg-[#E4DDC8] py-16">
        <div className="wrap">
          <div className="mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#151F19]">
              Straight from the gut.
            </h2>
            <p className="font-mono text-xs uppercase tracking-wider text-[#5C6B60] mt-1">
              Verified reviews from our Tricity community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((rev, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-black/5"
              >
                <p className="text-xs leading-relaxed text-[#151F19] italic mb-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
                <div className="pt-3 border-t border-[#E4DDC8]">
                  <div className="font-bold text-xs text-[#151F19]">{rev.name}</div>
                  <div className="font-mono text-[10px] text-[#5C6B60]">{rev.loc}</div>
                  <div className="text-[#FF9F5A] text-xs tracking-wider mt-1">★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4a: COMPARISON BANNER ================= */}
      <section className="bg-[#122A1F] text-[#FFFDF8] py-16">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Title */}
            <div>
              <span className="font-mono text-[11px] tracking-widest uppercase text-[#CFFA57] block mb-2 font-semibold">
                ⚖️ The Real Difference
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-tight">
                Why living greens beat the <em className="italic text-[#CFFA57] font-normal">supermarket shelf.</em>
              </h2>
              <p className="text-sm text-white/70 mt-3 max-w-md leading-relaxed">
                Vegetables cut days in advance hemorrhage vitamins in freight trucks. We deliver living
                roots that keep nourishing you until the final bite.
              </p>
            </div>

            {/* Right Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-3 px-2 font-medium text-white/60">Metric</th>
                    <th className="py-3 px-3 font-serif font-bold text-sm bg-[#CFFA57] text-[#122A1F] rounded-t-xl text-center">
                      Wild About Greens
                    </th>
                    <th className="py-3 px-2 font-medium text-white/50 text-center">
                      Grocery Store Greens
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3.5 px-2 text-white/90 font-medium">Harvest Age</td>
                    <td className="py-3.5 px-3 text-center bg-[#CFFA57]/10 font-bold text-[#CFFA57]">
                      Day 10 Peak
                    </td>
                    <td className="py-3.5 px-2 text-center text-white/40">30–60 Days (Old)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 text-white/90 font-medium">Status at Delivery</td>
                    <td className="py-3.5 px-3 text-center bg-[#CFFA57]/10 font-bold text-[#CFFA57]">
                      100% Living Tray
                    </td>
                    <td className="py-3.5 px-2 text-center text-white/40">Dead / Cut Days Ago</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 text-white/90 font-medium">Water Purity</td>
                    <td className="py-3.5 px-3 text-center bg-[#CFFA57]/10 font-bold text-[#CFFA57]">
                      Mineral RO Water
                    </td>
                    <td className="py-3.5 px-2 text-center text-white/40">Industrial Runoff / Canal</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 text-white/90 font-medium">Chemical Sprays</td>
                    <td className="py-3.5 px-3 text-center bg-[#CFFA57]/10 font-bold text-[#CFFA57]">
                      0% Pesticides
                    </td>
                    <td className="py-3.5 px-2 text-center text-white/40">Heavy Residues</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 text-white/90 font-medium">Shelf Life in Kitchen</td>
                    <td className="py-3.5 px-3 text-center bg-[#CFFA57]/10 font-bold text-[#CFFA57]">
                      7–10 Days Living
                    </td>
                    <td className="py-3.5 px-2 text-center text-white/40">Wilts in 48 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4b: OTHER GREENS YOU'LL LOVE ================= */}
      {relatedProducts.length > 0 && (
        <section className="bg-white py-16 border-b border-[#E4DDC8]">
          <div className="wrap">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display uppercase text-2xl tracking-wide text-[#151F19]">
                Other Greens You&apos;ll Love
              </h2>
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => scrollOtherGreens('left')}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all text-sm font-bold"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollOtherGreens('right')}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all text-sm font-bold"
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={ogTrackRef}
              className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-3"
            >
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="flex-shrink-0 w-56 sm:w-60 bg-[#F3EEE0]/50 rounded-2xl p-4 border border-[#E4DDC8] flex flex-col justify-between"
                >
                  <div className="aspect-square bg-gradient-to-br from-[#EDE7D6] to-[#DED7BF] rounded-xl mb-3 flex items-center justify-center text-4xl overflow-hidden">
                    🌿
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#5C6B60] block mb-1">
                      {rel.category.replace(/-/g, ' ')}
                    </span>
                    <h4 className="font-serif text-base font-semibold text-[#122A1F] leading-snug mb-1">
                      {rel.name}
                    </h4>
                    <p className="font-mono text-xs font-bold text-[#1C3F2D] mb-3">
                      {formatPrice(rel.price_paise)}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#E4DDC8]">
                    <Link
                      href={`/products/${rel.slug}`}
                      className="flex-1 text-center py-2 bg-white hover:bg-gray-100 text-xs font-bold text-[#151F19] rounded-lg border border-gray-300 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleQuickAdd(rel)}
                      className="px-3 py-2 bg-[#122A1F] hover:bg-[#1C3F2D] text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= SECTION 5a: WHY IS THIS THE RIGHT CHOICE ================= */}
      <section className="bg-white py-14">
        <div className="wrap">
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#151F19]">
              Why is this the <span className="underline decoration-[#3E8F52] decoration-2 underline-offset-4">right choice?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#DCF5A8]/50 p-6 rounded-2xl border border-[#DCF5A8] space-y-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/70 px-2.5 py-1 rounded-full inline-block">
                01 Purity
              </span>
              <h4 className="text-xl font-extrabold text-[#151F19] leading-tight">Soil-Free &amp; Clean</h4>
              <p className="font-mono text-xs text-[#5C6B60]">Zero compost pathogens or grit</p>
            </div>

            <div className="bg-[#BEE3F5]/50 p-6 rounded-2xl border border-[#BEE3F5] space-y-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/70 px-2.5 py-1 rounded-full inline-block">
                02 Water
              </span>
              <h4 className="text-xl font-extrabold text-[#151F19] leading-tight">Mineral RO Water</h4>
              <p className="font-mono text-xs text-[#5C6B60]">Pure drinking-grade water supply</p>
            </div>

            <div className="bg-[#FFE0B2]/50 p-6 rounded-2xl border border-[#FFE0B2] space-y-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/70 px-2.5 py-1 rounded-full inline-block">
                03 Timing
              </span>
              <h4 className="text-xl font-extrabold text-[#151F19] leading-tight">10-Day Peak</h4>
              <p className="font-mono text-xs text-[#5C6B60]">Max biological nutrient concentration</p>
            </div>

            <div className="bg-[#E9D8F2]/50 p-6 rounded-2xl border border-[#E9D8F2] space-y-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/70 px-2.5 py-1 rounded-full inline-block">
                04 Freshness
              </span>
              <h4 className="text-xl font-extrabold text-[#151F19] leading-tight">Cut to Order</h4>
              <p className="font-mono text-xs text-[#5C6B60]">Still living when it reaches your kitchen</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STICKY ADD-TO-CART BAR ================= */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-40 bg-[#F3EEE0]/95 backdrop-blur-md border-t border-black/10 py-3 transition-transform duration-300 shadow-2xl ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="wrap flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PRODUCT_IMAGES[0]}
              alt="Thumb"
              className="w-11 h-11 rounded-lg object-cover border border-black/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="font-serif font-semibold text-sm sm:text-base text-[#151F19] truncate">
                {product.name}
              </div>
              <div className="font-mono text-[10px] sm:text-xs text-[#5C6B60] uppercase">
                <span className="font-bold text-[#1C3F2D]">{formatPrice(effectivePrice)}</span>
                <span className="mx-1.5 opacity-50">·</span>
                <span>{selectedVariant.label}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-[#122A1F] hover:bg-[#1C3F2D] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md flex-shrink-0"
          >
            {addedFeedback ? (
              <span className="text-[#CFFA57]">✓ Added!</span>
            ) : (
              <>
                <span>Add to Cart</span>
                <span>·</span>
                <span>{formatPrice(effectivePrice)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { formatPrice } from '@/lib/format';
import { Product } from './page';

interface ProductMeta {
  photo: string;
  benefit: string;
  badge: { text: string; bg: string; color: string };
  sleeveDesc: string;
}

const PRODUCT_METAS: Record<string, ProductMeta> = {
  'broccoli-microgreens': {
    photo: 'https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=800&auto=format&fit=crop',
    benefit: '40x sulforaphane vs mature head',
    badge: { text: 'BESTSELLER', bg: '#9C4A5C', color: '#FFFDF8' },
    sleeveDesc: 'Sulforaphane dense living shoots',
  },
  'sunflower-microgreens': {
    photo: 'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?fm=jpg&q=80&w=800&auto=format&fit=crop',
    benefit: 'Complete plant protein & zinc',
    badge: { text: 'CUSTOMER FAVORITE', bg: '#9C4A5C', color: '#FFFDF8' },
    sleeveDesc: 'Crunchy, nutty protein shoots',
  },
  'radish-microgreens': {
    photo: 'https://images.unsplash.com/photo-1647613233075-e0d5546b0f22?fm=jpg&q=80&w=800&auto=format&fit=crop',
    benefit: 'Vitamins A, C & peppery kick',
    badge: { text: 'PEAK FLAVOUR', bg: '#FF9F5A', color: '#122A1F' },
    sleeveDesc: 'Zesty, spicy living garnish',
  },
  'classic-trio-bundle': {
    photo: 'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=800&auto=format&fit=crop',
    benefit: '3 living trays · all varieties',
    badge: { text: 'VALUE BUNDLE', bg: '#9C4A5C', color: '#FFFDF8' },
    sleeveDesc: 'Broccoli, Radish & Sunflower trio',
  },
};

function getProductMeta(product: Product): ProductMeta {
  if (PRODUCT_METAS[product.slug]) {
    return PRODUCT_METAS[product.slug];
  }
  return {
    photo: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?fm=jpg&q=80&w=800&auto=format&fit=crop',
    benefit: 'Living greens · peak density',
    badge: { text: 'FRESH HARVEST', bg: '#3E8F52', color: '#FFFDF8' },
    sleeveDesc: 'Locally grown living microgreens',
  };
}

const CATEGORY_HEADERS: Record<string, { title: string; desc: string }> = {
  'salad-greens': {
    title: 'SALAD GREENS',
    desc: 'Crunchy, peppery, living shoots harvested at peak biological density. Keep on your counter for 7–10 days living.',
  },
  'samplers': {
    title: 'SAMPLERS & BUNDLES',
    desc: 'Experience the full spectrum of cellular nutrition. Three signature living varieties delivered together at special bundle pricing.',
  },
};

export default function ProductListClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: string[];
}) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const addItem = useCartStore((s) => s.addItem);

  const categories = initialCategories.length > 0 ? initialCategories : ['salad-greens', 'samplers'];

  const filteredProducts = selectedCat
    ? initialProducts.filter((p) => p.category === selectedCat)
    : initialProducts;

  // Group products by category
  const productsByCategory: Record<string, Product[]> = {};
  if (selectedCat) {
    productsByCategory[selectedCat] = filteredProducts;
  } else {
    categories.forEach((cat) => {
      const prods = initialProducts.filter((p) => p.category === cat);
      if (prods.length > 0) {
        productsByCategory[cat] = prods;
      }
    });
    // Add any products whose category is not in initialCategories
    const remaining = initialProducts.filter((p) => !categories.includes(p.category));
    if (remaining.length > 0) {
      productsByCategory['other'] = remaining;
    }
  }

  const handleAddToCart = (product: Product) => {
    const activeVar = product.variants.find((v) => v.is_active) || product.variants[0];
    const price = activeVar ? activeVar.price_paise : 9900;
    const variantId = activeVar ? activeVar.id : product.id;
    const label = activeVar ? activeVar.label : '100g tray';

    addItem({
      variantId,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: label,
      pricePaise: price,
      maxStock: activeVar?.stock_qty || 20,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const scrollTrack = (catKey: string, dir: 'left' | 'right') => {
    const el = carouselRefs.current[catKey];
    if (!el) return;
    const offset = dir === 'left' ? -280 : 280;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F3EEE0] text-[#151F19] min-h-screen">
      {/* ================= SECTION 1: PLP HERO ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[82vh]">
        {/* Left Column: Forest Copy */}
        <div className="bg-[#1C3F2D] text-[#FFFDF8] flex flex-col justify-center pt-36 pb-20 px-8 sm:px-14 lg:px-20">
          <div className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[#B7E23F] mb-5 font-semibold">
            🌱 LIVING HARVEST · TRICITY GROWN
          </div>

          <h1 className="font-serif font-medium text-4xl sm:text-5xl lg:text-6xl leading-[1.06] tracking-tight max-w-lg mb-6">
            Cut to order, delivered{' '}
            <em className="italic text-[#CFFA57] font-normal">still breathing.</em>
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed mb-8">
            Living microgreen trays delivered on harvest morning across Chandigarh, Mohali &amp;
            Panchkula. Snip fresh into your daily meals for up to 10 days.
          </p>

          <button
            onClick={scrollToCatalog}
            className="w-10 h-10 rounded-full border border-white/35 flex items-center justify-center text-white hover:bg-white/10 hover:border-white transition-all animate-bounce"
            aria-label="Scroll to catalog"
          >
            ↓
          </button>
        </div>

        {/* Right Column: High-Res Greens Photo */}
        <div
          className="relative min-h-[320px] md:min-h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?fm=jpg&q=85&w=1600&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
        </div>
      </section>

      {/* ================= SECTION 2: STICKY CATEGORY PILLS BAR ================= */}
      <nav
        id="catalog"
        className="sticky top-16 z-30 bg-[#FFFDF8] border-b border-[#E4DDC8] py-4 px-4 sm:px-8 shadow-sm backdrop-blur-md"
      >
        <div className="max-w-[1180px] mx-auto flex gap-2.5 overflow-x-auto scrollbar-none items-center">
          <button
            onClick={() => setSelectedCat(null)}
            className={`flex-shrink-0 font-mono text-xs tracking-wider uppercase font-semibold px-4 py-2 rounded-full border transition-all ${
              selectedCat === null
                ? 'bg-[#CFFA57] text-[#122A1F] border-[#CFFA57] font-bold shadow-sm'
                : 'border-[#E4DDC8] text-[#5C6B60] hover:border-[#1C3F2D] hover:text-[#1C3F2D]'
            }`}
          >
            All Greens
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`flex-shrink-0 font-mono text-xs tracking-wider uppercase font-semibold px-4 py-2 rounded-full border transition-all ${
                selectedCat === cat
                  ? 'bg-[#1C3F2D] text-[#FFFDF8] border-[#1C3F2D] shadow-sm'
                  : 'border-[#E4DDC8] text-[#5C6B60] hover:border-[#1C3F2D] hover:text-[#1C3F2D]'
              }`}
            >
              {cat.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </nav>

      {/* ================= SECTION 3: PRODUCT CATALOG CAROUSELS ================= */}
      <div className="py-14 space-y-16">
        {Object.entries(productsByCategory).map(([catKey, prods]) => {
          const headerInfo = CATEGORY_HEADERS[catKey] || {
            title: catKey.replace(/-/g, ' ').toUpperCase(),
            desc: 'Living, nutrient-dense microgreens grown with pure mineral RO water in the Tricity.',
          };

          return (
            <section key={catKey} className="max-w-[1180px] mx-auto px-4 sm:px-8">
              {/* Category Header */}
              <div className="max-w-xl mb-8">
                <h3 className="font-display uppercase text-2xl sm:text-3xl tracking-wide text-[#151F19] mb-2">
                  {headerInfo.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C6B60] leading-relaxed">
                  {headerInfo.desc}
                </p>
              </div>

              {/* Carousel Container */}
              <div className="relative">
                {/* Arrow Left */}
                <button
                  onClick={() => scrollTrack(catKey, 'left')}
                  className="hidden sm:flex absolute left-[-16px] top-[32%] z-10 w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#E4DDC8] items-center justify-center text-[#122A1F] hover:bg-[#1C3F2D] hover:text-[#FFFDF8] hover:border-[#1C3F2D] transition-all shadow-md"
                  aria-label="Previous products"
                >
                  ‹
                </button>

                {/* Track */}
                <div
                  ref={(el) => {
                    carouselRefs.current[catKey] = el;
                  }}
                  className="flex gap-6 overflow-x-auto scroll-snap-x mandatory scrollbar-none pb-4 pt-1 px-1"
                >
                  {prods.map((product) => {
                    const meta = getProductMeta(product);
                    const activeVar =
                      product.variants.find((v) => v.is_active) || product.variants[0];
                    const pricePaise = activeVar ? activeVar.price_paise : 9900;
                    const isAdded = !!addedIds[product.id];

                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-64 sm:w-64 scroll-snap-start flex flex-col justify-between group"
                      >
                        <div>
                          {/* ================= VERTICAL CLAMSHELL CARD ================= */}
                          <div className="relative rounded-[18px] aspect-[1/1.34] overflow-hidden mb-3.5 border border-[#E4DDC8] shadow-sm bg-gradient-to-br from-[#EEF1EE] to-[#DFE4DF] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg">
                            {/* Product Tag Badge */}
                            <span
                              style={{
                                backgroundColor: meta.badge.bg,
                                color: meta.badge.color,
                              }}
                              className="absolute top-3 left-3 z-20 font-mono text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1"
                            >
                              <span>🌱</span>
                              <span>{meta.badge.text}</span>
                            </span>

                            {/* Background Living Greens Photo */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={meta.photo}
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Clamshell Lid Inset Sheen */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_8px_rgba(255,255,255,0.45),inset_0_0_20px_rgba(255,255,255,0.3)]">
                              <div className="absolute top-2 left-2 right-1/2 bottom-3/5 rounded-md bg-gradient-to-br from-white/35 to-transparent -rotate-6" />
                            </div>

                            {/* Vertical Branded Sleeve Down Left Portion */}
                            <div className="absolute top-[8%] bottom-[8%] left-[8%] w-[48%] rounded-xl overflow-hidden flex flex-col bg-white/95 backdrop-blur-sm shadow-xl z-10 border border-black/5">
                              {/* Sleeve Top Photo Thumbnail */}
                              <div className="h-[28%] overflow-hidden relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={meta.photo}
                                  alt="Thumb"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Sleeve Body */}
                              <div className="flex-1 p-2.5 flex flex-col justify-between">
                                <div>
                                  <div className="font-serif font-bold text-[8.5px] tracking-wide text-[#1C3F2D] flex items-center gap-1 mb-1">
                                    <span>🌱</span> WAG
                                  </div>
                                  <h5 className="font-serif font-bold text-[11.5px] leading-tight text-[#151F19] mb-1 line-clamp-2">
                                    {product.name}
                                  </h5>
                                  <p className="text-[7.5px] text-[#33402F] leading-tight line-clamp-3">
                                    {meta.sleeveDesc}
                                  </p>
                                </div>

                                <div className="font-mono text-[5.5px] uppercase tracking-wider text-[#5C6B60] pt-1.5 border-t border-black/10">
                                  100G LIVE TRAY · DAY 10
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Product Title */}
                          <Link href={`/products/${product.slug}`}>
                            <h4 className="font-serif font-semibold text-[17px] text-[#151F19] mb-2 hover:text-[#1C3F2D] transition-colors leading-snug">
                              {product.name}
                            </h4>
                          </Link>

                          {/* Info Rows */}
                          <div className="border-t border-b border-[#E4DDC8] py-2.5 mb-3 space-y-1.5 text-xs text-[#5C6B60]">
                            <div className="flex items-center gap-2">
                              <span className="text-[#1C3F2D] text-xs">⚡</span>
                              <span className="truncate">{meta.benefit}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#3E8F52] text-xs">🌿</span>
                              <span>Living tray · 7–10 days fresh</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action Row */}
                        <div>
                          <div className="font-mono font-bold text-[15px] text-[#122A1F] mb-3">
                            {formatPrice(pricePaise)}{' '}
                            <span className="font-normal text-[11px] text-[#5C6B60] uppercase">
                              / tray
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.slug}`}
                              className="flex-1 text-center font-mono text-[10.5px] font-bold tracking-wider uppercase py-2.5 rounded-full border border-[#1C3F2D] text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-[#FFFDF8] transition-all"
                            >
                              Details
                            </Link>

                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-4 py-2.5 rounded-full bg-[#122A1F] hover:bg-[#1C3F2D] text-[#FFFDF8] font-mono text-[10.5px] font-bold tracking-wider uppercase transition-all shadow-sm"
                              title="Add to cart"
                            >
                              {isAdded ? (
                                <span className="text-[#CFFA57]">✓</span>
                              ) : (
                                <span>+ Add</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Arrow Right */}
                <button
                  onClick={() => scrollTrack(catKey, 'right')}
                  className="hidden sm:flex absolute right-[-16px] top-[32%] z-10 w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#E4DDC8] items-center justify-center text-[#122A1F] hover:bg-[#1C3F2D] hover:text-[#FFFDF8] hover:border-[#1C3F2D] transition-all shadow-md"
                  aria-label="Next products"
                >
                  ›
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* ================= SECTION 4: TRUST HERO ================= */}
      <section className="relative overflow-hidden bg-[#0F1C12] text-[#FFFDF8] py-16 sm:py-20">
        {/* Background Photo with Scrim */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=85&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#0A140D]/95 via-[#0A140D]/75 to-transparent" />

        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-8">
          <div className="max-w-xl">
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-5xl leading-[1.08] tracking-tight mb-3">
              Grown for your gut,{' '}
              <em className="italic text-[#CFFA57] font-normal">not the supermarket shelf.</em>
            </h2>

            {/* Handwritten Caveat Accent */}
            <div className="flex items-center gap-3 mb-8 ml-2">
              <svg
                className="w-8 h-6 text-[#CFFA57] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-handwriting font-bold text-2xl text-[#CFFA57]">
                freshly harvested in the Tricity
              </span>
            </div>

            {/* 4 Bullets Grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm text-white/90">
              <li className="flex items-start gap-2.5">
                <span className="text-[#CFFA57] text-base leading-none mt-0.5">✦</span>
                <span>100% Reverse Osmosis mineral drinking water</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#CFFA57] text-base leading-none mt-0.5">✦</span>
                <span>Zero soil, zero compost pathogens or grit</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#CFFA57] text-base leading-none mt-0.5">✦</span>
                <span>10-day biological harvest peak density</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#CFFA57] text-base leading-none mt-0.5">✦</span>
                <span>Delivered within hours of harvest</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: FULL TRANSPARENCY COMPARISON ================= */}
      <section className="bg-[#1C3F2D] text-[#FFFDF8] py-20 border-y border-[#E4DDC8]/20">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Copy & 3-Photo Collage */}
            <div>
              <h2 className="font-display uppercase text-3xl sm:text-4xl lg:text-5xl text-[#CFFA57] leading-none mb-3">
                Full Transparency
              </h2>
              <p className="font-serif italic text-base sm:text-lg text-white/90 mb-8 max-w-md">
                We publish everything about how your greens are cultivated. No hidden secrets, no
                industrial shortcuts.
              </p>

              {/* Overlapping Photo Collage */}
              <div className="relative h-64 sm:h-72 max-w-sm">
                {/* Image 1 */}
                <div className="absolute w-[44%] aspect-[3/4] top-0 left-2 z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 -rotate-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1613769049987-b31b641f25b1?fm=jpg&q=80&w=600&auto=format&fit=crop"
                    alt="Indoor rack"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image 2 */}
                <div className="absolute w-[42%] aspect-square top-[12%] left-[34%] z-20 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 rotate-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=600&auto=format&fit=crop"
                    alt="Living broccoli"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image 3 */}
                <div className="absolute w-[44%] aspect-[4/3] bottom-2 right-4 z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 -rotate-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=600&auto=format&fit=crop"
                    alt="Fresh tray"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Comparison Table */}
            <div className="bg-white/5 border border-white/15 rounded-3xl p-5 sm:p-7 backdrop-blur-sm">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center pb-3 border-b border-white/20 font-mono text-[10px] uppercase tracking-wider text-white/55">
                <span>Parameter</span>
                <span className="w-24 sm:w-28 text-center text-[#CFFA57] font-bold">
                  Wild About Greens
                </span>
                <span className="w-24 sm:w-28 text-center">Store Bought</span>
              </div>

              <div className="divide-y divide-white/10 text-xs sm:text-sm">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-4">
                  <span className="font-semibold text-white/90">Growing Medium</span>
                  <span className="w-24 sm:w-28 text-center text-[#CFFA57] font-bold flex items-center justify-center gap-1">
                    <span>✓</span> Sterile Coco-Peat
                  </span>
                  <span className="w-24 sm:w-28 text-center text-white/40">Field Soil / Slurry</span>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-4">
                  <span className="font-semibold text-white/90">Water Source</span>
                  <span className="w-24 sm:w-28 text-center text-[#CFFA57] font-bold flex items-center justify-center gap-1">
                    <span>✓</span> 100% Mineral RO
                  </span>
                  <span className="w-24 sm:w-28 text-center text-white/40">Agri Runoff</span>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-4">
                  <span className="font-semibold text-white/90">Chemical Sprays</span>
                  <span className="w-24 sm:w-28 text-center text-[#CFFA57] font-bold flex items-center justify-center gap-1">
                    <span>✓</span> 0.00% Pesticides
                  </span>
                  <span className="w-24 sm:w-28 text-center text-white/40">Frequent Sprays</span>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-4">
                  <span className="font-semibold text-white/90">Harvest to Door</span>
                  <span className="w-24 sm:w-28 text-center text-[#CFFA57] font-bold flex items-center justify-center gap-1">
                    <span>✓</span> &lt; 6 Hours Living
                  </span>
                  <span className="w-24 sm:w-28 text-center text-white/40">5–12 Days Freight</span>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-4">
                  <span className="font-semibold text-white/90">Vitality</span>
                  <span className="w-24 sm:w-28 text-center text-[#CFFA57] font-bold flex items-center justify-center gap-1">
                    <span>✓</span> Living Roots
                  </span>
                  <span className="w-24 sm:w-28 text-center text-white/40">Dead &amp; Wilting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: WHY CHOOSE US (4 COLOR BLOCKS) ================= */}
      <section className="bg-[#FFFDF8] py-16">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#151F19]">
              Why Choose Wild About Greens?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Block 1 */}
            <div className="bg-[#DCF5A8]/60 p-6 rounded-2xl border border-[#DCF5A8] flex flex-col justify-between aspect-[1/1.2] shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/80 px-2.5 py-1 rounded-full">
                  01 Purity
                </span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xl text-[#151F19] leading-snug mb-1">
                  Soil-Free &amp; Clean
                </h4>
                <p className="font-mono text-xs text-[#5C6B60]">
                  Zero compost pathogens, pests, or dirt grit
                </p>
              </div>
            </div>

            {/* Block 2 */}
            <div className="bg-[#BEE3F5]/60 p-6 rounded-2xl border border-[#BEE3F5] flex flex-col justify-between aspect-[1/1.2] shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/80 px-2.5 py-1 rounded-full">
                  02 Water
                </span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xl text-[#151F19] leading-snug mb-1">
                  Mineral RO Water
                </h4>
                <p className="font-mono text-xs text-[#5C6B60]">
                  Pure drinking-grade reverse osmosis supply
                </p>
              </div>
            </div>

            {/* Block 3 */}
            <div className="bg-[#FFE0B2]/60 p-6 rounded-2xl border border-[#FFE0B2] flex flex-col justify-between aspect-[1/1.2] shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/80 px-2.5 py-1 rounded-full">
                  03 Timing
                </span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xl text-[#151F19] leading-snug mb-1">
                  10-Day Peak
                </h4>
                <p className="font-mono text-xs text-[#5C6B60]">
                  Maximum biological micronutrient density
                </p>
              </div>
            </div>

            {/* Block 4 */}
            <div className="bg-[#E9D8F2]/60 p-6 rounded-2xl border border-[#E9D8F2] flex flex-col justify-between aspect-[1/1.2] shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1C3F2D] bg-white/80 px-2.5 py-1 rounded-full">
                  04 Freshness
                </span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xl text-[#151F19] leading-snug mb-1">
                  Cut to Order
                </h4>
                <p className="font-mono text-xs text-[#5C6B60]">
                  Living tray still breathing in your kitchen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

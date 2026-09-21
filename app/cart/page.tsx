'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore, getProductThumbnail } from '@/lib/cartStore';
import { formatPrice } from '@/lib/format';
import { Plus, Minus, Truck } from '@/components/icons';
import SprigDefs, { Sprig } from '@/components/SprigDefs';
import CartMascot from '@/components/CartMascot';

interface AddonProduct {
  id: string;
  slug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  pricePaise: number;
  mrpPaise: number;
  discountOff: string;
  badge: string;
  photo: string;
  maxStock: number;
}

const DEFAULT_ADDONS: AddonProduct[] = [
  {
    id: 'broccoli-microgreens',
    slug: 'broccoli-microgreens',
    name: 'Broccoli Microgreens',
    variantId: 'var-broccoli-50g',
    variantLabel: '50g living tray',
    pricePaise: 9900,
    mrpPaise: 12000,
    discountOff: '₹21 OFF',
    badge: '★ BESTSELLER',
    photo: 'https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=800&auto=format&fit=crop',
    maxStock: 25,
  },
  {
    id: 'sunflower-microgreens',
    slug: 'sunflower-microgreens',
    name: 'Sunflower Microgreens',
    variantId: 'var-sunflower-50g',
    variantLabel: '50g living tray',
    pricePaise: 8900,
    mrpPaise: 11000,
    discountOff: '₹21 OFF',
    badge: '☀ FAVORITE',
    photo: 'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?fm=jpg&q=80&w=800&auto=format&fit=crop',
    maxStock: 30,
  },
  {
    id: 'radish-microgreens',
    slug: 'radish-microgreens',
    name: 'Radish Microgreens',
    variantId: 'var-radish-50g',
    variantLabel: '50g living tray',
    pricePaise: 7900,
    mrpPaise: 9900,
    discountOff: '₹20 OFF',
    badge: '🌱 PEAK FLAVOUR',
    photo: 'https://images.unsplash.com/photo-1647613233075-e0d5546b0f22?fm=jpg&q=80&w=800&auto=format&fit=crop',
    maxStock: 35,
  },
  {
    id: 'classic-trio-bundle',
    slug: 'classic-trio-bundle',
    name: 'Classic Trio Bundle',
    variantId: 'var-trio-bundle',
    variantLabel: '3 living trays',
    pricePaise: 24900,
    mrpPaise: 29900,
    discountOff: '₹50 OFF',
    badge: '✦ VALUE PACK',
    photo: 'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=800&auto=format&fit=crop',
    maxStock: 15,
  },
];

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPaise, addItem } = useCartStore();
  const [addons, setAddons] = useState<AddonProduct[]>(DEFAULT_ADDONS);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch live variants and prices for recommendations
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        setAddons((prev) =>
          prev.map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const found = data.find((p: any) => p.slug === item.slug);
            if (found && found.variants && found.variants.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const activeVar = found.variants.find((v: any) => v.is_active) || found.variants[0];
              const price = activeVar.price_paise;
              const approxMrp = Math.round(price * 1.25);
              return {
                ...item,
                variantId: activeVar.id,
                variantLabel: activeVar.label || item.variantLabel,
                pricePaise: price,
                mrpPaise: approxMrp,
                discountOff: `₹${Math.round((approxMrp - price) / 100)} OFF`,
                maxStock: activeVar.stock_qty || item.maxStock,
                photo: found.thumbnail_url || found.images?.[0]?.image_url || item.photo,
              };
            }
            return item;
          })
        );
      })
      .catch(() => {});
  }, []);

  const total = totalPaise();

  const handleAddAddon = (prod: AddonProduct) => {
    addItem({
      variantId: prod.variantId,
      productSlug: prod.slug,
      productName: prod.name,
      variantLabel: prod.variantLabel,
      pricePaise: prod.pricePaise,
      maxStock: prod.maxStock,
      thumbnailUrl: prod.photo,
    });
    setAddedIds((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [prod.id]: false }));
    }, 1600);
  };

  if (!mounted) {
    return (
      <div className="bg-[#F3EEE0] text-[#151F19] min-h-screen pt-32 pb-24 text-center">
        <main className="max-w-2xl mx-auto px-4">
          <div className="bg-[#FFFDF8] border border-[#E4DDC8] rounded-3xl p-10 sm:p-14 shadow-sm">
            <span className="text-6xl mb-5 block">🌱</span>
            <p className="font-mono text-sm text-[#5C6B60]">Loading living cart...</p>
          </div>
        </main>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (items.length === 0) {
    return (
      <div className="relative bg-[#F3EEE0] text-[#151F19] min-h-screen pt-32 pb-24 overflow-hidden">
        <SprigDefs />
        <Sprig rotation="-16deg" width="48px" style={{ left: '4%', top: '15%' }} />
        <Sprig rotation="24deg" width="60px" delay="1.2s" style={{ right: '5%', top: '22%' }} />

        <main className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <div className="bg-[#FFFDF8] border border-[#E4DDC8] rounded-3xl p-8 sm:p-14 shadow-sm">
            <CartMascot className="w-36 h-36 mx-auto mb-4" />
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#151F19] mb-2">
              This cart is empty inside!
            </h1>
            <p className="font-handwriting text-2xl text-[#2D7A4D] font-bold mb-8 max-w-md mx-auto leading-snug">
              Fill it, before the cart takes a drastic step it&apos;ll regret the rest of its life.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#122A1F] hover:bg-[#1C3F2D] text-[#FFFDF8] font-mono text-xs font-bold uppercase tracking-[0.14em] px-8 py-4 rounded-full transition-all shadow-md hover:-translate-y-0.5"
            >
              Explore Living Trays →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const unaddedAddons = addons.filter((a) => !items.some((i) => i.productSlug === a.slug));

  return (
    <div className="relative bg-[#F3EEE0] text-[#151F19] min-h-screen pt-28 pb-24 overflow-hidden">
      <SprigDefs />
      {/* Botanical drift decor in page corners */}
      <Sprig rotation="-18deg" width="44px" style={{ left: '3%', top: '12%' }} />
      <Sprig rotation="25deg" width="58px" delay="1.5s" style={{ right: '3%', top: '20%' }} />
      <Sprig rotation="-12deg" width="36px" delay="2.4s" style={{ left: '5%', bottom: '15%' }} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb */}
        <nav className="font-mono text-[11px] tracking-wider uppercase text-[#5C6B60] mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1C3F2D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1C3F2D] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#122A1F] font-bold">Cart</span>
        </nav>

        {/* Heading & Harvest Reassurance */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#151F19] tracking-tight">
              Shopping Cart
            </h1>
            <p className="font-mono text-xs text-[#5C6B60] uppercase tracking-wider mt-1 flex items-center gap-1.5">
              <span>🌱</span>
              <span>Harvested live on delivery day · Chandigarh · Mohali · Panchkula</span>
            </p>
          </div>

          <span className="self-start sm:self-auto font-mono text-xs font-bold text-[#1C3F2D] bg-[#EBF5EE] border border-[#C5DEC9] px-3 py-1 rounded-full">
            {items.reduce((sum, i) => sum + i.quantity, 0)} trays in box
          </span>
        </div>

        {/* Free Delivery Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#EBF5EE] to-[#E3EFE5] border border-[#C5DEC9] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-[#1C3F2D] text-[#FFFDF8] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs font-bold text-[#1C3F2D] uppercase tracking-wider">
              Free Hyperlocal Delivery Unlocked
            </p>
            <p className="text-xs text-[#5C6B60]">
              Delivered within hours of live cutting directly to your doorstep.
            </p>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl shadow-xs hover:border-[#1C3F2D]/30 transition-colors"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                {/* Product Thumbnail - fixed compact square */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border border-[#E4DDC8] bg-[#F3EEE0] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getProductThumbnail(item.productSlug, item.thumbnailUrl)}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[9.5px] uppercase font-bold text-[#1C3F2D] bg-[#EBF5EE] px-2 py-0.5 rounded border border-[#C5DEC9]">
                      Living Tray
                    </span>
                  </div>
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="font-serif font-bold text-base sm:text-lg text-[#151F19] hover:text-[#1C3F2D] transition-colors block truncate"
                  >
                    {item.productName}
                  </Link>
                  <p className="font-mono text-xs text-[#5C6B60] uppercase tracking-wide mt-0.5">
                    {item.variantLabel}
                  </p>
                  <p className="font-mono text-xs text-[#1C3F2D] font-bold mt-1">
                    {formatPrice(item.pricePaise)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E4DDC8]/60">
                {/* Stepper */}
                <div className="flex items-center border border-[#E4DDC8] rounded-xl bg-[#F3EEE0]/50 overflow-hidden shadow-2xs">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#151F19] hover:bg-[#E4DDC8] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-xs text-[#122A1F]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#151F19] hover:bg-[#E4DDC8] transition-colors disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus />
                  </button>
                </div>

                {/* Item Total & Remove */}
                <div className="text-right min-w-[90px]">
                  <p className="font-mono font-bold text-base text-[#122A1F]">
                    {formatPrice(item.pricePaise * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#5C6B60] hover:text-red-600 transition-colors mt-1"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CROSS-SELL RECOMMENDATIONS ================= */}
        {unaddedAddons.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[#E4DDC8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] font-semibold text-[#5C6B60] block">
                  Frequently Added Together
                </span>
                <h3 className="font-serif font-bold text-xl text-[#151F19]">
                  Add living bestsellers to your box
                </h3>
              </div>
              <span className="font-mono text-xs text-[#2D7A4D] font-bold hidden sm:inline-block">
                🌱 Harvested fresh together
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {unaddedAddons.slice(0, 2).map((addon) => {
                const isAdded = !!addedIds[addon.id];
                return (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between gap-3 p-3.5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl shadow-xs hover:border-[#1C3F2D]/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E4DDC8] bg-[#F3EEE0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={addon.photo}
                          alt={addon.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[9px] font-bold text-[#1C3F2D] uppercase tracking-wider block">
                          {addon.badge}
                        </span>
                        <p className="font-serif font-bold text-sm text-[#151F19] truncate">
                          {addon.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-bold text-xs text-[#1C3F2D]">
                            {formatPrice(addon.pricePaise)}
                          </span>
                          <span className="font-mono text-[10px] text-[#5C6B60] line-through">
                            {formatPrice(addon.mrpPaise)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddAddon(addon)}
                      className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl shrink-0 transition-all shadow-2xs ${
                        isAdded
                          ? 'bg-[#2D7A4D] text-[#FFFDF8]'
                          : 'bg-[#1C3F2D] hover:bg-[#122A1F] text-[#FFFDF8]'
                      }`}
                    >
                      {isAdded ? 'Added ✓' : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= ORDER SUMMARY CARD ================= */}
        <div className="mt-8 p-6 sm:p-7 bg-[#FFFDF8] border border-[#E4DDC8] rounded-3xl shadow-sm">
          <div className="space-y-3 pb-5 border-b border-[#E4DDC8]">
            <div className="flex justify-between text-sm text-[#5C6B60]">
              <span>Subtotal</span>
              <span className="font-mono font-semibold text-[#151F19]">
                {formatPrice(total)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#5C6B60]">
              <span className="flex items-center gap-1.5">
                <span>Delivery (Tricity Radius)</span>
                <span className="text-[10px] font-mono bg-[#EBF5EE] text-[#1C3F2D] px-1.5 py-0.5 rounded font-bold">
                  FREE
                </span>
              </span>
              <span className="font-mono text-xs text-[#3E8F52] font-bold uppercase">
                Free on harvest morning
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline py-4 mb-6">
            <div>
              <span className="font-serif font-bold text-xl text-[#151F19] block">Total</span>
              <span className="font-mono text-[11px] text-[#5C6B60]">
                Taxes &amp; Tricity harvest shipping included
              </span>
            </div>
            <span className="font-mono font-bold text-2xl sm:text-3xl text-[#122A1F]">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="flex-1 text-center font-mono text-xs font-bold uppercase tracking-[0.14em] py-4 px-6 rounded-full border border-[#1C3F2D] text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-[#FFFDF8] transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              href="/checkout"
              className="flex-1 text-center font-mono text-xs font-bold uppercase tracking-[0.14em] py-4 px-6 rounded-full bg-[#122A1F] hover:bg-[#1C3F2D] text-[#FFFDF8] transition-all shadow-md hover:-translate-y-0.5"
            >
              Proceed to Checkout →
            </Link>
          </div>

          <p className="font-mono text-[11.5px] text-[#5C6B60] text-center mt-5 flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Safe &amp; Secure Checkout via Razorpay · UPI, Cards &amp; NetBanking</span>
          </p>
        </div>

        {/* ================= TRUST / BRAND PILLARS ================= */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl text-center">
            <span className="text-xl block mb-1">🌱</span>
            <p className="font-serif font-bold text-xs text-[#151F19]">Cut to Order</p>
            <p className="font-mono text-[10px] text-[#5C6B60] mt-0.5">Never cold stored</p>
          </div>
          <div className="p-3.5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl text-center">
            <span className="text-xl block mb-1">💧</span>
            <p className="font-serif font-bold text-xs text-[#151F19]">Pure Mineral Water</p>
            <p className="font-mono text-[10px] text-[#5C6B60] mt-0.5">Zero pesticides</p>
          </div>
          <div className="p-3.5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl text-center">
            <span className="text-xl block mb-1">⚡</span>
            <p className="font-serif font-bold text-xs text-[#151F19]">40x Density</p>
            <p className="font-mono text-[10px] text-[#5C6B60] mt-0.5">Peak micronutrients</p>
          </div>
          <div className="p-3.5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl text-center">
            <span className="text-xl block mb-1">🚚</span>
            <p className="font-serif font-bold text-xs text-[#151F19]">Hyperlocal Tricity</p>
            <p className="font-mono text-[10px] text-[#5C6B60] mt-0.5">Morning delivery</p>
          </div>
        </div>
      </main>
    </div>
  );
}

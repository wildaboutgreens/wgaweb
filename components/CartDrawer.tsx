'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, getProductThumbnail } from '@/lib/cartStore';
import { isAdminPath } from '@/lib/adminAuth';
import { formatPrice } from '@/lib/format';
import { X, Plus, Minus } from './icons';
import CartMascot from './CartMascot';

interface BestsellerProduct {
  id: string;
  slug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  pricePaise: number;
  mrpPaise: number;
  discountOff: string;
  badge: {
    text: string;
    bg: string;
    color: string;
  };
  cardBg: string;
  photo: string;
  maxStock: number;
}

const DEFAULT_BESTSELLERS: BestsellerProduct[] = [
  {
    id: 'broccoli-microgreens',
    slug: 'broccoli-microgreens',
    name: 'Broccoli Microgreens',
    variantId: 'var-broccoli-50g',
    variantLabel: '50g living tray',
    pricePaise: 9900,
    mrpPaise: 12000,
    discountOff: '₹21 OFF',
    badge: { text: '★ BESTSELLER', bg: '#1C3F2D', color: '#FFFDF8' },
    cardBg: '#EEF5EF',
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
    badge: { text: '☀ FAVORITE', bg: '#8C5815', color: '#FFFDF8' },
    cardBg: '#FAF4EB',
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
    badge: { text: '🌱 PEAK FLAVOUR', bg: '#2D7A4D', color: '#FFFDF8' },
    cardBg: '#F0F6F1',
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
    badge: { text: '✦ VALUE PACK', bg: '#122A1F', color: '#CFFA57' },
    cardBg: '#EEF2EE',
    photo: 'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=800&auto=format&fit=crop',
    maxStock: 15,
  },
];

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPaise, addItem, totalItems } =
    useCartStore();
  const total = totalPaise();
  const itemCount = totalItems();

  const [cartContent, setCartContent] = useState<Record<string, string>>({
    cart_empty_title: 'This cart is empty inside!',
    cart_empty_subtitle:
      'Fill it with living greens, before this poor cart decides to compost itself out of pure loneliness.',
    cart_mascot_variant: 'pleading',
    cart_rec_eyebrow: 'START WITH',
    cart_rec_title: 'Our Bestsellers',
  });
  const [bestsellers, setBestsellers] = useState<BestsellerProduct[]>(DEFAULT_BESTSELLERS);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch live cart-drawer content and products from DB
  useEffect(() => {
    if (!isOpen) return;

    Promise.all([
      fetch('/api/content/cart-drawer')
        .then((res) => (res.ok ? res.json() : {}))
        .catch(() => ({})),
      fetch('/api/products')
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => []),
    ]).then(([rawContent, rawProducts]) => {
      const contentData = (rawContent || {}) as Record<string, string>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productsData = (rawProducts || []) as any[];

      if (contentData && typeof contentData === 'object' && Object.keys(contentData).length > 0) {
        setCartContent((prev) => ({ ...prev, ...contentData }));
      }

      if (Array.isArray(productsData) && productsData.length > 0) {
        const slotKeys = [
          { prodKey: 'cart_rec_product_1', badgeKey: 'cart_rec_badge_1', defaultSlug: 'broccoli-microgreens', defaultBadge: '★ BESTSELLER', bg: '#EEF5EF', badgeBg: '#1C3F2D', badgeColor: '#FFFDF8' },
          { prodKey: 'cart_rec_product_2', badgeKey: 'cart_rec_badge_2', defaultSlug: 'sunflower-microgreens', defaultBadge: '☀ FAVORITE', bg: '#FAF4EB', badgeBg: '#8C5815', badgeColor: '#FFFDF8' },
          { prodKey: 'cart_rec_product_3', badgeKey: 'cart_rec_badge_3', defaultSlug: 'radish-microgreens', defaultBadge: '🌱 PEAK FLAVOUR', bg: '#F0F6F1', badgeBg: '#2D7A4D', badgeColor: '#FFFDF8' },
          { prodKey: 'cart_rec_product_4', badgeKey: 'cart_rec_badge_4', defaultSlug: 'classic-trio-bundle', defaultBadge: '✦ VALUE PACK', bg: '#EEF2EE', badgeBg: '#122A1F', badgeColor: '#CFFA57' },
        ];

        const mapped: BestsellerProduct[] = [];
        slotKeys.forEach((slot, idx) => {
          // If admin has set the key or fallback to defaultSlug
          const chosenSlug = contentData?.[slot.prodKey] !== undefined ? contentData[slot.prodKey] : slot.defaultSlug;
          if (!chosenSlug) return; // Client explicitly chose None / hide slot

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const found = productsData.find((p: any) => p.slug === chosenSlug);
          if (found && found.variants && found.variants.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const activeVar = found.variants.find((v: any) => v.is_active) || found.variants[0];
            const price = activeVar.price_paise;
            const approxMrp = Math.round(price * 1.25);
            const discountPaise = approxMrp - price;
            const customBadge = contentData?.[slot.badgeKey]?.trim();
            const rawBadge = customBadge || found.badge_label || slot.defaultBadge;
            const badgeLabel =
              rawBadge.startsWith('★') ||
              rawBadge.startsWith('☀') ||
              rawBadge.startsWith('🌱') ||
              rawBadge.startsWith('✦') ||
              rawBadge.startsWith('🏷️')
                ? rawBadge
                : `★ ${rawBadge.toUpperCase()}`;

            mapped.push({
              id: found.id,
              slug: found.slug,
              name: found.name,
              variantId: activeVar.id,
              variantLabel: activeVar.label || '100g living tray',
              pricePaise: price,
              mrpPaise: approxMrp,
              discountOff: `₹${Math.round(discountPaise / 100)} OFF`,
              badge: {
                text: badgeLabel,
                bg: slot.badgeBg,
                color: slot.badgeColor,
              },
              cardBg: slot.bg,
              photo: found.thumbnail_url || found.images?.[0]?.image_url || DEFAULT_BESTSELLERS[idx % DEFAULT_BESTSELLERS.length].photo,
              maxStock: activeVar.stock_qty || 25,
            });
          }
        });

        if (mapped.length > 0) {
          setBestsellers(mapped);
        }
      }
    });
  }, [isOpen]);

  const handleQuickAdd = (product: BestsellerProduct) => {
    addItem({
      variantId: product.variantId,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: product.variantLabel,
      pricePaise: product.pricePaise,
      maxStock: product.maxStock,
      thumbnailUrl: product.photo,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  if (isAdminPath(pathname)) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#122A1F]/50 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-[430px] bg-[#FFFDF8] border-l border-[#E4DDC8] shadow-2xl z-[70] flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4DDC8] bg-[#FFFDF8] sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#151F19]">
                  Your items
                </h2>
                <span className="font-mono text-xs font-bold text-[#1C3F2D] bg-[#EBF5EE] px-2 py-0.5 rounded-full border border-[#C5DEC9]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-[#5C6B60] hover:text-[#151F19] hover:bg-[#F3EEE0] rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              /* ================= EMPTY STATE ================= */
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {/* Quirky Hero */}
                <div className="pt-6 pb-5 px-6 text-center bg-[#FFFDF8] flex flex-col items-center">
                  <h3 className="font-serif font-semibold text-2xl text-[#151F19] tracking-tight">
                    {cartContent.cart_empty_title || 'This cart is empty inside!'}
                  </h3>

                  <div className="my-2">
                    <CartMascot
                      variant={cartContent.cart_mascot_variant || 'pleading'}
                      className="w-36 h-36"
                    />
                  </div>

                  <p className="font-handwriting text-xl sm:text-[22px] text-[#2D7A4D] font-bold leading-snug max-w-[280px] mx-auto">
                    {cartContent.cart_empty_subtitle ||
                      'Fill it with living greens, before this poor cart decides to compost itself out of pure loneliness.'}
                  </p>
                </div>

                {/* Bestsellers Section in Signature Warm Cream */}
                <div className="bg-[#F3EEE0] border-t border-[#E4DDC8] pt-5 pb-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Eyebrow & Fraunces Heading */}
                    <div className="text-center mb-4">
                      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6B60] font-semibold block mb-1">
                        {cartContent.cart_rec_eyebrow || 'start with'}
                      </span>
                      <div className="inline-block relative">
                        <h4 className="font-serif font-bold text-2xl text-[#151F19] tracking-tight">
                          {cartContent.cart_rec_title || 'Our Bestsellers'}
                        </h4>
                        <div className="w-12 h-0.5 bg-[#1C3F2D] mx-auto mt-1.5 rounded-full" />
                      </div>
                    </div>

                    {/* Horizontal Carousel (Scrollbar Hidden) */}
                    <div
                      ref={carouselRef}
                      className="flex gap-3 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 pt-1 pb-2 scroll-smooth"
                    >
                      {bestsellers.map((prod) => {
                        const isAdded = !!addedIds[prod.id];
                        return (
                          <div
                            key={prod.id}
                            className="w-[210px] shrink-0 flex flex-col justify-between bg-[#FFFDF8] rounded-2xl p-3 border border-[#E4DDC8] shadow-sm hover:shadow-md hover:border-[#1C3F2D]/40 transition-all group"
                          >
                            <div>
                              {/* Organic tinted packshot image container */}
                              <div
                                style={{ backgroundColor: prod.cardBg }}
                                className="relative aspect-square rounded-xl overflow-hidden mb-2.5 flex items-center justify-center p-2 border border-[#E4DDC8]/60"
                              >
                                {/* Badge */}
                                <div className="absolute top-2 left-2 z-10">
                                  <span
                                    style={{
                                      backgroundColor: prod.badge.bg,
                                      color: prod.badge.color,
                                    }}
                                    className="inline-flex items-center font-mono text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs"
                                  >
                                    {prod.badge.text}
                                  </span>
                                </div>

                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={prod.photo}
                                  alt={prod.name}
                                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Title */}
                              <Link
                                href={`/products/${prod.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="font-serif font-bold text-sm text-[#151F19] line-clamp-1 hover:text-[#1C3F2D] transition-colors"
                              >
                                {prod.name}
                              </Link>
                              <p className="font-mono text-[11px] text-[#5C6B60] mt-0.5">
                                {prod.variantLabel}
                              </p>

                              {/* Price Row */}
                              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                <span className="font-bold text-sm text-[#151F19]">
                                  {formatPrice(prod.pricePaise)}
                                </span>
                                <span className="font-mono text-xs text-[#5C6B60] line-through">
                                  {formatPrice(prod.mrpPaise)}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-[#1C3F2D] bg-[#EBF5EE] px-1.5 py-0.5 rounded border border-[#C5DEC9]">
                                  {prod.discountOff}
                                </span>
                              </div>

                              {/* Reassurance Tag */}
                              <p className="font-mono text-[10.5px] text-[#2D7A4D] font-medium mt-1.5 flex items-center gap-1">
                                <span>🌱</span>
                                <span>Harvested live to order</span>
                              </p>
                            </div>

                            {/* Full-width ADD Button in Website Forest Green */}
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(prod)}
                              className={`w-full mt-3 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-[0.98] ${
                                isAdded
                                  ? 'bg-[#2D7A4D] text-[#FFFDF8]'
                                  : 'bg-[#1C3F2D] hover:bg-[#122A1F] text-[#FFFDF8]'
                              }`}
                            >
                              {isAdded ? 'ADDED ✓' : 'ADD TO CART'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= FILLED STATE ================= */
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {/* Freshness announcement banner */}
                <div className="bg-[#EBF5EE] text-[#1C3F2D] font-mono text-xs font-medium px-4 py-2.5 border-b border-[#C5DEC9] flex items-center justify-center gap-1.5 shrink-0">
                  <span>🌱</span>
                  <span>Cut fresh to order · Delivered within hours in Tricity</span>
                </div>

                {/* Items List */}
                <div className="p-4 space-y-3">
                  {items.map((item) => {
                    const thumb = getProductThumbnail(item.productSlug, item.thumbnailUrl);
                    const itemKey = item.id || item.variantId;
                    return (
                      <div
                        key={itemKey}
                        className="flex gap-3.5 p-3.5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl shadow-xs hover:border-[#1C3F2D]/40 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 bg-[#F3EEE0] rounded-xl overflow-hidden shrink-0 border border-[#E4DDC8] relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info & Controls */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <Link
                                href={`/products/${item.productSlug}`}
                                onClick={() => setIsOpen(false)}
                                className="font-serif font-bold text-[#151F19] text-sm sm:text-base hover:text-[#1C3F2D] transition-colors line-clamp-1"
                              >
                                {item.productName}
                              </Link>
                              <button
                                onClick={() => removeItem(itemKey)}
                                className="text-[#5C6B60] hover:text-red-600 transition-colors p-0.5 text-xs font-mono shrink-0"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="font-mono text-xs text-[#5C6B60] mt-0.5">
                              {item.variantLabel}
                            </p>
                            {item.isSubscription && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#2D7A4D] bg-[#EBF5EE] px-2 py-0.5 rounded border border-[#C5DEC9] font-medium">
                                  <span>🔁</span>
                                  <span>Weekly: {item.subscriptionTrays} {item.subscriptionTrays === 1 ? 'tray' : 'trays'}/wk · {item.subscriptionWeeks} wks</span>
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E4DDC8]/60">
                            <span className="font-mono text-sm font-bold text-[#1C3F2D]">
                              {formatPrice(item.pricePaise * item.quantity)}
                            </span>

                            {/* Stepper */}
                            <div className="flex items-center border border-[#E4DDC8] rounded-lg bg-[#F3EEE0]/50 overflow-hidden shadow-2xs">
                              <button
                                onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                className="p-1 hover:bg-[#E4DDC8] text-[#151F19] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus />
                              </button>
                              <span className="font-mono text-xs font-bold w-6 text-center text-[#151F19]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                disabled={item.quantity >= item.maxStock}
                                className="p-1 hover:bg-[#E4DDC8] text-[#151F19] transition-colors disabled:opacity-30"
                                aria-label="Increase quantity"
                              >
                                <Plus />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Upsell strip inside filled cart */}
                <div className="bg-[#F3EEE0] border-t border-[#E4DDC8] p-4 mt-auto">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C3F2D]">
                      Pair with living trays
                    </p>
                    <span className="font-mono text-[10.5px] text-[#2D7A4D] font-bold">
                      Zero pesticides
                    </span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                    {bestsellers
                      .filter((b) => !items.some((i) => i.productSlug === b.slug))
                      .map((prod) => (
                        <div
                          key={prod.id}
                          className="w-52 shrink-0 bg-[#FFFDF8] rounded-xl p-2.5 border border-[#E4DDC8] shadow-2xs flex items-center gap-2.5"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E4DDC8] bg-[#F3EEE0]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.photo}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-xs font-bold text-[#151F19] truncate">
                              {prod.name}
                            </p>
                            <p className="font-mono text-xs font-bold text-[#1C3F2D]">
                              {formatPrice(prod.pricePaise)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(prod)}
                            className="bg-[#1C3F2D] hover:bg-[#122A1F] text-[#FFFDF8] font-mono text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg shrink-0 transition-colors shadow-2xs"
                          >
                            + ADD
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sticky Bottom Actions */}
            {items.length === 0 ? (
              /* Sticky ALL PRODUCTS button when empty */
              <div className="p-4 bg-[#FFFDF8] border-t border-[#E4DDC8] shadow-md sticky bottom-0 z-20">
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#122A1F] hover:bg-[#1C3F2D] active:scale-[0.99] text-[#FFFDF8] font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] rounded-full shadow-md transition-all text-center"
                >
                  <span>Explore All Trays</span>
                  <span>→</span>
                </Link>
              </div>
            ) : (
              /* Sticky Checkout button when filled */
              <div className="border-t border-[#E4DDC8] p-4 bg-[#FFFDF8] space-y-3 sticky bottom-0 z-20 shadow-md">
                <div className="flex items-center justify-between text-base font-bold text-[#151F19]">
                  <span className="font-serif">Total</span>
                  <span className="font-mono text-[#1C3F2D] text-lg font-bold">
                    {formatPrice(total)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center block py-3.5 bg-[#122A1F] hover:bg-[#1C3F2D] active:scale-[0.99] text-[#FFFDF8] font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] rounded-full shadow-md transition-all"
                >
                  Proceed to Checkout · {formatPrice(total)}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block text-center font-mono text-xs font-semibold text-[#5C6B60] hover:text-[#151F19] transition-colors"
                >
                  View full cart →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

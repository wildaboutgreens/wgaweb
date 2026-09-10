'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { formatPrice } from '@/lib/format';
import { Plus, Minus } from '@/components/icons';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPaise } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = totalPaise();

  if (!mounted) {
    return (
      <div className="bg-[#F3EEE0] text-[#151F19] min-h-screen pt-32 pb-24 text-center">
        <main className="max-w-2xl mx-auto px-4">
          <div className="bg-[#FFFDF8] border border-[#E4DDC8] rounded-3xl p-10 sm:p-14 shadow-sm">
            <span className="text-6xl mb-5 block">🛒</span>
            <p className="font-mono text-sm text-[#5C6B60]">Loading cart...</p>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#F3EEE0] text-[#151F19] min-h-screen pt-32 pb-24">
        <main className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-[#FFFDF8] border border-[#E4DDC8] rounded-3xl p-10 sm:p-14 shadow-sm">
            <span className="text-6xl mb-5 block">🛒</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#151F19] mb-3">
              Your living cart is empty
            </h1>
            <p className="text-sm sm:text-base text-[#5C6B60] mb-8 max-w-md mx-auto leading-relaxed">
              Looks like you haven&apos;t added any living microgreen trays yet. Cut to order on delivery day.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#122A1F] hover:bg-[#1C3F2D] text-[#FFFDF8] font-mono text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all shadow-md hover:-translate-y-0.5"
            >
              Explore Living Trays →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F3EEE0] text-[#151F19] min-h-screen pt-28 pb-20">
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
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
          <span className="text-[#122A1F] font-semibold">Cart</span>
        </nav>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#151F19] mb-1">
            Shopping Cart
          </h1>
          <p className="font-mono text-xs text-[#5C6B60] uppercase tracking-wider">
            🌱 Harvested live on delivery day in Chandigarh, Mohali &amp; Panchkula
          </p>
        </div>

        {/* Item List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#FFFDF8] border border-[#E4DDC8] rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#EDE7D6] to-[#E1DAC3] rounded-xl flex items-center justify-center shrink-0 border border-[#E4DDC8]">
                  <span className="text-3xl">🌿</span>
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="font-serif font-bold text-base sm:text-lg text-[#151F19] hover:text-[#1C3F2D] transition-colors block truncate"
                  >
                    {item.productName}
                  </Link>
                  <p className="font-mono text-xs text-[#5C6B60] uppercase tracking-wide mt-0.5">
                    {item.variantLabel}
                  </p>
                  <p className="font-mono text-xs text-[#1C3F2D] font-semibold mt-1">
                    {formatPrice(item.pricePaise)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E4DDC8]/60">
                {/* Stepper */}
                <div className="flex items-center border border-[#E4DDC8] rounded-xl bg-[#F3EEE0]/50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#151F19] hover:bg-[#E4DDC8]/60 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-[#122A1F]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#151F19] hover:bg-[#E4DDC8]/60 transition-colors disabled:opacity-30"
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
                    className="text-xs text-[#5C6B60] hover:text-[#9C4A5C] transition-colors underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="mt-8 p-6 sm:p-7 bg-[#FFFDF8] border border-[#E4DDC8] rounded-3xl shadow-sm">
          <div className="space-y-3 pb-5 border-b border-[#E4DDC8]">
            <div className="flex justify-between text-sm text-[#5C6B60]">
              <span>Subtotal</span>
              <span className="font-mono font-semibold text-[#151F19]">
                {formatPrice(total)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#5C6B60]">
              <span>Delivery (Tricity Radius)</span>
              <span className="font-mono text-xs text-[#3E8F52] font-bold uppercase">
                Free on harvest morning
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline py-4 mb-6">
            <span className="font-serif font-bold text-lg text-[#151F19]">Total</span>
            <span className="font-mono font-bold text-2xl text-[#122A1F]">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="flex-1 text-center font-mono text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-full border border-[#1C3F2D] text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-white transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              href="/checkout"
              className="flex-1 text-center font-mono text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-full bg-[#122A1F] hover:bg-[#1C3F2D] text-white transition-all shadow-md hover:-translate-y-0.5"
            >
              Proceed to Checkout &rarr;
            </Link>
          </div>

          <p className="font-mono text-[11px] text-[#5C6B60] text-center mt-4">
            🔒 Safe &amp; Secure Checkout via Razorpay
          </p>
        </div>
      </main>
    </div>
  );
}

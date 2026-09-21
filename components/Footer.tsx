'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { isAdminPath } from '@/lib/adminAuth';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'footer' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing! 🌱');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to connect. Please try again.');
    }
  };

  if (isAdminPath(pathname)) {
    return null;
  }

  return (
    <footer className="bg-[#151F19] text-[#FFFDF8]/70 pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div>
            <Link
              href="/"
              className="inline-block mb-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CFFA57] rounded-lg"
              aria-label="Wild About Greens Home"
            >
              <Image
                src="/logo-picture-bg.png"
                alt="Wild About Greens"
                width={188}
                height={42}
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-[#FFFDF8]/60 max-w-[290px] mb-4">
              Living microgreens, cut to order, grown on vertical indoor racks in the Tricity: Chandigarh, Mohali &amp; Panchkula.
            </p>
            <div className="font-mono text-xs text-[#CFFA57] flex items-center gap-1.5">
              <span>📍</span> Delivering to Chandigarh, Mohali &amp; Panchkula
            </div>
          </div>

          {/* Shop column */}
          <div className="space-y-3">
            <h5 className="font-mono text-[11.5px] tracking-wider uppercase text-[#FFFDF8]/40 mb-4 font-semibold">
              Shop
            </h5>
            <Link href="/products" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              All Microgreens
            </Link>
            <Link href="/products?category=bundle" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              Subscriptions &amp; Bundles
            </Link>
            <Link href="/recipe-khazana" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              Recipe Khazana
            </Link>
            <Link href="/cart" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              Your Cart
            </Link>
          </div>

          {/* Learn & Explore column */}
          <div className="space-y-3">
            <h5 className="font-mono text-[11.5px] tracking-wider uppercase text-[#FFFDF8]/40 mb-4 font-semibold">
              Explore
            </h5>
            <Link href="/our-story" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              Our Story
            </Link>
            <Link href="/#why" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              Why Microgreens
            </Link>
            <Link href="/blog" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              Pathshala
            </Link>
            <Link href="/track-order" className="block text-[14.5px] text-[#FFFDF8]/75 hover:text-[#CFFA57] transition-colors">
              Track Order
            </Link>
          </div>

          {/* Stay Rooted Newsletter */}
          <div>
            <h5 className="font-mono text-[11.5px] tracking-wider uppercase text-[#FFFDF8]/40 mb-3 font-semibold">
              Stay Rooted
            </h5>
            <p className="text-[#FFFDF8]/50 text-[13.5px] leading-relaxed mb-3">
              Growing tips, harvest drops, and kitchen pairing ideas. Zero spam.
            </p>
            <form onSubmit={handleSubscribe} className="flex border-b border-white/25 pb-2.5 mt-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-transparent border-none text-white text-sm flex-1 outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="text-[#CFFA57] font-semibold text-sm hover:underline pl-2 disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Join →'}
              </button>
            </form>
            {message && (
              <p
                className={`text-xs mt-2.5 ${
                  status === 'success' ? 'text-[#CFFA57] font-medium' : 'text-red-400'
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-[12.5px] text-[#FFFDF8]/40 gap-3">
          <div>© {new Date().getFullYear()} Wild About Greens · Fresh living harvest in Chandigarh, Mohali &amp; Panchkula</div>
          <div className="flex items-center gap-5">
            <Link href="/blog" className="text-[#FFFDF8]/60 hover:text-[#CFFA57] transition-colors">
              Pathshala
            </Link>
            <Link href="/track-order" className="text-[#FFFDF8]/60 hover:text-[#CFFA57] transition-colors">
              Track Order
            </Link>
            <Link href="/our-story" className="text-[#FFFDF8]/60 hover:text-[#CFFA57] transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

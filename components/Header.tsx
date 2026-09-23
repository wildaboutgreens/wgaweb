'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/cartStore';
import { isAdminPath } from '@/lib/adminAuth';
import { Truck } from '@/components/icons';

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const setIsOpen = useCartStore((s) => s.setIsOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showSolidNav = !isHomepage || isScrolled || mobileMenuOpen;

  if (isAdminPath(pathname)) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidNav
          ? 'bg-[#F3EEE0]/95 backdrop-blur-md py-3 shadow-[0_1px_0_rgba(21,31,25,0.08)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="wrap">
        <nav className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          {/* Nav Left: Mobile 3-line hamburger menu toggle + Desktop left nav links */}
          <div className="flex items-center justify-self-start">
            {/* Mobile Hamburger Toggle (Left on mobile, hidden on desktop) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 -ml-2 rounded-lg transition-colors flex items-center justify-center ${
                showSolidNav ? 'text-[#151F19]' : 'text-[#FFFDF8]'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
                <span
                  className={`w-full h-0.5 rounded-full bg-current transform transition-all duration-300 ease-in-out origin-center ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 rounded-full bg-current transition-all duration-200 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                  }`}
                />
                <span
                  className={`w-full h-0.5 rounded-full bg-current transform transition-all duration-300 ease-in-out origin-center ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>

            {/* Desktop Left Links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/products"
                className={`text-[13px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                  showSolidNav
                    ? 'border-[#1C3F2D] text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-white'
                    : 'border-white/70 text-white hover:bg-white hover:text-[#122A1F] hover:border-white'
                }`}
              >
                Shop Our Products
              </Link>

              <Link
                href="/pathshala"
                className={`text-[13.5px] font-medium tracking-wide transition-colors relative group py-1 ${
                  pathname === '/pathshala' || pathname.startsWith('/pathshala')
                    ? 'font-bold text-[#1C3F2D]'
                    : showSolidNav
                    ? 'text-[#151F19]'
                    : 'text-[#FFFDF8]/90 hover:text-white'
                }`}
              >
                Why Microgreens
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
              </Link>
            </div>
          </div>

          {/* Nav Center Logo (Centered on mobile & desktop) */}
          <Link
            href="/"
            className="flex items-center justify-self-center group py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3F2D] rounded-lg"
            aria-label="Wild About Greens Home"
          >
            <div className="relative h-9 sm:h-10 lg:h-11 w-[155px] sm:w-[179px] lg:w-[197px] transition-transform duration-200 group-hover:scale-[1.02]">
              <Image
                src="/logo-picture-bg.png"
                alt="Wild About Greens"
                width={188}
                height={42}
                priority
                className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-300 ${
                  showSolidNav ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              />
              <Image
                src="/logo-white-bg.png"
                alt="Wild About Greens"
                width={188}
                height={42}
                priority
                className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-300 ${
                  showSolidNav ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            </div>
          </Link>

          {/* Nav Right (Desktop links + Cart + Track Order) */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 justify-self-end">
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/recipe"
                className={`text-[13.5px] font-medium tracking-wide transition-colors relative group py-1 ${
                  pathname === '/recipe' || pathname.startsWith('/recipe')
                    ? 'font-bold text-[#1C3F2D]'
                    : showSolidNav
                    ? 'text-[#151F19]'
                    : 'text-[#FFFDF8]/90 hover:text-white'
                }`}
              >
                Recipe Khazana
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
              </Link>

              <Link
                href="/our-story"
                className={`text-[13.5px] font-medium tracking-wide transition-colors relative group py-1 ${
                  pathname === '/our-story' || pathname.startsWith('/our-story')
                    ? 'font-bold text-[#1C3F2D]'
                    : showSolidNav
                    ? 'text-[#151F19]'
                    : 'text-[#FFFDF8]/90 hover:text-white'
                }`}
              >
                Our Story
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
              </Link>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className={`relative p-1.5 transition-transform duration-200 hover:-translate-y-0.5 ${
                showSolidNav ? 'text-[#151F19]' : 'text-[#FFFDF8]'
              }`}
              aria-label="View Cart"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#CFFA57] text-[#122A1F] text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Track Order Icon (Visible on mobile & desktop) */}
            <Link
              href="/track-order"
              className={`p-1.5 transition-transform duration-200 hover:-translate-y-0.5 ${
                showSolidNav ? 'text-[#151F19]' : 'text-[#FFFDF8]'
              }`}
              aria-label="Track Order"
              title="Track Order"
            >
              <Truck className="w-5 h-5" />
            </Link>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav-panel"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-3 bg-[#F3EEE0] rounded-2xl p-4 shadow-xl border border-[#E4DDC8] space-y-1 text-[#151F19]">
                <Link
                  href="/pathshala"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 font-medium hover:bg-white/50 rounded-lg text-sm transition-colors"
                >
                  Why Microgreens
                </Link>
                <Link
                  href="/recipe"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 font-medium hover:bg-white/50 rounded-lg text-sm transition-colors"
                >
                  Recipe Khazana
                </Link>
                <Link
                  href="/our-story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 font-medium hover:bg-white/50 rounded-lg text-sm transition-colors"
                >
                  Our Story
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 font-medium hover:bg-white/50 rounded-lg text-sm border-t border-[#E4DDC8]/60 mt-1 pt-2.5 transition-colors"
                >
                  Track Order
                </Link>
                <div className="pt-2">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 px-4 rounded-full font-semibold text-xs border border-[#1C3F2D] text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-white transition-all duration-200 shadow-sm active:scale-[0.98]"
                  >
                    Shop Our Products
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/cartStore';
import { isAdminPath } from '@/lib/adminAuth';
import { Truck, X } from '@/components/icons';

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showSolidNav
            ? 'bg-[#F3EEE0]/95 backdrop-blur-md py-3 shadow-[0_1px_0_rgba(21,31,25,0.08)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="wrap">
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            {/* Nav Left: Mobile hamburger menu toggle + Desktop left nav links */}
            <div className="flex items-center justify-self-start">
              {/* Mobile Hamburger Toggle (Left on mobile, hidden on desktop) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 -ml-2 rounded-lg transition-colors flex items-center justify-center ${
                  showSolidNav ? 'text-[#151F19]' : 'text-[#FFFDF8]'
                }`}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
                  <span className="w-full h-0.5 rounded-full bg-current transition-all" />
                  <span className="w-full h-0.5 rounded-full bg-current transition-all" />
                  <span className="w-full h-0.5 rounded-full bg-current transition-all" />
                </div>
              </button>

              {/* Desktop Left Links */}
              <div className="hidden lg:flex items-center gap-6">
                <Link
                  href="/products"
                  className={`text-[13px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] select-none ${
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
                  href="/recipes"
                  className={`text-[13.5px] font-medium tracking-wide transition-colors relative group py-1 ${
                    pathname === '/recipes' || pathname.startsWith('/recipes')
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
        </div>
      </header>

      {/* Mobile Drawer (Left-to-Right sliding drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#122A1F]/50 backdrop-blur-[2px] z-[60] lg:hidden"
              aria-hidden="true"
            />

            {/* Left-to-Right Sliding Drawer Panel */}
            <motion.div
              key="mobile-nav-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 h-full w-[310px] sm:w-[350px] max-w-[85vw] bg-[#F3EEE0] border-r border-[#E4DDC8] shadow-2xl z-[70] flex flex-col justify-between overflow-hidden lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Drawer Top Header: Logo + Close Button */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4DDC8] bg-[#F3EEE0] shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                  aria-label="Wild About Greens Home"
                >
                  <div className="relative h-8 w-[145px]">
                    <Image
                      src="/logo-white-bg.png"
                      alt="Wild About Greens"
                      width={145}
                      height={32}
                      priority
                      className="object-contain"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-[#5C6B60] hover:text-[#151F19] hover:bg-[#E8E1CE] active:bg-[#DCD4BF] rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                <Link
                  href="/pathshala"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-[14.5px] font-medium transition-all ${
                    pathname === '/pathshala' || pathname.startsWith('/pathshala')
                      ? 'bg-[#1C3F2D] text-white font-semibold shadow-xs'
                      : 'text-[#151F19] hover:bg-[#E8E1CE]/80 active:bg-[#E8E1CE]'
                  }`}
                >
                  <span>Why Microgreens</span>
                  <span className="text-xs opacity-60 font-mono">→</span>
                </Link>

                <Link
                  href="/recipes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-[14.5px] font-medium transition-all ${
                    pathname === '/recipes' || pathname.startsWith('/recipes')
                      ? 'bg-[#1C3F2D] text-white font-semibold shadow-xs'
                      : 'text-[#151F19] hover:bg-[#E8E1CE]/80 active:bg-[#E8E1CE]'
                  }`}
                >
                  <span>Recipe Khazana</span>
                  <span className="text-xs opacity-60 font-mono">→</span>
                </Link>

                <Link
                  href="/our-story"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-[14.5px] font-medium transition-all ${
                    pathname === '/our-story' || pathname.startsWith('/our-story')
                      ? 'bg-[#1C3F2D] text-white font-semibold shadow-xs'
                      : 'text-[#151F19] hover:bg-[#E8E1CE]/80 active:bg-[#E8E1CE]'
                  }`}
                >
                  <span>Our Story</span>
                  <span className="text-xs opacity-60 font-mono">→</span>
                </Link>

                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-[14.5px] font-medium transition-all ${
                    pathname === '/track-order' || pathname.startsWith('/track-order')
                      ? 'bg-[#1C3F2D] text-white font-semibold shadow-xs'
                      : 'text-[#151F19] hover:bg-[#E8E1CE]/80 active:bg-[#E8E1CE]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#1C3F2D]" />
                    <span>Track Order</span>
                  </span>
                  <span className="text-xs opacity-60 font-mono">→</span>
                </Link>

                <div className="pt-4 mt-3 border-t border-[#E4DDC8]/70">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-3 px-4 rounded-full font-semibold text-xs border border-[#1C3F2D] bg-[#1C3F2D] text-white hover:bg-[#122A1F] transition-all duration-200 shadow-sm active:scale-[0.98] select-none"
                  >
                    Shop Our Products
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

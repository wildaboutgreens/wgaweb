'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { isAdminPath } from '@/lib/adminAuth';
import { Truck } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const recipesRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const setIsOpen = useCartStore((s) => s.setIsOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close explore and recipes dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
      if (recipesRef.current && !recipesRef.current.contains(e.target as Node)) {
        setRecipesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setExploreOpen(false);
    setRecipesOpen(false);
    setMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${targetId}`);
      }
    }
  };

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
        <nav className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Nav Left */}
          <div className="hidden lg:flex items-center gap-7 justify-self-start">
            {/* Explore Dropdown */}
            <div
              ref={exploreRef}
              className="relative"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                className={`text-[13.5px] font-medium tracking-wide transition-colors flex items-center gap-1.5 py-1 ${
                  showSolidNav ? 'text-[#151F19]' : 'text-[#FFFDF8]/90 hover:text-white'
                }`}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
              >
                <span>Explore</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    exploreOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-0 pt-2 z-50 w-52"
                  >
                    <div className="bg-[#FFFDF8] rounded-2xl p-2 shadow-2xl border border-[#E4DDC8] text-[#151F19] space-y-1">
                      <Link
                        href="/#why"
                        onClick={(e) => handleNavToSection(e, 'why')}
                        className="block px-3.5 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#F3EEE0] transition-colors"
                      >
                        <span className="block font-semibold">Why Microgreens</span>
                        <span className="text-[11px] text-[#5C6B60]">The 10 day biological secret</span>
                      </Link>
                      <Link
                        href="/#goals"
                        onClick={(e) => handleNavToSection(e, 'goals')}
                        className="block px-3.5 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#F3EEE0] transition-colors"
                      >
                        <span className="block font-semibold">Shop by Goal</span>
                        <span className="text-[11px] text-[#5C6B60]">Target your cellular nutrition</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recipes and Pathshala Dropdown */}
            <div
              ref={recipesRef}
              className="relative"
              onMouseEnter={() => setRecipesOpen(true)}
              onMouseLeave={() => setRecipesOpen(false)}
            >
              <button
                onClick={() => setRecipesOpen(!recipesOpen)}
                className={`text-[13.5px] font-medium tracking-wide transition-colors flex items-center gap-1.5 py-1 ${
                  pathname === '/recipe-khazana' || pathname.startsWith('/blog')
                    ? 'font-bold text-[#1C3F2D]'
                    : showSolidNav
                    ? 'text-[#151F19]'
                    : 'text-[#FFFDF8]/90 hover:text-white'
                }`}
                aria-expanded={recipesOpen}
                aria-haspopup="true"
              >
                <span>Recipes and Pathshala</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    recipesOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {recipesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-0 pt-2 z-50 w-60"
                  >
                    <div className="bg-[#FFFDF8] rounded-2xl p-2 shadow-2xl border border-[#E4DDC8] text-[#151F19] space-y-1">
                      <Link
                        href="/recipe-khazana"
                        onClick={() => setRecipesOpen(false)}
                        className="block px-3.5 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#F3EEE0] transition-colors"
                      >
                        <span className="block font-semibold">Enter Recipe Khazana</span>
                        <span className="text-[11px] text-[#5C6B60]">Curated microgreens culinary recipes</span>
                      </Link>
                      <Link
                        href="/blog"
                        onClick={() => setRecipesOpen(false)}
                        className="block px-3.5 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[#F3EEE0] transition-colors"
                      >
                        <span className="block font-semibold">Enter Pathshala</span>
                        <span className="text-[11px] text-[#5C6B60]">Growing guides, science &amp; farm insights</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Nav Center Logo */}
          <Link
            href="/"
            className="flex items-center justify-self-start lg:justify-self-center group py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3F2D] rounded-lg"
            aria-label="Wild About Greens Home"
          >
            <div className="relative h-9 sm:h-10 lg:h-11 w-[161px] sm:w-[179px] lg:w-[197px] transition-transform duration-200 group-hover:scale-[1.02]">
              <Image
                src="/logo-picture-bg.png"
                alt="Wild About Greens"
                width={188}
                height={42}
                priority
                className={`absolute inset-0 w-full h-full object-contain object-left lg:object-center transition-opacity duration-300 ${
                  showSolidNav ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              />
              <Image
                src="/logo-white-bg.png"
                alt="Wild About Greens"
                width={188}
                height={42}
                priority
                className={`absolute inset-0 w-full h-full object-contain object-left lg:object-center transition-opacity duration-300 ${
                  showSolidNav ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            </div>
          </Link>

          {/* Nav Right */}
          <div className="flex items-center gap-5 justify-self-end">
            <div className="hidden lg:flex items-center gap-6">
              {/* Our Story Link */}
              <Link
                href="/our-story"
                className={`text-[13.5px] font-medium tracking-wide transition-colors relative group py-1 ${
                  pathname === '/our-story'
                    ? 'font-bold text-[#1C3F2D]'
                    : showSolidNav
                    ? 'text-[#151F19]'
                    : 'text-[#FFFDF8]/90 hover:text-white'
                }`}
              >
                Our Story
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
              </Link>

              {/* Shop Our Products CTA Button */}
              <Link
                href="/products"
                className={`text-[13px] font-semibold px-4 py-2 rounded-full border transition-all shadow-sm ${
                  showSolidNav
                    ? 'border-[#1C3F2D] text-[#1C3F2D] hover:bg-[#1C3F2D] hover:text-white'
                    : 'border-white/40 text-white hover:bg-white hover:text-[#122A1F]'
                }`}
              >
                Shop Our Products
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

            {/* Track Order Icon with tooltip & aria-label */}
            <Link
              href="/track-order"
              className={`p-1.5 transition-transform duration-200 hover:-translate-y-0.5 hidden sm:block ${
                showSolidNav ? 'text-[#151F19]' : 'text-[#FFFDF8]'
              }`}
              aria-label="Track Order"
              title="Track Order"
            >
              <Truck className="w-5 h-5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-1.5 transition-colors ${
                showSolidNav ? 'text-[#151F19]' : 'text-[#FFFDF8]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 bg-[#F3EEE0] rounded-2xl p-4 shadow-xl border border-[#E4DDC8] space-y-2 text-[#151F19]">
            <div className="font-mono text-[10px] tracking-wider uppercase text-[#5C6B60] px-1 font-semibold">
              Explore
            </div>
            <Link
              href="/#why"
              onClick={(e) => handleNavToSection(e, 'why')}
              className="block py-2 px-2 font-medium hover:bg-white/50 rounded-lg"
            >
              Why Microgreens
            </Link>
            <Link
              href="/#goals"
              onClick={(e) => handleNavToSection(e, 'goals')}
              className="block py-2 px-2 font-medium hover:bg-white/50 rounded-lg border-b border-[#E4DDC8]/60"
            >
              Shop by Goal
            </Link>

            <div className="font-mono text-[10px] tracking-wider uppercase text-[#5C6B60] px-1 font-semibold pt-1">
              Recipes and Pathshala
            </div>
            <Link
              href="/recipe-khazana"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 font-medium hover:bg-white/50 rounded-lg"
            >
              Enter Recipe Khazana
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 font-medium hover:bg-white/50 rounded-lg border-b border-[#E4DDC8]/60"
            >
              Enter Pathshala
            </Link>
            <Link
              href="/our-story"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 font-medium hover:bg-white/50 rounded-lg border-b border-[#E4DDC8]/60"
            >
              Our Story
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 font-medium hover:bg-white/50 rounded-lg border-b border-[#E4DDC8]/60"
            >
              Track Order
            </Link>
            <div className="pt-2">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 px-4 bg-[#1C3F2D] text-white rounded-full font-semibold text-xs"
              >
                Shop Our Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

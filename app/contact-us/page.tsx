'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Utensils,
  Mail,
  Sprout,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
} from '@/components/icons';
import JoinRevolutionSection from '@/components/JoinRevolutionSection';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}


const FAQ_CATEGORIES = [
  {
    id: 'orders',
    label: 'Orders & Delivery',
    faqs: [
      {
        question: 'How fresh are the greens when they arrive?',
        answer:
          'Every tray is cut after you place your order, not pulled from cold storage. Most orders reach you within a few hours of harvest, across Chandigarh, Mohali and Panchkula.',
      },
      {
        question: 'Do you deliver outside the tricity?',
        answer:
          "Not yet. We're starting hyperlocal in Chandigarh, Mohali and Panchkula so every tray reaches you within hours of being cut.",
      },
      {
        question: 'What are your harvest & delivery hours?',
        answer:
          'Morning cut-and-deliver runs take place between 7:00 AM – 1:00 PM daily across all serviceable locations in the Tricity to ensure living greens reach you at peak vitality.',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products & Ingredients',
    faqs: [
      {
        question: 'Are these actually pesticide-free?',
        answer:
          "Yes, grown indoors on soil-free racks, with nothing sprayed at any stage. We grow our living microgreens on sterilized coco-peat with 100% reverse osmosis mineral drinking water and clean air.",
      },
      {
        question: 'How long do they stay fresh at home?',
        answer:
          'Refrigerated and unwashed (at 4°C–7°C), most varieties hold up well for 5–7 days. We include specific care instructions with every delivery tray.',
      },
      {
        question: 'How do I choose the right health goal?',
        answer:
          'Each microgreen variety concentrates specific phytonutrients. Sulforaphane in broccoli supports cellular immunity & longevity, complete plant protein in sunflower powers active fitness recovery, and low GI varieties support metabolic health.',
      },
    ],
  },
  {
    id: 'returns',
    label: 'Returns & Refunds',
    faqs: [
      {
        question: 'What if a tray shows up wilted or damaged?',
        answer:
          "Send us a quick photo on WhatsApp within 12 hours of delivery, and we'll replace the tray on our next delivery run or refund it immediately, no questions asked.",
      },
      {
        question: 'What is your return & exchange notice period?',
        answer:
          'Due to the perishable nature of fresh living greens, return and exchange requests must be submitted within 24 hours of delivery. Approved claims receive an immediate replacement in the next morning harvest or a full refund.',
      },
      {
        question: 'How long does a refund take to process?',
        answer:
          'Approved refund requests are credited back to your original payment method (UPI, credit/debit card, or net banking) within 5–7 business days via Razorpay.',
      },
    ],
  },
] as const;

type FAQCategoryId = (typeof FAQ_CATEGORIES)[number]['id'];

export default function ContactUsPage() {
  // FAQ state
  const [activeFaqCategory, setActiveFaqCategory] = useState<FAQCategoryId>('orders');
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCategorySelect = (newCategory: FAQCategoryId) => {
    if (newCategory === activeFaqCategory) return;
    const currentIndex = FAQ_CATEGORIES.findIndex((c) => c.id === activeFaqCategory);
    const newIndex = FAQ_CATEGORIES.findIndex((c) => c.id === newCategory);
    setSlideDirection(newIndex > currentIndex ? 1 : -1);
    setActiveFaqCategory(newCategory);
    setOpenFaqIndex(0);
  };

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleTurnstileScriptReady = useCallback(() => {
    setTurnstileReady(true);
  }, []);

  const renderTurnstile = useCallback(() => {
    if (!turnstileReady || !siteKey || !window.turnstile || !turnstileContainerRef.current) return;
    if (turnstileWidgetId.current) {
      try {
        window.turnstile.remove(turnstileWidgetId.current);
      } catch {
        /* ignore */
      }
    }
    turnstileContainerRef.current.innerHTML = '';
    turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(null),
      'error-callback': () => setTurnstileToken(null),
      theme: 'light',
    });
  }, [turnstileReady, siteKey]);

  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  const handleRestaurantActionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSubject('b2b');
    const formEl = document.getElementById('contact-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanPhone) {
      setError('Please provide your name and phone number.');
      return;
    }
    if (!cleanMessage || cleanMessage.length < 10) {
      setError('Please provide a message with at least 10 characters.');
      return;
    }
    if (siteKey && !turnstileToken) {
      setError('Please complete the verification check.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiries/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: subject === 'b2b' ? `Culinary Partner / ${cleanName}` : `Customer Inquiry (${subject})`,
          contact_name: cleanName,
          phone: cleanPhone,
          email: cleanEmail || null,
          message: `[Topic: ${subject.toUpperCase()}] ${cleanMessage}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send message. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network connection error. Please try calling or emailing us directly.');
    } finally {
      setSubmitting(false);
      setTurnstileToken(null);
      renderTurnstile();
    }
  };

  const currentCategoryData = FAQ_CATEGORIES.find((cat) => cat.id === activeFaqCategory) || FAQ_CATEGORIES[0];

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={handleTurnstileScriptReady}
        />
      )}

      <div className="bg-[#FAF6EF] min-h-screen text-[#151F19] pt-32 sm:pt-40 pb-20">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#1C3F2D]/5 border border-[#1C3F2D]/15 text-[#1C3F2D] text-xs font-semibold uppercase tracking-wider mb-4">
              We&apos;re Here to Help
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122A1F] tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-[#151F19]/75 text-sm sm:text-base leading-relaxed">
              Have questions about our living microgreens, subscription schedules, or custom restaurant harvests? Reach out and our harvest team will respond promptly.
            </p>
          </div>

          {/* ========================================================
              PART 2A: FAQ SECTION WITH CATEGORY TABS
             ======================================================== */}
          <section className="mb-14 sm:mb-16" aria-label="Frequently Asked Questions">
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1C3F2D]/5 border border-[#1C3F2D]/15 text-[#1C3F2D] text-xs font-semibold uppercase tracking-wider mb-2">
                Help Center
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#122A1F] mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#151F19]/70">
                Quick answers to common questions about our fresh harvests, delivery zones, and quality guarantee.
              </p>
            </div>

            {/* Category Tabs with Left-to-Right Slider Indicator */}
            <div className="flex items-center justify-center mb-8 sm:mb-10">
              <div className="inline-flex p-1.5 rounded-full bg-white border border-[#E4DDC8] shadow-sm gap-1 sm:gap-2 overflow-x-auto max-w-full relative">
                {FAQ_CATEGORIES.map((cat) => {
                  const isActive = activeFaqCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                      className={`relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-0 outline-none select-none ${
                        isActive
                          ? 'text-white'
                          : 'text-[#151F19]/70 hover:text-[#1C3F2D]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          className="absolute inset-0 bg-[#1C3F2D] rounded-full shadow-sm"
                        />
                      )}
                      <span className="relative z-10">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FAQ Accordions with Horizontal Slider Animation */}
            <div className="max-w-3xl mx-auto overflow-hidden">
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={activeFaqCategory}
                  custom={slideDirection}
                  initial={{ opacity: 0, x: slideDirection * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -slideDirection * 40 }}
                  transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-3"
                >
                  {currentCategoryData.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={faq.question}
                        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? 'border-[#1C3F2D]/35 shadow-[0_8px_24px_rgba(21,31,25,0.06)]'
                            : 'border-[#E4DDC8] shadow-[0_2px_12px_rgba(21,31,25,0.02)] hover:border-[#1C3F2D]/30'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                          style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                          className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-4 cursor-pointer group focus:outline-none focus:ring-0 focus-visible:outline-none outline-none select-none active:outline-none"
                        >
                          <span
                            className={`font-serif font-bold text-base sm:text-lg transition-colors duration-200 ${
                              isOpen ? 'text-[#1C3F2D]' : 'text-[#122A1F] group-hover:text-[#1C3F2D]'
                            }`}
                          >
                            {faq.question}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                              isOpen
                                ? 'bg-[#1C3F2D] text-white shadow-sm'
                                : 'bg-[#FAF6EF] text-[#1C3F2D] border border-[#E4DDC8] group-hover:border-[#1C3F2D]'
                            }`}
                          >
                            {isOpen ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 12h14" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-[14.5px] leading-relaxed text-[#151F19]/75 border-t border-[#FAF6EF]">
                                <p>{faq.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* ========================================================
              PART 2B: ACTION CARDS GRID (3-4 EXISTING DESTINATIONS)
             ======================================================== */}
          <section className="mb-14 sm:mb-16" aria-label="Quick Action Destinations">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: For Restaurants */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 shadow-[0_8px_30px_rgba(21,31,25,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(21,31,25,0.08)] hover:-translate-y-1 transition-all duration-200 group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center mb-4 text-[#1C3F2D] group-hover:bg-[#1C3F2D] group-hover:text-[#CFFA57] transition-colors">
                    <Utensils className="w-6 h-6 text-current" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1.5">
                    For Restaurants
                  </h3>
                  <p className="text-xs leading-relaxed text-[#151F19]/70 mb-4">
                    Standing weekly harvest orders, bulk culinary trays, and custom microgreen pairings for chefs.
                  </p>
                </div>
                <a
                  href="#contact-form"
                  onClick={handleRestaurantActionClick}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C3F2D] group-hover:underline group-hover:text-[#122A1F]"
                >
                  <span>Wholesale Inquiry</span>
                  <span>→</span>
                </a>
              </div>

              {/* Card 2: Track an order */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 shadow-[0_8px_30px_rgba(21,31,25,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(21,31,25,0.08)] hover:-translate-y-1 transition-all duration-200 group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center mb-4 text-[#1C3F2D] group-hover:bg-[#1C3F2D] group-hover:text-[#CFFA57] transition-colors">
                    <Truck className="w-6 h-6 text-current" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1.5">
                    Track an order
                  </h3>
                  <p className="text-xs leading-relaxed text-[#151F19]/70 mb-4">
                    Check real-time morning harvest status and live delivery dispatch across Chandigarh, Mohali &amp; Panchkula.
                  </p>
                </div>
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C3F2D] group-hover:underline group-hover:text-[#122A1F]"
                >
                  <span>Open Tracker</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Card 3: Still have questions? */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 shadow-[0_8px_30px_rgba(21,31,25,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(21,31,25,0.08)] hover:-translate-y-1 transition-all duration-200 group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center mb-4 text-[#1C3F2D] group-hover:bg-[#1C3F2D] group-hover:text-[#CFFA57] transition-colors">
                    <Mail className="w-6 h-6 text-current" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1.5">
                    Still have questions?
                  </h3>
                  <p className="text-xs leading-relaxed text-[#151F19]/70 mb-4">
                    Our harvest dispatch team is ready to help with subscription changes or special requests.
                  </p>
                </div>
                <a
                  href="mailto:support@example.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C3F2D] group-hover:underline group-hover:text-[#122A1F]"
                >
                  <span>Email Support</span>
                  <span>→</span>
                </a>
              </div>

              {/* Card 4: Our Story */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 shadow-[0_8px_30px_rgba(21,31,25,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(21,31,25,0.08)] hover:-translate-y-1 transition-all duration-200 group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center mb-4 text-[#1C3F2D] group-hover:bg-[#1C3F2D] group-hover:text-[#CFFA57] transition-colors">
                    <Sprout className="w-6 h-6 text-current" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1.5">
                    Our Story
                  </h3>
                  <p className="text-xs leading-relaxed text-[#151F19]/70 mb-4">
                    Discover how we grow pesticide-free living microgreens on vertical racks with 100% mineral RO water.
                  </p>
                </div>
                <Link
                  href="/our-story"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C3F2D] group-hover:underline group-hover:text-[#122A1F]"
                >
                  <span>Read Story</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ========================================================
              PART 2C: DIRECT CONTACT SECTION & FORM
             ======================================================== */}
          <div id="contact-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 scroll-mt-28">
            {/* Left Contact Cards Column */}
            <div className="lg:col-span-5 space-y-4">
              {/* Card 1: Direct Support */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(21,31,25,0.04)]">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center mb-4 text-[#1C3F2D]">
                  <Phone className="w-5 h-5 text-current" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1">
                  Phone &amp; WhatsApp
                </h3>
                <p className="text-xs text-[#151F19]/65 mb-3">
                  Direct line to our harvest dispatch manager for orders, queries, and quick delivery updates.
                </p>
                <a
                  href="tel:+919800000000"
                  className="inline-block font-mono text-base font-bold text-[#1C3F2D] hover:underline"
                >
                  +91 98XXXXXXXX
                </a>
              </div>

              {/* Card 2: Email */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(21,31,25,0.04)]">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center mb-4 text-[#1C3F2D]">
                  <Mail className="w-5 h-5 text-current" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1">
                  Email Support
                </h3>
                <p className="text-xs text-[#151F19]/65 mb-3">
                  For general inquiries, subscription adjustments, or chef collaboration decks.
                </p>
                <a
                  href="mailto:support@example.com"
                  className="font-medium text-sm text-[#1C3F2D] hover:underline"
                >
                  support@example.com
                </a>
              </div>

              {/* Card 3: Harvest & Delivery Hours */}
              <div className="bg-white rounded-3xl border border-[#E4DDC8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(21,31,25,0.04)]">
                <div className="w-10 h-10 rounded-2xl bg-[#1C3F2D]/10 flex items-center justify-center mb-4 text-[#1C3F2D]">
                  <Clock className="w-5 h-5 text-current" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#122A1F] mb-1">
                  Harvest &amp; Delivery Window
                </h3>
                <p className="text-xs text-[#151F19]/65 leading-relaxed">
                  Morning cut-and-deliver runs: <strong className="text-[#122A1F]">7:00 AM – 1:00 PM</strong> daily across Chandigarh, Mohali &amp; Panchkula.
                </p>
              </div>

              {/* Quick links to self-service portals */}
              <div className="bg-[#1C3F2D]/5 rounded-3xl border border-[#1C3F2D]/15 p-6 space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#1C3F2D] tracking-wider">
                  Self-Service Shortcuts
                </h4>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/track-order"
                    className="flex items-center justify-between text-xs font-semibold text-[#122A1F] hover:text-[#1C3F2D] bg-white px-3.5 py-2.5 rounded-xl border border-[#E4DDC8] transition-colors"
                  >
                    <span>Track Your Live Order</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/shipping-and-returns"
                    className="flex items-center justify-between text-xs font-semibold text-[#122A1F] hover:text-[#1C3F2D] bg-white px-3.5 py-2.5 rounded-xl border border-[#E4DDC8] transition-colors"
                  >
                    <span>Raise Return or Exchange Ticket</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4DDC8] shadow-[0_12px_40px_rgba(21,31,25,0.06)] p-6 sm:p-10">
              {submitted ? (
                <div className="py-12 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-current" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#122A1F] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-[#151F19]/75 max-w-md mx-auto mb-6">
                    Thank you for reaching out. A member of our harvest team will get back to you within a few business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#1C3F2D] text-white text-xs font-semibold hover:bg-[#122A1F] transition-all shadow-sm cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 pb-4 border-b border-[#E4DDC8]/60">
                    <h2 className="font-serif text-2xl font-bold text-[#122A1F] mb-1">
                      Send a Direct Message
                    </h2>
                    <p className="text-xs text-[#151F19]/60">
                      Fill out the form below and we will get back to you via WhatsApp or email.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Your Name"
                        required
                        className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactPhone" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contactPhone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 98XXXXXXXX"
                          required
                          className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="contactEmail" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                          Email Address
                        </label>
                        <input
                          id="contactEmail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@example.com"
                          className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contactSubject" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Inquiry Topic <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contactSubject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all cursor-pointer"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Existing Order Question</option>
                        <option value="subscription">Subscription Delivery Assistance</option>
                        <option value="b2b">Chef / Restaurant Supply Partnership</option>
                        <option value="feedback">Feedback &amp; Suggestions</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contactMessage" className="block text-xs font-bold uppercase tracking-wider text-[#1C3F2D] mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="contactMessage"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message or inquiry here..."
                        required
                        className="w-full px-4 py-3 bg-[#FAF6EF]/50 border border-[#E4DDC8] rounded-xl text-sm text-[#151F19] placeholder:text-[#151F19]/40 focus:bg-white focus:border-[#1C3F2D] focus:ring-2 focus:ring-[#1C3F2D]/15 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Turnstile Container */}
                    {siteKey && (
                      <div className="flex justify-center pt-2">
                        <div ref={turnstileContainerRef} />
                      </div>
                    )}

                    {error && (
                      <div className="p-3.5 bg-red-50/90 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || (!!siteKey && !turnstileToken)}
                      className="w-full bg-[#1C3F2D] hover:bg-[#122A1F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer mt-2"
                    >
                      {submitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <JoinRevolutionSection />
    </>
  );
}

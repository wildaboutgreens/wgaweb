'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import SprigDefs, { Sprig } from '@/components/SprigDefs';
import StoryModal from '@/components/StoryModal';
import WhyMicrogreensChart from '@/components/WhyMicrogreensChart';
import { Instagram, ShoppingBag, Subscription } from '@/components/icons';

export interface ContentPin {
  id: string;
  icon: string | null;
  title: string;
  description: string | null;
  display_order: number;
}

export interface GoalPin {
  id: string;
  group_key?: string;
  icon: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
}

export interface FeaturedRecipe {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
}

interface HomePageClientProps {
  content: Record<string, string>;
  dbPins: ContentPin[];
  recipeCount?: number;
  featuredRecipes?: FeaturedRecipe[];
  initialGoalPins?: GoalPin[];
}

const DEFAULT_GOAL_PINS: GoalPin[] = [
  {
    id: 'goal-1',
    icon: 'Immunity',
    title: 'Boost Immunity',
    description: 'Broccoli & radish blends',
    image_url: 'https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products?category=immunity',
    display_order: 1,
  },
  {
    id: 'goal-2',
    icon: 'Weight',
    title: 'Weight Management',
    description: 'Low cal, high fibre trays',
    image_url: 'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products?category=weight',
    display_order: 2,
  },
  {
    id: 'goal-3',
    icon: 'Kids',
    title: 'Kids Nutrition',
    description: 'Mild, sweet pea shoots',
    image_url: 'https://plus.unsplash.com/premium_photo-1666184891926-68f52da26f15?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products?category=kids',
    display_order: 3,
  },
  {
    id: 'goal-4',
    icon: 'Fitness',
    title: 'Fitness & Recovery',
    description: 'Protein forward sunflower',
    image_url: 'https://images.unsplash.com/photo-1610622930110-3c076902312a?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products?category=fitness',
    display_order: 4,
  },
  {
    id: 'goal-5',
    icon: 'Low GI',
    title: 'Diabetes Friendly',
    description: 'Low glycemic greens',
    image_url: 'https://plus.unsplash.com/premium_photo-1699976106481-02baab9811da?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products?category=low-gi',
    display_order: 5,
  },
  {
    id: 'goal-6',
    icon: 'Heart',
    title: 'Heart Health',
    description: 'Potassium rich mixes',
    image_url: 'https://images.unsplash.com/photo-1647613233075-e0d5546b0f22?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products?category=heart',
    display_order: 6,
  },
  {
    id: 'goal-7',
    icon: 'Aging',
    title: 'Healthy Aging',
    description: 'Antioxidant dense trays',
    image_url: 'https://plus.unsplash.com/premium_photo-1675368982408-ee5a9e0fab6c?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products?category=aging',
    display_order: 7,
  },
  {
    id: 'goal-8',
    icon: 'All',
    title: 'All Trays',
    description: 'Every variety we grow',
    image_url: 'https://plus.unsplash.com/premium_photo-1661635029307-2183e966e5a8?fm=jpg&q=80&w=700&auto=format&fit=crop',
    link_url: '/products',
    display_order: 8,
  },
];

const GOAL_BG_COLORS = [
  'bg-[#DCF5A8]',
  'bg-[#FFE0B2]',
  'bg-[#FFC9C0]',
  'bg-[#BEE3F5]',
  'bg-[#E9D8F2]',
  'bg-[#F7D9D3]',
  'bg-[#D6EDD9]',
  'bg-[#EDE1C7]',
];

function isVideoMedia(url?: string | null): boolean {
  if (!url) return false;
  return url.includes('/video/upload/') || /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

export default function HomePageClient({
  content,
  dbPins,
  recipeCount = 0,
  featuredRecipes = [],
  initialGoalPins = [],
}: HomePageClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const [goalPins, setGoalPins] = useState<GoalPin[]>(
    initialGoalPins.length > 0 ? initialGoalPins : []
  );

  useEffect(() => {
    fetch('/api/pins/homepage_shop_by_goal')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGoalPins(data);
        }
      })
      .catch((err) => console.error('Error fetching goal pins:', err));
  }, []);

  const activeGoals = goalPins.length > 0 ? goalPins : DEFAULT_GOAL_PINS;

  // Hero background: support video or image
  const heroVideo =
    (content.hero_video_url && isVideoMedia(content.hero_video_url) ? content.hero_video_url : null) ||
    (content.hero_image_url && isVideoMedia(content.hero_image_url) ? content.hero_image_url : null);
  const heroImage =
    (!isVideoMedia(content.hero_image_url) && content.hero_image_url) ||
    'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=85&w=2400&auto=format&fit=crop';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  // Part 1: Hero entrance animations (staggered on page load)
  const heroContainerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.12,
            delayChildren: 0.08,
          },
    },
  };

  const heroItemVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          },
    },
  };

  // Part 2: Below-hero scroll entrance animations (whileInView)
  const scrollContainerVariants = (stagger = 0.08, delay = 0): Variants => ({
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: stagger,
            delayChildren: delay,
          },
    },
  });

  const scrollItemVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.48,
            ease: [0.22, 1, 0.36, 1],
          },
    },
  };

  // Default fallback pins if none in DB
  const defaultPins = [
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M16 3l11 4v9c0 7-4.6 11.4-11 13.9C9.6 27.4 5 23 5 16V7l11-4z" />
          <path d="M16 21c0-4 2.5-6.5 6-7-.4 4.4-2.6 6.6-6 7zM16 21c0-4-2.5-6.5-6-7 .4 4.4 2.6 6.6 6 7zM16 21v3" />
        </svg>
      ),
      label: 'Soil Free &\nChemical Free',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M18 3L7 18h7l-2 11 11-15h-7l2-11z" />
        </svg>
      ),
      label: '40X Nutrient\nDensity*',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M20.5 5.5c4.5 4.5 3.5 12-1.5 17s-12.5 6-17 1.5c-1.5-1.5-.5-6 2.5-11S16 1 20.5 5.5z" />
          <path d="M6 26C10 20 15 13 21 8" />
        </svg>
      ),
      label: 'Non GMO\nSeeds',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M16 3C11 10.5 8 14.7 8 19a8 8 0 0016 0c0-4.3-3-8.5-8-16z" />
          <path d="M12 19.5a4 4 0 004 4" />
        </svg>
      ),
      label: 'Mineral\nRO Water',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M4 12h24l-2.5 15a2 2 0 01-2 1.7H8.5a2 2 0 01-2-1.7L4 12z" />
          <path d="M9 17.5c2-1.5 4-1.5 6 0s4 1.5 6 0M9 22.5c2-1.5 4-1.5 6 0s4 1.5 6 0" />
          <path d="M16 12V8M16 8c0-2 1.5-3.5 3.5-3.5M16 8c0-2-1.5-3.5-3.5-3.5" />
        </svg>
      ),
      label: 'Coco Peat\nBed',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M13 4h5v4h-5zM11.5 8h8l2 5v14a2 2 0 01-2 2h-8a2 2 0 01-2-2V13l2-5z" />
          <path d="M19.5 10h4.5l3-3" />
          <path d="M4 4l24 24" />
        </svg>
      ),
      label: 'Zero\nPesticide',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="7" cy="24" r="3.5" />
          <circle cx="7" cy="8" r="3.5" />
          <path d="M9.6 10.4L27 27M9.6 21.6L27 5M14 16l4.5 4.3" />
        </svg>
      ),
      label: 'Cut to\nOrder',
    },
  ];

  return (
    <main className="overflow-x-hidden">
      <SprigDefs />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden text-[#FFFDF8] pt-28 pb-16">
        {/* Background photo or video */}
        {heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 z-0 w-full h-full object-cover"
            poster={heroImage}
          >
            <source src={heroVideo} />
          </video>
        ) : (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center animate-kenburns"
            style={{
              backgroundImage: `url('${heroImage}')`,
            }}
          />
        )}
        {/* Scrim overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,24,16,.62) 0%, rgba(10,24,16,.46) 45%, rgba(10,24,16,.72) 100%)',
          }}
        />

        {/* Hero Content with Staggered Entrance */}
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="wrap relative z-10 max-w-4xl mx-auto"
        >
          {/* 1. Badge Pill */}
          <motion.div
            variants={heroItemVariants}
            className="inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] uppercase text-[#FFFDF8] border border-[#FFFDF8]/40 px-4 py-2 rounded-full mb-7 backdrop-blur-sm shadow-sm"
          >
            <span>🌱</span>
            <span>
              {content.hero_eyebrow || 'Grown Locally · Chandigarh · Mohali · Panchkula'}
            </span>
          </motion.div>

          {/* 2. Main Headline */}
          <motion.h1
            variants={heroItemVariants}
            className="font-display uppercase text-6xl sm:text-8xl md:text-9xl lg:text-[116px] leading-[0.92] mb-6 drop-shadow-[0_6px_35px_rgba(0,0,0,0.35)]"
          >
            {content.hero_title || (
              <>
                Let&apos;s Eat
                <br />
                Well.
              </>
            )}
          </motion.h1>

          {/* 3. Subtext line */}
          <motion.p
            variants={heroItemVariants}
            className="font-mono text-xs sm:text-sm tracking-[0.06em] uppercase text-[#FFFDF8]/90 max-w-xl mx-auto mb-9 leading-relaxed font-medium"
          >
            {content.hero_subtitle || (
              <>
                Non GMO seeds. Mineral water. Coco peat. Clean air.
                <br />
                100% pesticide free. Absolutely nothing else.
              </>
            )}
          </motion.p>

          {/* 4. "The Short Story of Why We Exist" button */}
          <motion.div variants={heroItemVariants}>
            <StoryModal />
          </motion.div>

          {/* 5. Star-rating / Trust-text line */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-col items-center gap-1.5 mt-7"
          >
            <div className="text-white text-sm tracking-[3px]">★★★★★</div>
            <div className="font-mono text-[11.5px] tracking-[0.09em] uppercase text-[#FFFDF8]/85 font-medium text-center max-w-lg">
              {content.hero_trust_text ||
                'Join over 1000+ families eating microgreens across Chandigarh · Mohali · Panchkula'}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator with gentle up-down looping bob */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          animate={
            shouldReduceMotion
              ? { opacity: 1, y: 0 }
              : {
                  opacity: [0.5, 0.9, 0.5],
                  y: [0, 6, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.6,
                }
          }
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#FFFDF8]/60 font-mono text-[10px] tracking-[0.16em] uppercase pointer-events-none"
        >
          <span>Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#FFFDF8]/60 to-transparent" />
        </motion.div>
      </section>

      {/* ================= ICON STRIP (Scroll-triggered) ================= */}
      <section className="relative bg-[#F3EEE0] py-10 border-b border-[#E4DDC8]/60 overflow-hidden">
        <Sprig rotation="-16deg" width="38px" style={{ left: '2%', top: '10%' }} />
        <Sprig rotation="20deg" width="56px" delay="1.4s" style={{ right: '2.5%', bottom: '10%' }} />

        <div className="wrap">
          <motion.div
            variants={scrollContainerVariants(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap justify-center gap-7 sm:gap-9 text-[#1C3F2D]"
          >
            {dbPins.length > 0
              ? dbPins.map((pin) => (
                  <motion.div
                    key={pin.id}
                    variants={scrollItemVariants}
                    className="flex flex-col items-center gap-2.5 text-center w-28 group hover:-translate-y-1 transition-transform duration-300"
                  >
                    <span className="text-2xl">{pin.icon || '🌱'}</span>
                    <span className="font-mono text-[9.5px] tracking-[0.06em] uppercase leading-tight text-[#122A1F] font-semibold">
                      {pin.title}
                    </span>
                  </motion.div>
                ))
              : defaultPins.map((pin, i) => (
                  <motion.div
                    key={i}
                    variants={scrollItemVariants}
                    className="flex flex-col items-center gap-2.5 text-center w-28 group hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="text-[#1C3F2D] group-hover:scale-110 transition-transform duration-200">
                      {pin.icon}
                    </div>
                    <span className="font-mono text-[9.5px] tracking-[0.06em] uppercase leading-tight text-[#122A1F] font-medium whitespace-pre-line">
                      {pin.label}
                    </span>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* ================= WHY MICROGREENS (Scroll-triggered) ================= */}
      <section className="relative bg-[#FFFDF8] py-20 overflow-hidden scroll-mt-14" id="why">
        <Sprig rotation="24deg" width="76px" style={{ right: '1%', top: '8%' }} />
        <Sprig rotation="-22deg" width="44px" delay="2s" style={{ left: '1.5%', bottom: '12%' }} />

        <div className="wrap">
          <motion.div
            variants={scrollItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-xl mb-10"
          >
            <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-[#5C6B60] inline-flex items-center gap-2 bg-[#E4DDC8] px-3.5 py-1.5 rounded-full mb-3">
              {content.why_badge || '🔬 The Actual Data'}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#151F19] leading-tight">
              {content.why_title || (
                <>
                  Why <em className="italic text-[#1C3F2D] font-normal">microgreens?</em>
                </>
              )}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            {/* Left Copy Column with Staggered children */}
            <motion.div
              variants={scrollContainerVariants(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="text-[#3B4A40]"
            >
              <motion.h3
                variants={scrollItemVariants}
                className="text-3xl sm:text-4xl leading-tight mb-5 tracking-tight"
              >
                {content.why_headline || (
                  <>
                    <span className="font-display uppercase text-[#151F19]">Day 10</span> beats{' '}
                    <span className="font-serif italic font-normal text-[#1C3F2D]">day 30.</span>
                  </>
                )}
              </motion.h3>
              <motion.p
                variants={scrollItemVariants}
                className="text-base text-[#3B4A40] leading-relaxed mb-4"
              >
                {content.why_body_1 ||
                  "Nutrients don't wait around. The moment a vegetable is cut, its vitamin content starts to fall, sitting in trucks, warehouses, and shop shelves for days before it reaches you."}
              </motion.p>
              <motion.blockquote
                variants={scrollItemVariants}
                className="font-serif italic text-lg sm:text-xl text-[#122A1F] leading-snug my-5 pl-4 border-l-4 border-[#CFFA57]"
              >
                {content.why_quote ||
                  'We harvest at the exact peak of density, ten days in, then it comes straight to your door, still breathing.'}
              </motion.blockquote>
              <motion.p
                variants={scrollItemVariants}
                className="text-base text-[#3B4A40] leading-relaxed mb-8"
              >
                {content.why_body_2 ||
                  'A single tray of broccoli microgreens can carry many times the vitamin C and antioxidant load of the mature vegetable, by weight.*'}
              </motion.p>
              <motion.div variants={scrollItemVariants}>
                <Link
                  href="/blog"
                  className="btn-primary-mockup btn-amber-mockup font-bold text-sm shadow-md inline-block"
                >
                  {content.why_cta_text || 'Pathshala →'}
                </Link>
              </motion.div>
            </motion.div>

            {/* Interactive SVG Chart & Optional Visual Media */}
            <motion.div
              variants={scrollItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-6"
            >
              {content.why_image && (
                <div className="rounded-2xl overflow-hidden shadow-md border border-[#E4DDC8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.why_image}
                    alt={content.why_image_alt || 'Why Microgreens'}
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                </div>
              )}
              <WhyMicrogreensChart />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ================= SHOP BY HEALTH GOAL (Scroll-triggered) ================= */}
      <section className="relative bg-[#E4DDC8] py-20 overflow-hidden scroll-mt-14" id="goals">
        <Sprig rotation="18deg" width="56px" style={{ left: '1%', top: '6%' }} />
        <Sprig rotation="-28deg" width="84px" delay="1.1s" style={{ right: '1.5%', bottom: '6%' }} />

        <div className="wrap">
          <motion.div
            variants={scrollItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-xl mb-10"
          >
            <span className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-[#5C6B60] inline-flex items-center gap-2 bg-[#FFFDF8]/70 px-3.5 py-1.5 rounded-full mb-3">
              {content.goals_badge || '🎯 Find Your Fit'}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#151F19] leading-tight">
              {content.goals_title || (
                <>
                  Shop by <em className="italic text-[#1C3F2D] font-normal">health goal.</em>
                </>
              )}
            </h2>
          </motion.div>

          <motion.div
            variants={scrollContainerVariants(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6"
          >
            {activeGoals.map((pin, index) => {
              const bgColor = GOAL_BG_COLORS[index % GOAL_BG_COLORS.length];

              return (
                <motion.div key={pin.id || index} variants={scrollItemVariants}>
                  <Link href={pin.link_url || '/products'} className="group block">
                    <div
                      className={`relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl ${bgColor}`}
                    >
                      {pin.icon && (
                        <span className="absolute top-3 left-3 z-10 bg-[#FFFDF8]/95 text-[#122A1F] font-mono text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                          {pin.icon}
                        </span>
                      )}
                      {pin.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pin.image_url}
                          alt={pin.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-4xl">🌱</span>
                      )}
                    </div>
                    <div className="pt-3.5 px-1">
                      <h4 className="font-serif text-base font-semibold text-[#122A1F] mb-1">
                        {pin.title}
                      </h4>
                      {pin.description && (
                        <p className="text-xs text-[#5C6B60]">{pin.description}</p>
                      )}
                      <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#1C3F2D] group-hover:gap-2.5 transition-all">
                        Shop →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= RECIPES (Scroll-triggered) ================= */}
      <section
        className="relative bg-cover bg-center py-24 text-[#FFFDF8] overflow-hidden"
        id="recipe"
        style={{
          backgroundImage: `url('${
            content.recipes_bg_image ||
            'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?fm=jpg&q=88&w=2400&auto=format&fit=crop'
          }')`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(10,24,16,.72) 0%, rgba(10,24,16,.42) 52%, rgba(10,24,16,.08) 100%)',
          }}
        />

        <div className="wrap relative z-10">
          <motion.div
            variants={scrollItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-lg mb-10 text-shadow"
          >
            <span className="font-mono text-[11.5px] tracking-[0.13em] uppercase text-[#CFFA57] block mb-3 font-semibold">
              {content.recipes_badge || '🍽️ Recipe Khazana'}
            </span>
            <p className="font-serif italic text-lg sm:text-xl text-[#FFFDF8]/95 mb-3">
              {content.recipes_subtitle || 'Good for you. Easy for you. Delicious for you.'}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium leading-tight">
              {content.recipes_title ? (
                content.recipes_title
              ) : (
                <>
                  Sneak greens
                  <br />
                  into your <em className="italic text-[#CFFA57]">meals.</em>
                </>
              )}
            </h2>
          </motion.div>

          <motion.div
            variants={scrollContainerVariants(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mb-10"
          >
            {featuredRecipes && featuredRecipes.length > 0 ? (
              featuredRecipes.map((recipe, idx) => (
                <motion.div
                  key={recipe.id}
                  variants={scrollItemVariants}
                  className="pl-4 border-l-2 border-[#CFFA57]/60 hover:border-[#CFFA57] hover:translate-x-1 transition-all duration-300"
                >
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B7E23F] block mb-2 font-semibold">
                    Recipe {String(idx + 1).padStart(2, '0')}{recipeCount > 0 ? ` / ${recipeCount}` : ''}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-1.5">
                    <Link href={`/blog/${recipe.slug}`} className="hover:text-[#CFFA57] transition-colors">
                      {recipe.title}
                    </Link>
                  </h3>
                  {recipe.excerpt && (
                    <p className="text-sm text-[#FFFDF8]/90 leading-relaxed">
                      {recipe.excerpt}
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <>
                <motion.div
                  variants={scrollItemVariants}
                  className="pl-4 border-l-2 border-[#CFFA57]/60 hover:border-[#CFFA57] hover:translate-x-1 transition-all duration-300"
                >
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B7E23F] block mb-2 font-semibold">
                    Recipe 01{recipeCount > 0 ? ` / ${recipeCount}` : ''}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-1.5">
                    Microgreens Avocado Toast
                  </h3>
                  <div className="font-mono text-[11px] tracking-wide uppercase text-[#B7E23F] mb-3 font-medium">
                    5 mins · Easy · Serves 1
                  </div>
                  <p className="text-sm text-[#FFFDF8]/90 leading-relaxed">
                    A power packed start to your day with healthy fats, fiber and a burst of nutrition.
                    Sunflower shoots, chilled curd, roasted cumin, mint.
                  </p>
                </motion.div>

                <motion.div
                  variants={scrollItemVariants}
                  className="pl-4 border-l-2 border-[#CFFA57]/60 hover:border-[#CFFA57] hover:translate-x-1 transition-all duration-300"
                >
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#B7E23F] block mb-2 font-semibold">
                    Recipe 02{recipeCount > 0 ? ` / ${recipeCount}` : ''}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-1.5">
                    Microgreens Poha
                  </h3>
                  <div className="font-mono text-[11px] tracking-wide uppercase text-[#B7E23F] mb-3 font-medium">
                    15 mins · Easy · Serves 2
                  </div>
                  <p className="text-sm text-[#FFFDF8]/90 leading-relaxed">
                    The tricity breakfast you already make, quietly upgraded. Temper mustard seeds, curry
                    leaves and peanuts, fold through soaked poha with turmeric, then kill the heat and stir in
                    a fistful of radish and pea shoots so they stay raw, crunchy and intact.
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>

          <motion.div
            variants={scrollItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/recipe-khazana"
              className="btn-primary-mockup font-bold text-sm shadow-lg hover:scale-105 transition-transform inline-block"
            >
              {content.recipes_cta_text || 'The Recipe Khazana →'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= LONG STORY (Scroll-triggered) ================= */}
      <section className="relative bg-[#E4DDC8] py-20 text-center overflow-hidden" id="story">
        <Sprig rotation="-18deg" width="66px" style={{ left: '3.5%', top: '12%' }} />
        <Sprig rotation="22deg" width="40px" delay="1.7s" style={{ right: '4.5%', top: '18%' }} />
        <Sprig rotation="8deg" width="30px" delay="0.6s" style={{ right: '11%', bottom: '5%' }} />

        <div className="wrap">
          <motion.div
            variants={scrollContainerVariants(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <motion.div
              variants={scrollItemVariants}
              className="font-display uppercase text-5xl sm:text-7xl md:text-8xl text-[#1C3F2D] mb-6 leading-none"
            >
              {content.story_eyebrow || 'The Long Story'}
            </motion.div>
            <motion.h3
              variants={scrollItemVariants}
              className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl text-[#151F19] max-w-xl mx-auto mb-6 leading-snug"
            >
              {content.story_title ? (
                content.story_title
              ) : (
                <>
                  From a small idea
                  <br />
                  to a <em className="italic text-[#1C3F2D] font-normal">healthier tomorrow.</em>
                </>
              )}
            </motion.h3>
            <motion.div
              variants={scrollItemVariants}
              className="max-w-xl mx-auto text-[#3B4A40] text-base leading-relaxed space-y-3.5 mb-8"
            >
              {content.story_body ? (
                content.story_body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    We started with a simple question: why is it so hard to eat truly fresh, nutrient dense
                    greens in our busy urban lives?
                  </p>
                  <p>
                    That question led us to microgreens. To science. To clean growing. To long nights
                    perfecting our system. And today, to your table.
                  </p>
                  <p>
                    We&apos;re not just growing greens. We&apos;re growing a movement for real food, real
                    nutrition, and real change.
                  </p>
                </>
              )}
            </motion.div>
            <motion.div variants={scrollItemVariants}>
              <Link
                href="/our-story"
                className="btn-primary-mockup btn-dark-mockup font-bold text-sm shadow-md hover:scale-105 transition-transform inline-block"
              >
                {content.story_cta_text || 'Our Story →'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FINAL CTA (Scroll-triggered) ================= */}
      <section className="relative bg-[#122A1F] py-20 text-[#FFFDF8] text-center overflow-hidden">
        <Sprig rotation="-16deg" width="48px" style={{ left: '5%', top: '16%' }} />
        <Sprig rotation="26deg" width="70px" delay="1.3s" style={{ right: '6%', bottom: '12%' }} />

        <motion.div
          variants={scrollContainerVariants(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="wrap relative z-10 max-w-2xl mx-auto"
        >
          <motion.h2
            variants={scrollItemVariants}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 leading-tight"
          >
            {content.final_cta_title ? (
              content.final_cta_title
            ) : (
              <>
                Join the revolution.
                <br />
                <em className="italic text-[#CFFA57] font-normal">Live healthily.</em>
              </>
            )}
          </motion.h2>
          <motion.p
            variants={scrollItemVariants}
            className="text-[#FFFDF8]/70 text-base sm:text-lg mb-8 max-w-md mx-auto"
          >
            {content.final_cta_subtitle || 'One tray at a time, grown ten minutes from your kitchen.'}
          </motion.p>
          <motion.div variants={scrollItemVariants} className="flex justify-center gap-3.5 flex-wrap">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#FFFDF8]/30 px-5 py-3 rounded-full text-sm font-semibold text-white hover:bg-[#CFFA57] hover:border-[#CFFA57] hover:text-[#151F19] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Instagram className="w-4 h-4 shrink-0" />
              <span>Instagram</span>
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-[#FFFDF8]/30 px-5 py-3 rounded-full text-sm font-semibold text-white hover:bg-[#CFFA57] hover:border-[#CFFA57] hover:text-[#151F19] hover:-translate-y-0.5 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Shop Products</span>
            </Link>
            <Link
              href="/products?category=bundle"
              className="inline-flex items-center gap-2 border border-[#FFFDF8]/30 px-5 py-3 rounded-full text-sm font-semibold text-white hover:bg-[#CFFA57] hover:border-[#CFFA57] hover:text-[#151F19] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Subscription className="w-4 h-4 shrink-0" />
              <span>Subscriptions</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

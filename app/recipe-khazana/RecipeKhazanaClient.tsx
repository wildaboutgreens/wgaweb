'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface RecipeItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt_text?: string | null;
  recipe_categories: string[] | null;
  published_at: string | null;
}

interface RecipeKhazanaClientProps {
  recipes: RecipeItem[];
  categories: string[];
  content: Record<string, string>;
}

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80';

export default function RecipeKhazanaClient({
  recipes,
  categories,
  content,
}: RecipeKhazanaClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const heroImage = content.hero_image_url?.trim() || DEFAULT_HERO_IMAGE;
  const heroTitle = content.hero_title?.trim() || 'All Recipes';
  const heroSubtitle =
    content.hero_subtitle?.trim() ||
    'Explore delicious and nutritious recipes crafted with fresh, living microgreens.';

  const filteredRecipes = recipes.filter((recipe) => {
    if (activeCategory === 'all') return true;
    if (!recipe.recipe_categories || !Array.isArray(recipe.recipe_categories)) return false;
    return recipe.recipe_categories.some(
      (cat) => cat.toLowerCase().trim() === activeCategory.toLowerCase().trim()
    );
  });

  return (
    <div className="bg-[#FAF7F2] text-[#151F19] min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-sm aspect-[21/9] sm:aspect-[24/9] min-h-[220px] max-h-[360px] bg-[#1C3F2D]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 lg:p-12">
            <span className="font-mono text-xs font-bold text-[#CFFA57] uppercase tracking-widest block mb-2">
              Culinary Inspiration · Fresh Living Microgreens
            </span>
            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-white">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-white/80 text-xs sm:text-sm max-w-2xl mt-2 font-normal">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Outlined rectangular pills, no count) */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 sm:px-5 py-2 rounded-md font-mono text-xs sm:text-[13px] font-semibold uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[#1C3F2D] text-white border border-[#1C3F2D] shadow-xs'
                : 'bg-transparent text-[#151F19] hover:text-[#1C3F2D] hover:bg-[#1C3F2D]/5 border border-[#151F19]/30'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-md font-mono text-xs sm:text-[13px] font-semibold uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#1C3F2D] text-white border border-[#1C3F2D] shadow-xs'
                  : 'bg-transparent text-[#151F19] hover:text-[#1C3F2D] hover:bg-[#1C3F2D]/5 border border-[#151F19]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E4DDC8] p-8 max-w-xl mx-auto shadow-sm">
            <span className="text-5xl mb-4 block">🍳</span>
            <h2 className="font-serif text-xl font-bold text-[#151F19] mb-2">
              No recipes found in this category
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6B60] mb-6 leading-relaxed">
              Try selecting another category or view all recipes.
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="inline-block px-6 py-2.5 rounded-md border border-[#1C3F2D] bg-[#1C3F2D] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#122A1F] transition-all"
            >
              View All Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {filteredRecipes.map((post) => {
              const postCategories = (post.recipe_categories || []).filter(
                (c) => c && c.trim().length > 0
              );
              const categoriesText = postCategories.length > 0 ? postCategories.join(', ') : null;

              return (
                <article key={post.id} className="group flex flex-col">
                  {/* Photo (Clean, no frame, no shadow, no badge overlay) */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#E4DDC8]/30 relative"
                  >
                    {post.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image_url}
                        alt={post.cover_image_alt_text || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE7D6] to-[#E1DAC3] text-4xl opacity-50">
                        🍳
                      </div>
                    )}
                  </Link>

                  {/* Title & Found in line below photo */}
                  <div className="mt-3.5 flex flex-col">
                    <h2 className="font-sans font-bold text-base sm:text-lg uppercase tracking-wider text-[#1C3F2D] group-hover:text-[#122A1F] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {categoriesText && (
                      <p className="text-xs sm:text-[13px] text-[#5C6B60] font-normal tracking-wide mt-1">
                        Found in {categoriesText} Recipes
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

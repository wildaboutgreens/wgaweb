import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSQL } from '@/lib/db';
import RecipeShareButtons from '@/components/RecipeShareButtons';

export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt_text?: string | null;
  post_type: 'article' | 'recipe';
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  recipe_ingredients?: string[] | null;
  recipe_method_steps?: string[] | null;
  recipe_prep_time?: string | null;
  recipe_cook_time?: string | null;
  recipe_difficulty?: string | null;
  recipe_serves?: string | null;
  recipe_categories?: string[] | null;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT
        id, slug, title, content, excerpt, cover_image_url, cover_image_alt_text,
        post_type, is_published, published_at, created_at,
        recipe_ingredients, recipe_method_steps, recipe_prep_time,
        recipe_cook_time, recipe_difficulty, recipe_serves, recipe_categories
      FROM blog_posts
      WHERE slug = ${slug} AND is_published = true
      LIMIT 1
    `;
    if (posts.length === 0) return null;
    return posts[0] as unknown as BlogPost;
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Post Not Found · Wild About Greens' };
  }
  const isRecipe = post.post_type === 'recipe';
  const siteTitle = isRecipe
    ? `${post.title} · Recipe Khazana`
    : `${post.title} · Wild About Greens`;

  return {
    title: siteTitle,
    description: post.excerpt || (isRecipe ? `Recipe for ${post.title}` : 'Read the latest insights from Wild About Greens.'),
    openGraph: {
      title: siteTitle,
      description: post.excerpt || (isRecipe ? `Recipe for ${post.title}` : 'Read the latest insights from Wild About Greens.'),
      type: 'article',
      ...(post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: post.excerpt || (isRecipe ? `Recipe for ${post.title}` : 'Read the latest insights from Wild About Greens.'),
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }

  // BRANCH 1: RECIPE DETAIL PAGE
  if (post.post_type === 'recipe') {
    const rawIngredients = post.recipe_ingredients;
    const ingredients: string[] = Array.isArray(rawIngredients)
      ? rawIngredients
      : typeof rawIngredients === 'string'
      ? JSON.parse(rawIngredients || '[]')
      : [];

    const rawSteps = post.recipe_method_steps;
    const methodSteps: string[] = Array.isArray(rawSteps)
      ? rawSteps
      : typeof rawSteps === 'string'
      ? JSON.parse(rawSteps || '[]')
      : [];

    const categories: string[] = Array.isArray(post.recipe_categories)
      ? post.recipe_categories.filter((c) => c && c.trim().length > 0)
      : [];

    const hasMeta =
      post.recipe_prep_time?.trim() ||
      post.recipe_cook_time?.trim() ||
      post.recipe_difficulty?.trim() ||
      post.recipe_serves?.trim();

    return (
      <div className="bg-[#FAF7F2] text-[#151F19] min-h-screen pt-24 pb-24">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Back Link */}
          <div className="mb-6">
            <Link
              href="/recipe-khazana"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#5C6B60] hover:text-[#1C3F2D] transition-colors"
            >
              <span>&larr;</span> Back to All Recipes
            </Link>
          </div>

          {/* Recipe Header */}
          <header className="mb-8">
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 rounded-full bg-white border border-[#E4DDC8] text-[#1C3F2D] font-mono text-[11px] font-bold uppercase tracking-wider"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-[#151F19] leading-tight mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-base sm:text-lg text-[#5C6B60] leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-[#E4DDC8]/30 shadow-sm border border-[#E4DDC8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image_url}
                alt={post.cover_image_alt_text || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 2-Column Recipe Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Ingredients Card */}
            <aside className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E4DDC8] lg:sticky lg:top-24">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C3F2D] mb-6 tracking-tight">
                  You Will Need
                </h2>
                {ingredients.length > 0 ? (
                  <ul className="space-y-3.5 text-sm sm:text-base text-[#151F19]">
                    {ingredients.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 leading-relaxed">
                        <span className="text-[#3E8F52] text-xl font-bold leading-none select-none mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#5C6B60] italic">
                    Ingredients will be listed here soon.
                  </p>
                )}
              </div>
            </aside>

            {/* Right Column: Introduction, Method, Metadata, Share */}
            <div className="lg:col-span-8 space-y-8 bg-white/60 lg:bg-transparent rounded-3xl p-6 lg:p-0 border border-[#E4DDC8] lg:border-0">
              {/* Metadata Row (Prep / Cook / Difficulty / Serves) */}
              {hasMeta && (
                <div className="flex flex-wrap items-center gap-3 py-4 border-y border-[#E4DDC8]">
                  {post.recipe_prep_time?.trim() && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E4DDC8] text-xs font-mono text-[#151F19]">
                      <span className="text-sm">⏱️</span>
                      <span className="text-[#5C6B60]">Prep:</span>
                      <span className="font-bold">{post.recipe_prep_time.trim()}</span>
                    </div>
                  )}
                  {post.recipe_cook_time?.trim() && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E4DDC8] text-xs font-mono text-[#151F19]">
                      <span className="text-sm">🍳</span>
                      <span className="text-[#5C6B60]">Cook:</span>
                      <span className="font-bold">{post.recipe_cook_time.trim()}</span>
                    </div>
                  )}
                  {post.recipe_difficulty?.trim() && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E4DDC8] text-xs font-mono text-[#151F19]">
                      <span className="text-sm">📊</span>
                      <span className="text-[#5C6B60]">Difficulty:</span>
                      <span className="font-bold">{post.recipe_difficulty.trim()}</span>
                    </div>
                  )}
                  {post.recipe_serves?.trim() && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E4DDC8] text-xs font-mono text-[#151F19]">
                      <span className="text-sm">👥</span>
                      <span className="text-[#5C6B60]">Serves:</span>
                      <span className="font-bold">{post.recipe_serves.trim()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Introduction */}
              {post.content && (
                <section>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#151F19] mb-3">
                    Introduction
                  </h3>
                  <div className="text-[#5C6B60] text-base leading-relaxed space-y-4">
                    {post.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Method */}
              {methodSteps.length > 0 && (
                <section className="pt-6 border-t border-[#E4DDC8]">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#151F19] mb-6">
                    Method
                  </h3>
                  <ol className="space-y-6">
                    {methodSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1C3F2D] text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                          {idx + 1}
                        </span>
                        <div className="text-[#151F19] text-base leading-relaxed pt-0.5 whitespace-pre-line">
                          {step}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Share Recipe */}
              <div className="pt-6 border-t border-[#E4DDC8] flex items-center justify-between">
                <RecipeShareButtons title={post.title} coverImageUrl={post.cover_image_url} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // BRANCH 2: ARTICLE DETAIL PAGE (Unchanged layout)
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Navigation */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors"
        >
          <span>&larr;</span> Back to All Articles
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        {post.published_at && (
          <p className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wider mb-3">
            Published on{' '}
            {new Date(post.published_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed font-normal border-l-4 border-green-600 pl-4 py-1 italic bg-green-50/50 rounded-r-lg">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-gray-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.cover_image_alt_text || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-green max-w-none text-gray-800 leading-relaxed space-y-4 text-base sm:text-lg mb-16">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl text-white p-8 text-center shadow-md">
        <h3 className="text-2xl font-bold mb-2">Ready to try living microgreens?</h3>
        <p className="text-green-100 text-sm sm:text-base max-w-md mx-auto mb-6">
          Freshly grown and delivered directly to your doorstep in Chandigarh, Mohali, and Panchkula.
        </p>
        <Link
          href="/products"
          className="btn-primary bg-white text-green-800 hover:bg-green-50 px-6 py-3 font-bold"
        >
          Explore Fresh Products
        </Link>
      </div>
    </main>
  );
}

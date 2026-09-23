import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSQL } from '@/lib/db';
import RecipeShareButtons from '@/components/RecipeShareButtons';
import JoinRevolutionSection from '@/components/JoinRevolutionSection';

export const dynamic = 'force-dynamic';

interface ArticlePost {
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
  recipe_categories?: string[] | null;
}

async function getArticle(slug: string): Promise<ArticlePost | null> {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT
        id, slug, title, content, excerpt, cover_image_url, cover_image_alt_text,
        post_type, is_published, published_at, created_at, recipe_categories
      FROM blog_posts
      WHERE slug = ${slug} AND is_published = true AND post_type = 'article'
      LIMIT 1
    `;
    if (posts.length === 0) return null;
    return posts[0] as unknown as ArticlePost;
  } catch (err) {
    console.error('Error fetching article:', err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getArticle(params.slug);
  if (!post) {
    return { title: 'Article Not Found · Wild About Greens' };
  }
  const siteTitle = `${post.title} · Wild About Greens`;

  return {
    title: siteTitle,
    description: post.excerpt || 'Read the latest insights from Wild About Greens.',
    openGraph: {
      title: siteTitle,
      description: post.excerpt || 'Read the latest insights from Wild About Greens.',
      type: 'article',
      ...(post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: post.excerpt || 'Read the latest insights from Wild About Greens.',
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  };
}

const DEFAULT_ARTICLE_BANNER = 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=2000&q=85';

export default async function PathshalaDetailPage({ params }: { params: { slug: string } }) {
  const post = await getArticle(params.slug);
  if (!post) {
    notFound();
  }

  const categories = Array.isArray(post.recipe_categories)
    ? post.recipe_categories.filter((c) => c && c.trim().length > 0)
    : [];

  const bannerImage = post.cover_image_url?.trim() || DEFAULT_ARTICLE_BANNER;

  return (
    <div className="bg-white min-h-screen pt-[64px] lg:pt-[70px]">
      {/* 1. Full-Width Edge-to-Edge Panoramic Hero Banner */}
      <div className="w-full relative overflow-hidden bg-[#EAE8E1] h-[220px] sm:h-[300px] md:h-[380px] lg:h-[440px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerImage}
          alt={post.cover_image_alt_text || post.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Page Title Band: Clean, centered uppercase with spacious tracking */}
      <div className="bg-white py-10 sm:py-14 px-4 sm:px-6 text-center">
        <h1 className="font-sans font-bold text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#111111] uppercase tracking-[0.2em] leading-snug max-w-4xl mx-auto">
          {post.title}
        </h1>
      </div>

      {/* 3. Main Content Section: Soft off-white background with 2-column layout */}
      <div className="bg-[#F5F6F7] text-[#151F19] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Floating Summary Card */}
            <aside className="md:col-span-5 lg:col-span-4">
              <div className="bg-white rounded-lg p-7 sm:p-9 shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-gray-100">
                <h2 className="font-handwriting text-3xl sm:text-4xl text-[#7BAE42] mb-1 leading-tight">
                  At A Glance
                </h2>
                <div className="border-b border-[#E8E8E8] pb-1 mb-5 w-full" />

                {post.excerpt && (
                  <p className="text-sm sm:text-[14.5px] text-[#222222] leading-relaxed mb-5">
                    {post.excerpt}
                  </p>
                )}

                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs sm:text-sm text-[#555555]">
                  {post.published_at && (
                    <div>
                      <span className="font-bold text-[#111111]">Published:</span>{' '}
                      <span>
                        {new Date(post.published_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  {categories.length > 0 && (
                    <div>
                      <span className="font-bold text-[#111111]">Topic:</span>{' '}
                      <span>{categories.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Right Column: Full Article Content, Share, Back Button */}
            <div className="md:col-span-7 lg:col-span-8">
              {/* Article Content */}
              <div className="text-sm sm:text-base leading-relaxed text-[#333333] space-y-4 mb-8">
                {post.content.split('\n\n').map((para, idx) => (
                  <p key={idx} className="whitespace-pre-line leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              {/* Divider Line */}
              <div className="border-t border-[#E5E5E5] pt-6 mb-6">
                {/* Share Article */}
                <RecipeShareButtons
                  title={post.title}
                  coverImageUrl={post.cover_image_url}
                  label="Share article"
                />
              </div>

              {/* Back to Pathshala Button: Slate-Grey Pill */}
              <div className="mt-8">
                <Link
                  href="/pathshala"
                  className="inline-flex items-center gap-2.5 bg-[#5D707F] hover:bg-[#4E5F6D] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] px-6 py-3 rounded-full transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 8l-4 4 4 4" />
                  </svg>
                  <span>BACK TO PATHSHALA</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Join The Revolution Section */}
      <JoinRevolutionSection />
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Nutrition Journal · Wild About Greens',
  description: 'Explore microgreens growing guides, science backed wellness tips, and farm updates from Wild About Greens.',
  openGraph: {
    title: 'Blog & Nutrition Journal · Wild About Greens',
    description: 'Explore microgreens growing guides, science backed wellness tips, and farm updates from Wild About Greens.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Nutrition Journal · Wild About Greens',
    description: 'Microgreens growing guides, wellness tips, and farm updates.',
  },
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt_text?: string | null;
  post_type: string;
  published_at: string | null;
}

const DEFAULT_BLOG_HERO = 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1600&q=80';

async function getArticles(): Promise<BlogPost[]> {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT id, slug, title, excerpt, cover_image_url, cover_image_alt_text, post_type, published_at
      FROM blog_posts
      WHERE is_published = true AND post_type = 'article'
      ORDER BY published_at DESC NULLS LAST, created_at DESC
    `;
    return posts as unknown as BlogPost[];
  } catch (err) {
    console.error('Error fetching blog articles:', err);
    return [];
  }
}

async function getContentMap(): Promise<Record<string, string>> {
  try {
    const sql = getSQL();
    const blocks = await sql`
      SELECT key, value
      FROM content_blocks
      WHERE page = 'blog'
    `;
    const map: Record<string, string> = {};
    for (const b of blocks as unknown as { key: string; value: string }[]) {
      map[b.key] = b.value;
    }
    return map;
  } catch (err) {
    console.error('Error fetching blog content blocks:', err);
    return {};
  }
}

export default async function BlogPage() {
  const [posts, content] = await Promise.all([getArticles(), getContentMap()]);

  const heroImage = content.hero_image_url?.trim() || DEFAULT_BLOG_HERO;
  const heroTitle = content.hero_title?.trim() || 'The Greens Journal';
  const heroSubtitle =
    content.hero_subtitle?.trim() ||
    'Nutritional deep dives, cellular antioxidant science, and insights from our vertical indoor farm in the Tricity.';

  return (
    <div className="bg-[#FAF7F2] text-[#151F19] min-h-screen pt-24 pb-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner (Same chrome as Recipe Khazana) */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-sm aspect-[21/9] sm:aspect-[24/9] min-h-[220px] max-h-[360px] bg-[#1C3F2D]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 lg:p-12">
            <span className="font-mono text-xs font-bold text-[#CFFA57] uppercase tracking-widest block mb-2">
              Living Nutrition · Science · Farm Journal
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

        {/* Post Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E4DDC8] p-8 max-w-xl mx-auto shadow-sm">
            <span className="text-5xl mb-4 block">📰</span>
            <h2 className="font-serif text-xl font-bold text-[#151F19] mb-2">No Articles Published Yet</h2>
            <p className="text-xs sm:text-sm text-[#5C6B60] mb-6 leading-relaxed">
              We are crafting articles on sulforaphane research, living food vitality, and clean urban farming. Check back soon!
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 rounded-full bg-[#1C3F2D] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#122A1F] transition-all"
            >
              Shop Fresh Microgreens
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-[#E4DDC8] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Cover Image */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="block aspect-[16/11] bg-[#E4DDC8]/30 overflow-hidden relative"
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
                      🌿
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#1C3F2D] font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    📰 Article
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Uppercase Title */}
                    <h2 className="font-sans font-bold text-lg sm:text-xl uppercase tracking-wider text-[#151F19] group-hover:text-[#1C3F2D] transition-colors line-clamp-2 leading-snug mb-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-[#5C6B60]/90 line-clamp-3 leading-relaxed mt-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E4DDC8]/60 flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-mono text-xs font-bold text-[#1C3F2D] hover:text-[#3E8F52] uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      Read Article &rarr;
                    </Link>
                    {post.published_at && (
                      <span className="text-[11px] text-[#5C6B60] font-mono">
                        {new Date(post.published_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

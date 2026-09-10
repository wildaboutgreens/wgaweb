import Link from 'next/link';
import type { Metadata } from 'next';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Recipe Khazana · Wild About Greens',
  description: 'Fresh, vibrant, and effortless culinary ideas to snip living microgreens into your daily meals.',
};

interface RecipePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  post_type: string;
  published_at: string | null;
}

async function getRecipes(): Promise<RecipePost[]> {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT id, slug, title, excerpt, cover_image_url, post_type, published_at
      FROM blog_posts
      WHERE is_published = true AND post_type = 'recipe'
      ORDER BY published_at DESC
    `;
    return posts as unknown as RecipePost[];
  } catch (err) {
    console.error('Error fetching recipes:', err);
    return [];
  }
}

export default async function RecipeKhazanaPage() {
  const recipes = await getRecipes();

  return (
    <div className="bg-[#F3EEE0] text-[#151F19] min-h-screen pt-28 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs font-bold text-[#1C3F2D] uppercase tracking-widest block mb-2.5">
            🍳 CULINARY INSPIRATION · 10 MINUTE CREATIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#151F19] mb-4">
            Recipe Khazana
          </h1>
          <p className="text-[#5C6B60] text-sm sm:text-base leading-relaxed">
            Simple, vibrant ways to snip living microgreens right from your countertop tray into everyday meals: from sourdough toasts and morning eggs to warm dals and rich bowls.
          </p>
        </div>

        {/* Recipe Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-16 bg-white/70 rounded-3xl border border-[#E4DDC8] p-8 max-w-xl mx-auto shadow-sm">
            <span className="text-5xl mb-4 block">🍳</span>
            <h2 className="font-serif text-xl font-bold text-[#151F19] mb-2">Recipes Coming Right Up!</h2>
            <p className="text-xs sm:text-sm text-[#5C6B60] mb-6 leading-relaxed">
              We are curating chef crafted pairings, daily breakfast toasts, and fresh tricity salad dressings. Check back very soon!
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 rounded-full bg-[#1C3F2D] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#122A1F] transition-all"
            >
              Explore Living Trays
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-[#E4DDC8] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Cover Image */}
                <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] bg-[#E4DDC8]/40 overflow-hidden relative">
                  {post.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE7D6] to-[#E1DAC3] text-4xl opacity-50">
                      🍳
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#CFFA57] text-[#122A1F] font-mono text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    🍳 Recipe
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {post.published_at && (
                      <p className="font-mono text-xs font-semibold text-[#1C3F2D] uppercase tracking-wider mb-2">
                        {new Date(post.published_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    <h2 className="font-serif text-xl font-bold text-[#151F19] mb-3 group-hover:text-[#1C3F2D] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-[#5C6B60] line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-[#E4DDC8]/60">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-mono text-xs font-bold text-[#1C3F2D] hover:text-[#3E8F52] uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      View Recipe &rarr;
                    </Link>
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

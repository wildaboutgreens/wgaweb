import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT id, slug, title, content, excerpt, cover_image_url, is_published, published_at, created_at
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
    return { title: 'Post Not Found — Wild About Greens' };
  }
  return {
    title: `${post.title} — Wild About Greens`,
    description: post.excerpt || 'Read the latest insights and guides from Wild About Greens.',
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }

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
            alt={post.title}
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

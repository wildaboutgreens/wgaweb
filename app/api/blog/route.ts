import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/blog — public: published posts only
// Supports optional ?type=article | recipe
export async function GET(request: NextRequest) {
  try {
    const sql = getSQL();
    const type = request.nextUrl.searchParams.get('type');

    let posts;
    if (type) {
      posts = await sql`
        SELECT id, slug, title, excerpt, cover_image_url, post_type, published_at
        FROM blog_posts
        WHERE is_published = true AND post_type = ${type}
        ORDER BY published_at DESC
      `;
    } else {
      posts = await sql`
        SELECT id, slug, title, excerpt, cover_image_url, post_type, published_at
        FROM blog_posts
        WHERE is_published = true
        ORDER BY published_at DESC
      `;
    }
    return NextResponse.json(posts);
  } catch (error: unknown) {
    console.error('blog list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

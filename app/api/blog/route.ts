import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/blog — public: published posts only
export async function GET() {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT id, slug, title, excerpt, cover_image_url, published_at
      FROM blog_posts
      WHERE is_published = true
      ORDER BY published_at DESC
    `;
    return NextResponse.json(posts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

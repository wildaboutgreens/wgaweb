import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

// GET /api/blog/[slug] — public: single published post
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const sql = getSQL();
    const { slug } = params;

    const posts = await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${slug} AND is_published = true
      LIMIT 1
    `;

    if (posts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(posts[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

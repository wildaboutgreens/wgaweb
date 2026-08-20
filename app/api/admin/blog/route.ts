import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

// GET /api/admin/blog — list ALL posts (published and drafts)
export async function GET() {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT * FROM blog_posts
      ORDER BY created_at DESC
    `;
    return NextResponse.json(posts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/blog — create a post
export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body = await request.json();
    const { slug, title, excerpt, content, cover_image_url, is_published } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'slug, title, and content are required' },
        { status: 400 }
      );
    }

    const publishedAt = is_published ? new Date().toISOString() : null;

    const result = await sql`
      INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url, is_published, published_at)
      VALUES (${slug}, ${title}, ${excerpt || null}, ${content}, ${cover_image_url || null}, ${is_published || false}, ${publishedAt})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: unknown) {
    console.error('admin create blog post error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'A post with that slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

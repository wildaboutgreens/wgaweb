import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

// PUT /api/admin/blog/[id] — update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();
    const { slug, title, excerpt, content, cover_image_url, is_published } = body;


    if (is_published === true) {
      // Set published_at only if not already set
      const result = await sql`
        UPDATE blog_posts
        SET
          slug            = COALESCE(${slug ?? null}, slug),
          title           = COALESCE(${title ?? null}, title),
          excerpt         = COALESCE(${excerpt ?? null}, excerpt),
          content         = COALESCE(${content ?? null}, content),
          cover_image_url = COALESCE(${cover_image_url ?? null}, cover_image_url),
          is_published    = true,
          published_at    = COALESCE(published_at, now())
        WHERE id = ${id}
        RETURNING *
      `;
      if (result.length === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(result[0]);
    } else {
      const result = await sql`
        UPDATE blog_posts
        SET
          slug            = COALESCE(${slug ?? null}, slug),
          title           = COALESCE(${title ?? null}, title),
          excerpt         = COALESCE(${excerpt ?? null}, excerpt),
          content         = COALESCE(${content ?? null}, content),
          cover_image_url = COALESCE(${cover_image_url ?? null}, cover_image_url),
          is_published    = COALESCE(${is_published ?? null}, is_published)
        WHERE id = ${id}
        RETURNING *
      `;
      if (result.length === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(result[0]);
    }
  } catch (error: unknown) {
    console.error('admin update blog post error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id] — hard delete a post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;

    const result = await sql`
      DELETE FROM blog_posts
      WHERE id = ${id}
      RETURNING id, title
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted', post: result[0] });
  } catch (error: unknown) {
    console.error('admin delete blog post error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

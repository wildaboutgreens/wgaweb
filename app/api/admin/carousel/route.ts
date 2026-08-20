import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

// GET /api/admin/carousel — all slides including inactive
export async function GET() {
  try {
    const sql = getSQL();
    const slides = await sql`
      SELECT * FROM carousel_slides
      ORDER BY display_order ASC
    `;
    return NextResponse.json(slides);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/carousel — create a slide
export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body = await request.json();
    const { image_url, link_url, display_order, is_active } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO carousel_slides (image_url, link_url, display_order, is_active)
      VALUES (${image_url}, ${link_url || null}, ${display_order ?? 0}, ${is_active ?? true})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: unknown) {
    console.error('admin create carousel slide error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

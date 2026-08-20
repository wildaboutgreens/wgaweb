import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

// PUT /api/admin/carousel/[id] — update a slide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();
    const { image_url, link_url, display_order, is_active } = body;

    const result = await sql`
      UPDATE carousel_slides
      SET
        image_url     = COALESCE(${image_url ?? null}, image_url),
        link_url      = COALESCE(${link_url ?? null}, link_url),
        display_order = COALESCE(${display_order ?? null}, display_order),
        is_active     = COALESCE(${is_active ?? null}, is_active)
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.error('admin update carousel slide error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/carousel/[id] — delete a slide
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;

    const result = await sql`
      DELETE FROM carousel_slides
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Slide deleted' });
  } catch (error: unknown) {
    console.error('admin delete carousel slide error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

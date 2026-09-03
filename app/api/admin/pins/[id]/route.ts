import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

// PUT /api/admin/pins/[id] — update a pin
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();
    const { group_key, icon, title, description, display_order, is_active } = body;

    const result = await sql`
      UPDATE content_pins
      SET
        group_key     = COALESCE(${group_key ?? null}, group_key),
        icon          = COALESCE(${icon ?? null}, icon),
        title         = COALESCE(${title ?? null}, title),
        description   = COALESCE(${description ?? null}, description),
        display_order = COALESCE(${display_order ?? null}, display_order),
        is_active     = COALESCE(${is_active ?? null}, is_active)
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.error('admin update pin error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/pins/[id] — delete a pin
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;

    const result = await sql`
      DELETE FROM content_pins
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('admin delete pin error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

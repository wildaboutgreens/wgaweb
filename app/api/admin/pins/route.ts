import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

// GET /api/admin/pins — list all pins, optionally filter by ?group_key=
export async function GET(request: NextRequest) {
  try {
    const sql = getSQL();
    const groupKey = request.nextUrl.searchParams.get('group_key');

    let pins;
    if (groupKey) {
      pins = await sql`
        SELECT * FROM content_pins
        WHERE group_key = ${groupKey}
        ORDER BY display_order ASC
      `;
    } else {
      pins = await sql`
        SELECT * FROM content_pins
        ORDER BY group_key ASC, display_order ASC
      `;
    }

    return NextResponse.json(pins);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/pins — create a pin
export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body = await request.json();
    const { group_key, icon, title, description, display_order, is_active } = body;

    if (!group_key || !title) {
      return NextResponse.json(
        { error: 'group_key and title are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO content_pins (group_key, icon, title, description, display_order, is_active)
      VALUES (${group_key}, ${icon || null}, ${title}, ${description || null}, ${display_order ?? 0}, ${is_active ?? true})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: unknown) {
    console.error('admin create pin error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

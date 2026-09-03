import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/pins/[groupKey] — returns active pins for a group, ordered by display_order
export async function GET(
  _request: NextRequest,
  { params }: { params: { groupKey: string } }
) {
  try {
    const sql = getSQL();
    const { groupKey } = params;

    const pins = await sql`
      SELECT id, group_key, icon, title, description, display_order
      FROM content_pins
      WHERE group_key = ${groupKey}
        AND is_active = true
      ORDER BY display_order ASC
    `;

    return NextResponse.json(pins);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

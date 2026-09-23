import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT id, slug, title, tag, icon, subtitle, popup_title, popup_description, image_url, display_order
      FROM health_goals_content
      WHERE is_active = true
      ORDER BY display_order ASC
    `;
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error('get public health-goals error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

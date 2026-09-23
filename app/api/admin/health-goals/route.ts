import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT id, slug, title, tag, icon, subtitle, popup_title, popup_description, image_url, display_order, is_active, created_at, updated_at
      FROM health_goals_content
      ORDER BY display_order ASC
    `;
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error('admin get health-goals error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/carousel — public: active slides sorted by display_order
export async function GET() {
  try {
    const sql = getSQL();
    const slides = await sql`
      SELECT id, image_url, link_url, display_order
      FROM carousel_slides
      WHERE is_active = true
      ORDER BY display_order ASC
    `;
    return NextResponse.json(slides);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

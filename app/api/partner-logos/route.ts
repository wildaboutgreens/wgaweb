import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getSQL();
    const logos = await sql`
      SELECT id, name, logo_url, website_url, display_order, is_active
      FROM partner_logos
      WHERE is_active = true
      ORDER BY display_order ASC, created_at ASC
    `;
    return NextResponse.json(logos);
  } catch (error: unknown) {
    console.error('fetch partner logos error:', error);
    return NextResponse.json([]);
  }
}

import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getSQL();

    // Check if the section is enabled on the homepage
    const enabledRow = await sql`
      SELECT value FROM content_blocks
      WHERE page = 'homepage' AND key = 'homepage_partner_logos_enabled'
      LIMIT 1
    `;
    if (enabledRow.length > 0 && enabledRow[0].value === 'false') {
      return NextResponse.json([]);
    }

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

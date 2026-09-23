import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/newsletter: list all newsletter subscribers
export async function GET() {
  try {
    const sql = getSQL();

    const subscribers = await sql`
      SELECT id, email, source, subscribed_at
      FROM newsletter_subscribers
      ORDER BY subscribed_at DESC
    `;

    return NextResponse.json(subscribers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['new', 'contacted', 'closed'];

// GET /api/admin/inquiries — list inquiries, optionally filtered by status
export async function GET(request: NextRequest) {
  try {
    const sql = getSQL();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let inquiries;
    if (status && VALID_STATUSES.includes(status)) {
      inquiries = await sql`
        SELECT * FROM business_inquiries
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else {
      inquiries = await sql`
        SELECT * FROM business_inquiries
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json(inquiries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

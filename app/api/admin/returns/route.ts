import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'completed'];

// GET /api/admin/returns: list return/exchange requests, optionally filtered by status
export async function GET(request: NextRequest) {
  try {
    const sql = getSQL();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let tickets;
    if (status && VALID_STATUSES.includes(status)) {
      tickets = await sql`
        SELECT * FROM return_exchange_requests
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else {
      tickets = await sql`
        SELECT * FROM return_exchange_requests
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json(tickets);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

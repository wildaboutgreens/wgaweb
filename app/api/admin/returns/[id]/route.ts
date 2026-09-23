import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'completed'];

// GET /api/admin/returns/[id]: fetch detail of a return request
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  void _request;
  try {
    const sql = getSQL();
    const { id } = params;

    const tickets = await sql`
      SELECT * FROM return_exchange_requests
      WHERE id = ${id} OR ticket_number = ${id}
      LIMIT 1
    `;

    if (tickets.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(tickets[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/returns/[id]: update status or admin_notes
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();
    const { status, admin_notes } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    let updated;
    if (status !== undefined && admin_notes !== undefined) {
      updated = await sql`
        UPDATE return_exchange_requests
        SET status = ${status},
            admin_notes = ${admin_notes},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (status !== undefined) {
      updated = await sql`
        UPDATE return_exchange_requests
        SET status = ${status},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (admin_notes !== undefined) {
      updated = await sql`
        UPDATE return_exchange_requests
        SET admin_notes = ${admin_notes},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: unknown) {
    console.error('admin update return ticket error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

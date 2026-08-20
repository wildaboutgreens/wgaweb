import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

const VALID_STATUSES = ['new', 'contacted', 'closed'];

// PUT /api/admin/inquiries/[id] — update inquiry status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE business_inquiries
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.error('admin update inquiry error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

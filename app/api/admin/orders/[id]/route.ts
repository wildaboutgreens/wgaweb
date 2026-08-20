import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

const VALID_FULFILLMENT_STATUSES = ['unfulfilled', 'shipped', 'delivered', 'cancelled'];

// GET /api/admin/orders/[id] — full order detail with line items + product names
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;

    const orders = await sql`
      SELECT * FROM orders WHERE id = ${id} LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];

    const items = await sql`
      SELECT oi.id, oi.quantity, oi.unit_price_paise,
             pv.label, pv.net_weight_grams,
             p.name AS product_name, p.slug AS product_slug
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.product_variant_id
      JOIN products p ON p.id = pv.product_id
      WHERE oi.order_id = ${id}
    `;

    return NextResponse.json({ ...order, items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/orders/[id] — update fulfillment_status only
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();
    const { fulfillment_status } = body;

    if (!fulfillment_status || !VALID_FULFILLMENT_STATUSES.includes(fulfillment_status)) {
      return NextResponse.json(
        { error: `fulfillment_status must be one of: ${VALID_FULFILLMENT_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE orders
      SET fulfillment_status = ${fulfillment_status}
      WHERE id = ${id}
      RETURNING id, fulfillment_status, payment_status
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.error('admin update order error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

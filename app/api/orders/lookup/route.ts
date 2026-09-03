import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: string;
  order_id: string;
  quantity: number;
  unit_price_paise: number;
  variant_label: string;
  net_weight_grams: number;
  product_name: string;
  product_slug: string;
}

// GET /api/orders/lookup?phone=X&email=Y
// Public order tracking with strict rate limiting & exact phone + email match requirement
export async function GET(request: NextRequest) {
  try {
    // ── Rate Limiting: 5 requests per IP per 10 minutes (600s) ──
    const rateLimitError = await checkRateLimit(request, 'orders/lookup', 5, 600);
    if (rateLimitError) {
      return rateLimitError;
    }

    const { searchParams } = request.nextUrl;
    const phone = searchParams.get('phone')?.trim();
    const email = searchParams.get('email')?.trim();

    if (!phone || !email) {
      return NextResponse.json(
        { error: 'Both phone and email are required for order tracking.' },
        { status: 400 }
      );
    }

    const sql = getSQL();

    // Query orders matching both phone and email exactly.
    // Note: Do NOT select full delivery_address for privacy/security.
    const orders = await sql`
      SELECT id, customer_name, customer_phone, customer_email, delivery_pincode,
             total_paise, purchase_type, payment_status, fulfillment_status, created_at
      FROM orders
      WHERE TRIM(customer_phone) = ${phone}
        AND LOWER(TRIM(customer_email)) = ${email.toLowerCase()}
      ORDER BY created_at DESC
    `;

    if (orders.length === 0) {
      return NextResponse.json([]);
    }

    const orderIds = orders.map((o) => o.id as string);
    const items = await sql`
      SELECT oi.id, oi.order_id, oi.quantity, oi.unit_price_paise,
             pv.label AS variant_label, pv.net_weight_grams,
             p.name AS product_name, p.slug AS product_slug
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.product_variant_id
      JOIN products p ON p.id = pv.product_id
      WHERE oi.order_id = ANY(${orderIds})
    `;

    const itemsByOrder = new Map<string, OrderItem[]>();
    for (const item of items as unknown as OrderItem[]) {
      if (!itemsByOrder.has(item.order_id)) {
        itemsByOrder.set(item.order_id, []);
      }
      itemsByOrder.get(item.order_id)!.push(item);
    }

    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: itemsByOrder.get(order.id as string) || [],
    }));

    return NextResponse.json(ordersWithItems);
  } catch (error: unknown) {
    console.error('orders lookup error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

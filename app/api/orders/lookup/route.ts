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

// GET /api/orders/lookup?order_number=X&phone=Y&email=Z&turnstileToken=T
// Public order tracking: three-factor auth (order_number + phone + email),
// paid orders only, Turnstile CAPTCHA required.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const orderNumber = searchParams.get('order_number')?.trim();
    const phone = searchParams.get('phone')?.trim();
    const email = searchParams.get('email')?.trim();
    const turnstileToken = searchParams.get('turnstileToken')?.trim();

    // ── Require Turnstile token ──
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Turnstile verification is required.' },
        { status: 400 }
      );
    }

    // ── Require all three lookup fields ──
    if (!orderNumber || !phone || !email) {
      return NextResponse.json(
        { error: 'Order number, phone, and email are all required for order tracking.' },
        { status: 400 }
      );
    }

    // ── Input length limits ──
    if (orderNumber.length > 20 || phone.length > 20 || email.length > 254) {
      return NextResponse.json(
        { error: 'Invalid input.' },
        { status: 400 }
      );
    }

    // ── Verify Turnstile token server-side ──
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'CAPTCHA verification is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const turnstileRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      }
    );

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // ── Rate Limiting: 5 requests per IP per 10 minutes (600s) ──
    const rateLimitError = await checkRateLimit(request, 'orders/lookup', 5, 600);
    if (rateLimitError) {
      return rateLimitError;
    }

    const sql = getSQL();

    // Query: all three fields must match the SAME order, AND payment_status = 'paid'.
    // This makes it structurally impossible for this route to return an unpaid order.
    const orders = await sql`
      SELECT id, order_number, customer_name, customer_phone, customer_email, delivery_pincode,
             total_paise, purchase_type, payment_status, fulfillment_status, created_at
      FROM orders
      WHERE order_number = ${orderNumber}
        AND TRIM(customer_phone) = ${phone}
        AND LOWER(TRIM(customer_email)) = ${email.toLowerCase()}
        AND payment_status = 'paid'
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

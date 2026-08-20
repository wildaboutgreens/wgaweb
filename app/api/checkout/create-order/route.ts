import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';
import { getRazorpay } from '@/lib/razorpay';
import { isServiceable } from '@/lib/pincodes';

interface CartItem {
  variantId: string;
  quantity: number;
}

interface CreateOrderBody {
  items: CartItem[];
  purchaseType: 'one_time' | 'subscription';
  subscriptionFrequency?: 'weekly' | 'monthly';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryPincode: string;
}

export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body: CreateOrderBody = await request.json();

    // ── Validate required fields ──
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!body.customerName || !body.customerPhone || !body.deliveryAddress || !body.deliveryPincode) {
      return NextResponse.json({ error: 'Missing required customer/delivery fields' }, { status: 400 });
    }
    if (!['one_time', 'subscription'].includes(body.purchaseType)) {
      return NextResponse.json({ error: 'Invalid purchase type' }, { status: 400 });
    }
    if (body.purchaseType === 'subscription' && !['weekly', 'monthly'].includes(body.subscriptionFrequency || '')) {
      return NextResponse.json({ error: 'Subscription requires a valid frequency (weekly or monthly)' }, { status: 400 });
    }

    // ── Validate pincode ──
    if (!isServiceable(body.deliveryPincode)) {
      return NextResponse.json(
        { error: 'Sorry, we only deliver to Chandigarh, Mohali, and Panchkula at this time.' },
        { status: 400 }
      );
    }

    // ── Fetch variant prices from DB (never trust client prices) ──
    const variantIds = body.items.map((item) => item.variantId);
    const variants = await sql`
      SELECT pv.id, pv.label, pv.price_paise, pv.stock_qty, pv.is_active,
             p.name AS product_name
      FROM product_variants pv
      JOIN products p ON p.id = pv.product_id
      WHERE pv.id = ANY(${variantIds})
    `;

    const variantMap = new Map(variants.map((v) => [v.id as string, v]));

    // Validate all variants exist, are active, and have sufficient stock
    for (const item of body.items) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        return NextResponse.json({ error: `Variant ${item.variantId} not found` }, { status: 400 });
      }
      if (!variant.is_active) {
        return NextResponse.json(
          { error: `${variant.product_name} (${variant.label}) is no longer available` },
          { status: 400 }
        );
      }
      if ((variant.stock_qty as number) < item.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${variant.product_name} (${variant.label}). Requested: ${item.quantity}, available: ${variant.stock_qty}`,
          },
          { status: 409 }
        );
      }
    }

    // ── Calculate total server-side ──
    let subtotalPaise = 0;
    const lineItems: { variantId: string; quantity: number; unitPricePaise: number }[] = [];

    for (const item of body.items) {
      const variant = variantMap.get(item.variantId)!;
      const unitPrice = variant.price_paise as number;
      subtotalPaise += unitPrice * item.quantity;
      lineItems.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPricePaise: unitPrice,
      });
    }

    const totalPaise = subtotalPaise; // No delivery charge for MVP

    // ── Create Razorpay order ──
    const razorpayOrder = await getRazorpay().orders.create({
      amount: totalPaise,
      currency: 'INR',
      receipt: `wga_${Date.now()}`,
    });

    // ── Insert order into DB ──
    const orderRows = await sql`
      INSERT INTO orders (
        customer_name, customer_phone, customer_email,
        delivery_address, delivery_pincode,
        purchase_type, subscription_frequency,
        subtotal_paise, total_paise,
        razorpay_order_id, payment_status
      ) VALUES (
        ${body.customerName}, ${body.customerPhone}, ${body.customerEmail || null},
        ${body.deliveryAddress}, ${body.deliveryPincode},
        ${body.purchaseType}, ${body.subscriptionFrequency || null},
        ${subtotalPaise}, ${totalPaise},
        ${razorpayOrder.id}, 'pending'
      )
      RETURNING id
    `;

    const orderId = orderRows[0].id as string;

    // ── Insert order items ──
    for (const item of lineItems) {
      await sql`
        INSERT INTO order_items (order_id, product_variant_id, quantity, unit_price_paise)
        VALUES (${orderId}, ${item.variantId}, ${item.quantity}, ${item.unitPricePaise})
      `;
    }

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPaise,
      currency: 'INR',
    });
  } catch (error: unknown) {
    console.error('create-order error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

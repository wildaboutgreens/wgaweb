import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';
import { getRazorpay } from '@/lib/razorpay';
import { isServiceable } from '@/lib/pincodes';
import { checkRateLimit } from '@/lib/rateLimit';

interface RawCartItem {
  variantId?: string;
  product_variant_id?: string;
  quantity: number;
}

interface RawCreateOrderBody {
  items?: RawCartItem[];
  purchaseType?: 'one_time' | 'subscription';
  purchase_type?: 'one_time' | 'subscription';
  subscriptionFrequency?: 'weekly' | 'monthly';
  subscription_frequency?: 'weekly' | 'monthly';
  customerName?: string;
  customer_name?: string;
  customerPhone?: string;
  customer_phone?: string;
  customerEmail?: string;
  customer_email?: string;
  deliveryAddress?: string;
  delivery_address?: string;
  deliveryPincode?: string;
  delivery_pincode?: string;
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit: 10 requests per IP per 5 minutes ──
    const rateLimited = await checkRateLimit(request, 'checkout/create-order', 10, 300);
    if (rateLimited) return rateLimited;

    const sql = getSQL();
    const body: RawCreateOrderBody = await request.json();

    // ── Normalize input fields (support both camelCase and snake_case) ──
    const items = body.items || [];
    const customerName = body.customerName || body.customer_name;
    const customerPhone = body.customerPhone || body.customer_phone;
    const customerEmail = body.customerEmail || body.customer_email;
    const deliveryAddress = body.deliveryAddress || body.delivery_address;
    const deliveryPincode = body.deliveryPincode || body.delivery_pincode;
    const purchaseType = body.purchaseType || body.purchase_type;
    const subscriptionFrequency = body.subscriptionFrequency || body.subscription_frequency;

    // ── Validate required fields ──
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!customerName || !customerPhone || !deliveryAddress || !deliveryPincode) {
      return NextResponse.json({ error: 'Missing required customer/delivery fields' }, { status: 400 });
    }
    if (!purchaseType || !['one_time', 'subscription'].includes(purchaseType)) {
      return NextResponse.json({ error: 'Invalid purchase type' }, { status: 400 });
    }
    if (purchaseType === 'subscription' && !['weekly', 'monthly'].includes(subscriptionFrequency || '')) {
      return NextResponse.json({ error: 'Subscription requires a valid frequency (weekly or monthly)' }, { status: 400 });
    }

    // ── Validate pincode ──
    if (!isServiceable(deliveryPincode)) {
      return NextResponse.json(
        { error: 'Sorry, we only deliver to Chandigarh, Mohali, and Panchkula at this time.' },
        { status: 400 }
      );
    }

    // ── Fetch variant prices from DB (never trust client prices) ──
    const normalizedItems = items.map((item) => ({
      variantId: (item.variantId || item.product_variant_id) as string,
      quantity: Number(item.quantity) || 1,
    }));

    const variantIds = normalizedItems.map((item) => item.variantId).filter(Boolean);
    if (variantIds.length !== normalizedItems.length) {
      return NextResponse.json({ error: 'Missing variant ID in cart items' }, { status: 400 });
    }

    const variants = await sql`
      SELECT pv.id, pv.label, pv.price_paise, pv.stock_qty, pv.is_active,
             p.name AS product_name
      FROM product_variants pv
      JOIN products p ON p.id = pv.product_id
      WHERE pv.id = ANY(${variantIds})
    `;

    const variantMap = new Map(variants.map((v) => [v.id as string, v]));

    // Validate all variants exist, are active, and have sufficient stock
    for (const item of normalizedItems) {
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

    for (const item of normalizedItems) {
      const variant = variantMap.get(item.variantId)!;
      const unitPrice = Number(variant.price_paise);
      subtotalPaise += unitPrice * item.quantity;
      lineItems.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPricePaise: unitPrice,
      });
    }

    const totalPaise = Math.round(subtotalPaise); // Ensure integer paise

    // ── Create Razorpay order ──
    let razorpayOrder;
    try {
      razorpayOrder = await getRazorpay().orders.create({
        amount: totalPaise,
        currency: 'INR',
        receipt: `wga_${Date.now()}`,
        notes: {
          customer_name: customerName,
          customer_phone: customerPhone,
          purchase_type: purchaseType,
        },
      });
    } catch (rzpErr: unknown) {
      console.error('Razorpay orders.create failed:', rzpErr);
      const rzpMessage =
        typeof rzpErr === 'object' && rzpErr !== null && 'error' in rzpErr
          ? JSON.stringify((rzpErr as { error: unknown }).error)
          : rzpErr instanceof Error
          ? rzpErr.message
          : 'Payment gateway order creation failed';
      return NextResponse.json(
        { error: `Payment gateway error: ${rzpMessage}` },
        { status: 502 }
      );
    }

    if (!razorpayOrder || !razorpayOrder.id) {
      console.error('Razorpay order response missing id:', razorpayOrder);
      return NextResponse.json(
        { error: 'Payment gateway returned invalid order response' },
        { status: 502 }
      );
    }

    // ── Insert order into DB ──
    const orderRows = await sql`
      INSERT INTO orders (
        customer_name, customer_phone, customer_email,
        delivery_address, delivery_pincode,
        purchase_type, subscription_frequency,
        subtotal_paise, total_paise,
        razorpay_order_id, payment_status
      ) VALUES (
        ${customerName}, ${customerPhone}, ${customerEmail || null},
        ${deliveryAddress}, ${deliveryPincode},
        ${purchaseType}, ${subscriptionFrequency || null},
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

    // ── Safe server-side log for verification ──
    console.log('[create-order] Generated razorpay_order_id:', razorpayOrder.id);

    return NextResponse.json({
      orderId,
      order_id: orderId,
      razorpayOrderId: razorpayOrder.id,
      razorpay_order_id: razorpayOrder.id,
      amount: totalPaise,
      currency: 'INR',
    });
  } catch (error: unknown) {
    console.error('create-order error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

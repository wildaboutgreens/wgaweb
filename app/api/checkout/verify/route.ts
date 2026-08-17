import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSQL } from '@/lib/db';

interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body: VerifyBody = await request.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ── Verify signature ──
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // ── Update order ──
    const result = await sql`
      UPDATE orders
      SET payment_status = 'paid',
          razorpay_payment_id = ${razorpay_payment_id}
      WHERE razorpay_order_id = ${razorpay_order_id}
        AND payment_status = 'pending'
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Order not found or already processed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'paid',
      orderId: result[0].id,
    });
  } catch (error: unknown) {
    console.error('verify error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

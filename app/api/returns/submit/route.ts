import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSQL } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

function generateTicketNumber(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(8);
  let code = 'RET-';
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit: 5 submissions per IP per 10 minutes ──
    const rateLimited = await checkRateLimit(request, 'returns/submit', 5, 600);
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const { order_number, phone, email, request_type, reason, turnstileToken } = body;

    // ── Validate inputs ──
    if (!order_number || !phone || !email || !reason) {
      return NextResponse.json(
        { error: 'Order number, phone number, email address, and reason are required.' },
        { status: 400 }
      );
    }

    const cleanOrderNumber = String(order_number).trim().toUpperCase();
    const cleanPhone = String(phone).trim();
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanReason = String(reason).trim();
    const cleanType = request_type === 'return' ? 'return' : 'exchange';

    if (cleanOrderNumber.length > 30 || cleanPhone.length > 25 || cleanEmail.length > 254) {
      return NextResponse.json({ error: 'Invalid input length.' }, { status: 400 });
    }

    if (cleanReason.length < 10 || cleanReason.length > 2500) {
      return NextResponse.json(
        { error: 'Please provide a detailed reason between 10 and 2,500 characters.' },
        { status: 400 }
      );
    }

    // ── Verify Turnstile token ──
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Verification check is required. Please solve the CAPTCHA.' },
          { status: 400 }
        );
      }

      const secretToUse =
        process.env.NODE_ENV !== 'production' &&
        (turnstileToken === 'XXXX.DUMMY.TOKEN.XXXX' || turnstileToken === 'dev-token')
          ? '1x0000000000000000000000000000000AA'
          : turnstileSecret;

      const turnstileRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: secretToUse,
            response: turnstileToken,
          }),
        }
      );

      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return NextResponse.json(
          { error: 'Verification check failed. Please refresh and try again.' },
          { status: 403 }
        );
      }
    }

    const sql = getSQL();

    // ── Phone normalization (match last 10 digits) ──
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    const last10Digits = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : phoneDigits;

    // ── Verify Order validity in database ──
    const orders = await sql`
      SELECT id, order_number, customer_name, customer_phone, customer_email, payment_status, created_at
      FROM orders
      WHERE UPPER(TRIM(order_number)) = ${cleanOrderNumber}
        AND RIGHT(REGEXP_REPLACE(customer_phone, '[^0-9]', '', 'g'), 10) = ${last10Digits}
        AND LOWER(TRIM(customer_email)) = ${cleanEmail}
        AND payment_status = 'paid'
      LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json(
        {
          error:
            'No matching paid order was found with this Order Number, phone number, and email. Please check your order confirmation details and try again.',
        },
        { status: 404 }
      );
    }

    const matchedOrder = orders[0];

    // ── Generate unique ticket number ──
    let ticketNumber = generateTicketNumber();
    let isUnique = false;
    for (let attempts = 0; attempts < 5; attempts++) {
      const existing = await sql`
        SELECT id FROM return_exchange_requests WHERE ticket_number = ${ticketNumber} LIMIT 1
      `;
      if (existing.length === 0) {
        isUnique = true;
        break;
      }
      ticketNumber = generateTicketNumber();
    }

    if (!isUnique) {
      ticketNumber = `RET-${Date.now().toString(36).toUpperCase()}`;
    }

    // ── Insert return/exchange ticket into database ──
    const inserted = await sql`
      INSERT INTO return_exchange_requests (
        ticket_number,
        order_id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        request_type,
        reason,
        status
      ) VALUES (
        ${ticketNumber},
        ${matchedOrder.id},
        ${matchedOrder.order_number},
        ${matchedOrder.customer_name || 'Customer'},
        ${cleanPhone},
        ${cleanEmail},
        ${cleanType},
        ${cleanReason},
        'pending'
      )
      RETURNING ticket_number, order_number, customer_name, customer_phone, customer_email, request_type, created_at
    `;

    const ticket = inserted[0];

    return NextResponse.json(
      {
        message: 'Ticket raised successfully',
        ticket_number: ticket.ticket_number,
        order_number: ticket.order_number,
        customer_name: ticket.customer_name,
        customer_phone: ticket.customer_phone,
        customer_email: ticket.customer_email,
        request_type: ticket.request_type,
        created_at: ticket.created_at,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('return ticket submission error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

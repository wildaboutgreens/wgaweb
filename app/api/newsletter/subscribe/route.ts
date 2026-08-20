import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body = await request.json();
    const { email, source } = body;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    // Insert with ON CONFLICT to silently handle re-subscriptions.
    // Don't reveal whether the email was already subscribed (privacy).
    await sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${email.toLowerCase().trim()}, ${source || null})
      ON CONFLICT (email) DO NOTHING
    `;

    // TODO: The design mentions "15% off" for signing up, but there's no
    // coupon/discount system built yet. When a discount code mechanism is
    // implemented (likely a `discount_codes` table + checkout integration),
    // this endpoint should generate and return a unique code, or trigger
    // an email with the code. For now we just capture the email.

    return NextResponse.json({
      message: 'Thanks for subscribing! 🌱',
    });
  } catch (error: unknown) {
    console.error('newsletter subscribe error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

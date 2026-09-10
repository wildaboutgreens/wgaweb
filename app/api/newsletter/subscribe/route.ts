import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit: 3 requests per IP per 10 minutes ──
    const rateLimited = await checkRateLimit(request, 'newsletter/subscribe', 3, 600);
    if (rateLimited) return rateLimited;

    const sql = getSQL();
    const body = await request.json();
    const { email, source } = body;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json({ error: 'Email is too long' }, { status: 400 });
    }

    const safeSource = typeof source === 'string' ? source.slice(0, 100) : null;

    // Insert with ON CONFLICT to silently handle re-subscriptions.
    // Don't reveal whether the email was already subscribed (privacy).
    await sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${email.toLowerCase().trim()}, ${safeSource})
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

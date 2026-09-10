import { NextRequest, NextResponse } from 'next/server';
import { signToken, COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limiting: 5 requests per IP per 15 minutes (900s) ──
    const rateLimitError = await checkRateLimit(request, 'admin/login', 5, 900);
    if (rateLimitError) {
      return rateLimitError;
    }

    const { password } = await request.json();

    if (typeof password !== 'string' || password.length > 200) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await signToken();

    const response = NextResponse.json({ status: 'authenticated' });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error: unknown) {
    console.error('admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

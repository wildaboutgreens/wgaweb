import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

// ── Security headers applied to ALL responses ──
const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://cloudinary.com https://images.unsplash.com https://plus.unsplash.com https://*.unsplash.com https://images.pexels.com https://*.pexels.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.razorpay.com https://challenges.cloudflare.com",
    "frame-src https://api.razorpay.com https://challenges.cloudflare.com",
  ].join('; '),
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth check (all /api/admin/* except /api/admin/login) ──
  if (pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/login')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return applySecurityHeaders(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      return applySecurityHeaders(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    // Apply to all routes (security headers) — admin auth is checked conditionally above
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

/**
 * Check and enforce rate limiting for a public route.
 * Uses a database-backed sliding window approach.
 *
 * @param request - The incoming Next.js request (used to read client IP)
 * @param routeName - A stable identifier for this route (e.g. 'checkout/create-order')
 * @param maxRequests - Maximum allowed requests in the window
 * @param windowSeconds - Size of the sliding window in seconds
 * @returns null if the request is allowed, or a 429 NextResponse if rate-limited
 */
export async function checkRateLimit(
  request: NextRequest,
  routeName: string,
  maxRequests: number,
  windowSeconds: number
): Promise<NextResponse | null> {
  const sql = getSQL();

  // Read client IP from x-forwarded-for (standard on Netlify, Vercel, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  // Count recent requests from this IP on this route
  const countResult = await sql`
    SELECT COUNT(*)::int AS cnt
    FROM rate_limit_log
    WHERE ip_address = ${ip}
      AND route = ${routeName}
      AND created_at > now() - make_interval(secs => ${windowSeconds})
  `;

  const currentCount = countResult[0]?.cnt as number ?? 0;

  if (currentCount >= maxRequests) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfterSeconds: windowSeconds,
      },
      { status: 429 }
    );
  }

  // Log this request
  await sql`
    INSERT INTO rate_limit_log (ip_address, route)
    VALUES (${ip}, ${routeName})
  `;

  return null; // Request is allowed
}

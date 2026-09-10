import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function GET() {
  try {
    const sql = getSQL();
    await sql`SELECT 1`;
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error: unknown) {
    console.error('health check error:', error);
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 500 }
    );
  }
}

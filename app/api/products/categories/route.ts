import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/products/categories — distinct category values from active products
export async function GET() {
  try {
    const sql = getSQL();
    const result = await sql`
      SELECT DISTINCT category
      FROM products
      WHERE is_active = true
      ORDER BY category ASC
    `;

    const categories = result.map((row) => row.category as string);
    return NextResponse.json(categories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const sql = getSQL();
    const { slug } = params;

    const products = await sql`
      SELECT id, slug, name, category, description, nutrition_notes,
             is_bundle, is_active, created_at
      FROM products
      WHERE slug = ${slug} AND is_active = true
      LIMIT 1
    `;

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];

    const variants = await sql`
      SELECT id, product_id, label, net_weight_grams,
             price_paise, stock_qty, is_active
      FROM product_variants
      WHERE product_id = ${product.id} AND is_active = true
      ORDER BY price_paise ASC
    `;

    return NextResponse.json({ ...product, variants });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

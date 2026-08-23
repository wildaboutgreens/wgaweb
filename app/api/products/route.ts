import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sql = getSQL();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Fetch products, optionally filtered by category
    let products;
    if (category) {
      products = await sql`
        SELECT id, slug, name, category, description, nutrition_notes,
               is_bundle, is_active, created_at
        FROM products
        WHERE is_active = true AND category = ${category}
        ORDER BY created_at DESC
      `;
    } else {
      products = await sql`
        SELECT id, slug, name, category, description, nutrition_notes,
               is_bundle, is_active, created_at
        FROM products
        WHERE is_active = true
        ORDER BY created_at DESC
      `;
    }

    // Fetch variants for the returned products
    const productIds = products.map((p) => p.id as string);
    let variants: Awaited<ReturnType<typeof sql>> = [];

    if (productIds.length > 0) {
      variants = await sql`
        SELECT pv.id, pv.product_id, pv.label, pv.net_weight_grams,
               pv.price_paise, pv.stock_qty, pv.is_active
        FROM product_variants pv
        WHERE pv.is_active = true AND pv.product_id = ANY(${productIds})
        ORDER BY pv.price_paise ASC
      `;
    }

    // Nest variants under their products
    const variantsByProduct = new Map<string, typeof variants>();
    for (const v of variants) {
      const pid = v.product_id as string;
      if (!variantsByProduct.has(pid)) {
        variantsByProduct.set(pid, []);
      }
      variantsByProduct.get(pid)!.push(v);
    }

    const result = products.map((p) => ({
      ...p,
      variants: variantsByProduct.get(p.id as string) || [],
    }));

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

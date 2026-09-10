import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;

    const products = await sql`
      SELECT *
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const variants = await sql`
      SELECT *
      FROM product_variants
      WHERE product_id = ${id}
      ORDER BY price_paise ASC
    `;

    const images = await sql`
      SELECT id, product_id, image_url, display_order, cloudinary_public_id, created_at
      FROM product_images
      WHERE product_id = ${id}
      ORDER BY display_order ASC, created_at ASC
    `;

    return NextResponse.json({ ...products[0], variants, images });
  } catch (error: unknown) {
    console.error('admin get product error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();

    const { slug, name, category, description, nutrition_notes, is_bundle, is_active, thumbnail_url, tags } = body;

    const formattedTags = tags !== undefined ? (Array.isArray(tags) ? tags : []) : null;

    const result = await sql`
      UPDATE products
      SET
        slug            = COALESCE(${slug ?? null}, slug),
        name            = COALESCE(${name ?? null}, name),
        category        = COALESCE(${category ?? null}, category),
        description     = COALESCE(${description ?? null}, description),
        nutrition_notes = COALESCE(${nutrition_notes ?? null}, nutrition_notes),
        is_bundle       = COALESCE(${is_bundle ?? null}, is_bundle),
        is_active       = COALESCE(${is_active ?? null}, is_active),
        thumbnail_url   = CASE WHEN ${thumbnail_url !== undefined} THEN ${thumbnail_url ?? null} ELSE thumbnail_url END,
        tags            = CASE WHEN ${tags !== undefined} THEN ${formattedTags} ELSE tags END
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.error('admin update product error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;

    const result = await sql`
      UPDATE products
      SET is_active = false
      WHERE id = ${id}
      RETURNING id, name, is_active
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deactivated', product: result[0] });
  } catch (error: unknown) {
    console.error('admin delete product error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

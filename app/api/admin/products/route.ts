import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getSQL();
    const products = await sql`
      SELECT *
      FROM products
      ORDER BY created_at DESC
    `;
    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error('admin get products error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getSQL();
    const body = await request.json();

    const { slug, name, category, description, nutrition_notes, is_bundle, thumbnail_url, tags } = body;

    if (!slug || !name || !category) {
      return NextResponse.json(
        { error: 'slug, name, and category are required' },
        { status: 400 }
      );
    }

    const formattedTags = Array.isArray(tags) ? tags : [];

    const result = await sql`
      INSERT INTO products (slug, name, category, description, nutrition_notes, is_bundle, thumbnail_url, tags)
      VALUES (${slug}, ${name}, ${category}, ${description || null}, ${nutrition_notes || null}, ${is_bundle || false}, ${thumbnail_url || null}, ${formattedTags})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: unknown) {
    console.error('admin create product error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'A product with that slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getSQL();
    const { id } = params;
    const body = await request.json();

    const { slug, name, category, description, nutrition_notes, is_bundle, is_active } = body;

    const result = await sql`
      UPDATE products
      SET
        slug            = COALESCE(${slug ?? null}, slug),
        name            = COALESCE(${name ?? null}, name),
        category        = COALESCE(${category ?? null}, category),
        description     = COALESCE(${description ?? null}, description),
        nutrition_notes = COALESCE(${nutrition_notes ?? null}, nutrition_notes),
        is_bundle       = COALESCE(${is_bundle ?? null}, is_bundle),
        is_active       = COALESCE(${is_active ?? null}, is_active)
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

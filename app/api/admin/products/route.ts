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

    const { slug, name, categories, badge_label, highlight_1, highlight_2, description, nutrition_notes, is_bundle, thumbnail_url, thumbnail_alt_text, tags, detail_highlight_badges, faqs } = body;

    if (!slug || !name || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'slug, name, and at least one category are required' },
        { status: 400 }
      );
    }

    const formattedTags = Array.isArray(tags) ? tags : [];
    const formattedBadges = Array.isArray(detail_highlight_badges)
      ? JSON.stringify(detail_highlight_badges)
      : JSON.stringify([
          { icon: '⚡', label: '40x Sulforaphane' },
          { icon: '🛡️', label: 'Zero Pesticides' },
          { icon: '💧', label: 'Mineral RO Grown' },
          { icon: '✂️', label: 'Cut to Order' },
        ]);
    const formattedFaqs = Array.isArray(faqs) ? JSON.stringify(faqs) : JSON.stringify([]);

    const result = await sql`
      INSERT INTO products (slug, name, categories, description, nutrition_notes, is_bundle, thumbnail_url, thumbnail_alt_text, tags, badge_label, highlight_1, highlight_2, detail_highlight_badges, faqs)
      VALUES (${slug}, ${name}, ${categories}, ${description || null}, ${nutrition_notes || null}, ${is_bundle || false}, ${thumbnail_url || null}, ${thumbnail_alt_text || null}, ${formattedTags}, ${badge_label || null}, ${highlight_1 || null}, ${highlight_2 || null}, ${formattedBadges}::jsonb, ${formattedFaqs}::jsonb)
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

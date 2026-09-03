import { notFound } from 'next/navigation';
import { getSQL } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export interface Variant {
  id: string;
  product_id: string;
  label: string;
  net_weight_grams: number;
  price_paise: number;
  stock_qty: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  nutrition_notes: string | null;
  is_bundle: boolean;
  variants: Variant[];
}

export interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price_paise: number;
  variant_id: string;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const sql = getSQL();
    const products = await sql`
      SELECT id, slug, name, category, description, nutrition_notes, is_bundle, is_active
      FROM products
      WHERE slug = ${slug} AND is_active = true
    `;
    if (products.length === 0) return null;
    const product = products[0];

    const variants = await sql`
      SELECT id, product_id, label, net_weight_grams, price_paise, stock_qty, is_active
      FROM product_variants
      WHERE product_id = ${product.id} AND is_active = true
      ORDER BY price_paise ASC
    `;

    return {
      ...product,
      variants,
    } as unknown as Product;
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

async function getRelatedProducts(currentSlug: string): Promise<RelatedProduct[]> {
  try {
    const sql = getSQL();
    const products = await sql`
      SELECT p.id, p.slug, p.name, p.category, p.description,
             COALESCE(MIN(v.price_paise), 9900) as price_paise,
             COALESCE(MIN(v.id::text), '') as variant_id
      FROM products p
      LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_active = true
      WHERE p.slug != ${currentSlug} AND p.is_active = true
      GROUP BY p.id, p.slug, p.name, p.category, p.description
      LIMIT 8
    `;
    return products as unknown as RelatedProduct[];
  } catch (err) {
    console.error('Error fetching related products:', err);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, relatedProducts] = await Promise.all([
    getProduct(params.slug),
    getRelatedProducts(params.slug),
  ]);

  if (!product) notFound();

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

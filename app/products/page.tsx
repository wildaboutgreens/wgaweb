import { getSQL } from '@/lib/db';
import ProductListClient from './ProductListClient';

export const dynamic = 'force-dynamic';

export interface Variant {
  id: string;
  product_id: string;
  label: string;
  net_weight_grams?: number;
  price_paise: number;
  stock_qty: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  nutrition_notes: string | null;
  thumbnail_url: string | null;
  tags: string[];
  is_bundle: boolean;
  variants: Variant[];
  images?: ProductImage[];
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  nutrition_notes: string | null;
  thumbnail_url: string | null;
  tags: string[];
  is_bundle: boolean;
}

interface CategoryRow {
  category: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const sql = getSQL();
    const products = await sql`
      SELECT id, slug, name, category, description, nutrition_notes,
             thumbnail_url, tags, is_bundle
      FROM products
      WHERE is_active = true
      ORDER BY is_bundle ASC, created_at ASC
    `;
    const productList = products as unknown as ProductRow[];
    if (productList.length === 0) return [];

    const productIds = productList.map((p) => p.id);

    const [variants, images] = await Promise.all([
      sql`
        SELECT id, product_id, label, net_weight_grams, price_paise, stock_qty, is_active
        FROM product_variants
        WHERE is_active = true AND product_id = ANY(${productIds})
        ORDER BY price_paise ASC
      `,
      sql`
        SELECT id, product_id, image_url, display_order
        FROM product_images
        WHERE product_id = ANY(${productIds})
        ORDER BY display_order ASC, created_at ASC
      `,
    ]);

    const variantList = variants as unknown as Variant[];
    const imageList = images as unknown as ProductImage[];

    return productList.map((p) => ({
      ...p,
      variants: variantList.filter((v) => v.product_id === p.id),
      images: imageList.filter((img) => img.product_id === p.id),
    }));
  } catch (err) {
    console.error('Error fetching products for PLP:', err);
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT DISTINCT category
      FROM products
      WHERE is_active = true
      ORDER BY category ASC
    `;
    const categoryList = rows as unknown as CategoryRow[];
    return categoryList.map((r) => r.category);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

async function getContentMap(): Promise<Record<string, string>> {
  try {
    const sql = getSQL();
    const blocks = await sql`
      SELECT key, value
      FROM content_blocks
      WHERE page = 'product-listing'
    `;
    const map: Record<string, string> = {};
    for (const b of blocks as unknown as { key: string; value: string }[]) {
      map[b.key] = b.value;
    }
    return map;
  } catch (err) {
    console.error('Error fetching product-listing content blocks:', err);
    return {};
  }
}

export default async function ProductsPage() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getContentMap(),
  ]);

  return (
    <ProductListClient
      initialProducts={products}
      initialCategories={categories}
      content={content}
    />
  );
}


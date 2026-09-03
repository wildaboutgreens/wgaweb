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

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  nutrition_notes: string | null;
  is_bundle: boolean;
}

interface CategoryRow {
  category: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const sql = getSQL();
    const products = await sql`
      SELECT id, slug, name, category, description, nutrition_notes, is_bundle
      FROM products
      WHERE is_active = true
      ORDER BY is_bundle ASC, created_at ASC
    `;
    const productList = products as unknown as ProductRow[];
    if (productList.length === 0) return [];

    const variants = await sql`
      SELECT id, product_id, label, net_weight_grams, price_paise, stock_qty, is_active
      FROM product_variants
      WHERE is_active = true
      ORDER BY price_paise ASC
    `;
    const variantList = variants as unknown as Variant[];

    return productList.map((p) => ({
      ...p,
      variants: variantList.filter((v) => v.product_id === p.id),
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

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductListClient initialProducts={products} initialCategories={categories} />;
}

import type { Metadata } from 'next';
import { getSQL } from '@/lib/db';
import ProductListClient from './ProductListClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop Living Microgreens · Wild About Greens',
  description: 'Browse our range of living microgreen trays — broccoli, sunflower, radish and bundles. Cut to order, delivered on harvest morning in Chandigarh, Mohali & Panchkula.',
  openGraph: {
    title: 'Shop Living Microgreens · Wild About Greens',
    description: 'Browse our range of living microgreen trays — broccoli, sunflower, radish and bundles. Cut to order, delivered on harvest morning.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Living Microgreens · Wild About Greens',
    description: 'Browse our range of living microgreen trays. Cut to order, delivered on harvest morning.',
  },
};

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
  alt_text?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  description: string;
  nutrition_notes: string | null;
  thumbnail_url: string | null;
  thumbnail_alt_text?: string | null;
  tags: string[];
  badge_label?: string | null;
  highlight_1?: string | null;
  highlight_2?: string | null;
  is_bundle: boolean;
  variants: Variant[];
  images?: ProductImage[];
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  description: string;
  nutrition_notes: string | null;
  thumbnail_url: string | null;
  thumbnail_alt_text: string | null;
  tags: string[];
  badge_label?: string | null;
  highlight_1?: string | null;
  highlight_2?: string | null;
  is_bundle: boolean;
}

interface CategoryRow {
  category: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const sql = getSQL();
    const products = await sql`
      SELECT id, slug, name, categories, description, nutrition_notes,
             thumbnail_url, thumbnail_alt_text, tags, badge_label, highlight_1, highlight_2, is_bundle
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
        SELECT id, product_id, image_url, display_order, alt_text
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
      SELECT DISTINCT unnest(categories) AS category
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

export interface WhyChoosePin {
  id: string;
  group_key: string;
  icon: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
}

async function getWhyChoosePins(): Promise<WhyChoosePin[]> {
  try {
    const sql = getSQL();
    const pins = await sql`
      SELECT id, group_key, icon, title, description, image_url, link_url, display_order
      FROM content_pins
      WHERE group_key = 'product_listing_why_choose'
        AND is_active = true
      ORDER BY display_order ASC
    `;
    return pins as unknown as WhyChoosePin[];
  } catch (err) {
    console.error('Error fetching why choose pins:', err);
    return [];
  }
}

export default async function ProductsPage() {
  const [products, categories, content, whyChoosePins] = await Promise.all([
    getProducts(),
    getCategories(),
    getContentMap(),
    getWhyChoosePins(),
  ]);

  return (
    <ProductListClient
      initialProducts={products}
      initialCategories={categories}
      content={content}
      initialWhyChoosePins={whyChoosePins}
    />
  );
}


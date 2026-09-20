import type { Metadata } from 'next';
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

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  alt_text?: string | null;
}

export interface HighlightBadge {
  icon: string;
  label: string;
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

export interface Review {
  id: string;
  product_id: string | null;
  reviewer_name: string;
  reviewer_location: string | null;
  review_text: string;
  rating: number;
  display_order: number;
  is_active: boolean;
}

export interface ProductFAQ {
  question: string;
  answer: string;
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
  images: ProductImage[];
  detail_highlight_badges?: HighlightBadge[] | null;
  faqs?: ProductFAQ[] | null;
}

export interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  description: string;
  thumbnail_url: string | null;
  thumbnail_alt_text?: string | null;
  price_paise: number;
  variant_id: string;
  highlight_1?: string | null;
  highlight_2?: string | null;
  badge_label?: string | null;
  is_bundle?: boolean;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const sql = getSQL();
    const products = await sql`
      SELECT id, slug, name, categories, description, nutrition_notes,
             thumbnail_url, thumbnail_alt_text, tags, badge_label, highlight_1, highlight_2,
             is_bundle, is_active, detail_highlight_badges, faqs
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

    const images = await sql`
      SELECT id, product_id, image_url, display_order, alt_text
      FROM product_images
      WHERE product_id = ${product.id}
      ORDER BY display_order ASC, created_at ASC
    `;

    return {
      ...product,
      variants,
      images,
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
      SELECT p.id, p.slug, p.name, p.categories, p.description,
             COALESCE(
               p.thumbnail_url,
               (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.display_order ASC LIMIT 1)
             ) as thumbnail_url,
             p.thumbnail_alt_text,
             p.highlight_1, p.highlight_2, p.badge_label, p.is_bundle,
             COALESCE(MIN(v.price_paise), 9900) as price_paise,
             COALESCE(MIN(v.id::text), '') as variant_id
      FROM products p
      LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_active = true
      WHERE p.slug != ${currentSlug} AND p.is_active = true
      GROUP BY p.id, p.slug, p.name, p.categories, p.description, p.thumbnail_url, p.thumbnail_alt_text, p.highlight_1, p.highlight_2, p.badge_label, p.is_bundle, p.created_at
      ORDER BY p.created_at ASC
      LIMIT 20
    `;
    return products as unknown as RelatedProduct[];
  } catch (err) {
    console.error('Error fetching related products:', err);
    return [];
  }
}

async function getContentMap(): Promise<Record<string, string>> {
  try {
    const sql = getSQL();
    const blocks = await sql`
      SELECT key, value
      FROM content_blocks
      WHERE page = 'product-detail' OR page = 'product-listing'
      ORDER BY (CASE WHEN page = 'product-detail' THEN 1 ELSE 0 END) ASC
    `;
    const map: Record<string, string> = {};
    for (const b of blocks as unknown as { key: string; value: string }[]) {
      map[b.key] = b.value;
    }
    return map;
  } catch (err) {
    console.error('Error fetching content blocks:', err);
    return {};
  }
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

async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const sql = getSQL();
    const reviews = await sql`
      SELECT id, product_id, reviewer_name, reviewer_location, review_text, rating, display_order, is_active
      FROM product_reviews
      WHERE is_active = true AND (product_id = ${productId} OR product_id IS NULL)
      ORDER BY (CASE WHEN product_id = ${productId} THEN 0 ELSE 1 END), display_order ASC, created_at ASC
    `;
    return reviews as unknown as Review[];
  } catch (err) {
    console.error('Error fetching product reviews:', err);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return { title: 'Product Not Found · Wild About Greens' };
  }
  const title = `${product.name} · Wild About Greens`;
  const description = product.description || `Shop ${product.name}: fresh living microgreens delivered in Chandigarh, Mohali & Panchkula.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(product.thumbnail_url ? { images: [{ url: product.thumbnail_url }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(product.thumbnail_url ? { images: [product.thumbnail_url] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const [relatedProducts, content, reviews, whyChoosePins] = await Promise.all([
    getRelatedProducts(params.slug),
    getContentMap(),
    getProductReviews(product.id),
    getWhyChoosePins(),
  ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      content={content}
      reviews={reviews}
      initialWhyChoosePins={whyChoosePins}
    />
  );
}


import { getSQL } from '@/lib/db';
import HomePageClient, { type ContentPin, type GoalPin } from './HomePageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Wild About Greens · Living Microgreens Delivered Fresh in Chandigarh',
  description: 'Farm-fresh living microgreens harvested on the morning of delivery. Non GMO seeds, mineral water, zero pesticides. Serving Chandigarh, Mohali & Panchkula.',
  openGraph: {
    title: 'Wild About Greens · Living Microgreens Delivered Fresh in Chandigarh',
    description: 'Farm-fresh living microgreens harvested on the morning of delivery. Serving Chandigarh, Mohali & Panchkula.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wild About Greens · Living Microgreens Delivered Fresh in Chandigarh',
    description: 'Farm-fresh living microgreens harvested on the morning of delivery. Serving Chandigarh, Mohali & Panchkula.',
  },
};

interface ContentBlock {
  key: string;
  value: string;
}

async function getContentMap(): Promise<Record<string, string>> {
  try {
    const sql = getSQL();
    const blocks = await sql`
      SELECT key, value
      FROM content_blocks
      WHERE page = 'homepage'
    `;
    const map: Record<string, string> = {};
    for (const b of blocks as unknown as ContentBlock[]) {
      map[b.key] = b.value;
    }
    return map;
  } catch (err) {
    console.error('Error fetching homepage content blocks:', err);
    return {};
  }
}

async function getPins(): Promise<ContentPin[]> {
  try {
    const sql = getSQL();
    const pins = await sql`
      SELECT id, icon, title, description, display_order
      FROM content_pins
      WHERE group_key = 'homepage_icon_strip'
        AND is_active = true
      ORDER BY display_order ASC
    `;
    return pins as unknown as ContentPin[];
  } catch (err) {
    console.error('Error fetching homepage pins:', err);
    return [];
  }
}

async function getGoalPins(): Promise<GoalPin[]> {
  try {
    const sql = getSQL();
    const pins = await sql`
      SELECT id, group_key, icon, title, description, image_url, link_url, display_order
      FROM content_pins
      WHERE group_key = 'homepage_shop_by_goal'
        AND is_active = true
      ORDER BY display_order ASC
    `;
    return pins as unknown as GoalPin[];
  } catch (err) {
    console.error('Error fetching homepage goal pins:', err);
    return [];
  }
}

async function getRecipeCount(): Promise<number> {
  try {
    const sql = getSQL();
    const result = await sql`
      SELECT COUNT(*)::int AS count
      FROM blog_posts
      WHERE is_published = true AND post_type = 'recipe'
    `;
    return (result[0] as unknown as { count: number }).count || 0;
  } catch (err) {
    console.error('Error fetching recipe count:', err);
    return 0;
  }
}

interface FeaturedRecipe {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
}

async function getFeaturedRecipes(): Promise<FeaturedRecipe[]> {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT id, slug, title, excerpt
      FROM blog_posts
      WHERE is_published = true AND show_on_homepage = true
      ORDER BY published_at DESC
      LIMIT 4
    `;
    return posts as unknown as FeaturedRecipe[];
  } catch (err) {
    console.error('Error fetching featured recipes:', err);
    return [];
  }
}

export default async function HomePage() {
  const [content, dbPins, recipeCount, featuredRecipes, goalPins] = await Promise.all([
    getContentMap(),
    getPins(),
    getRecipeCount(),
    getFeaturedRecipes(),
    getGoalPins(),
  ]);

  return (
    <HomePageClient
      content={content}
      dbPins={dbPins}
      recipeCount={recipeCount}
      featuredRecipes={featuredRecipes}
      initialGoalPins={goalPins}
    />
  );
}

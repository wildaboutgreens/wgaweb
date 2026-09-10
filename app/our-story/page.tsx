import type { Metadata } from 'next';
import { getSQL } from '@/lib/db';
import OurStoryClient from './OurStoryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Story · Wild About Greens',
  description:
    'Helping India rediscover the power of living food. We grow living microgreens locally on vertical indoor racks across Chandigarh, Mohali & Panchkula.',
};

async function getContentMap(): Promise<Record<string, string>> {
  try {
    const sql = getSQL();
    const blocks = await sql`
      SELECT key, value
      FROM content_blocks
      WHERE page = 'our-story'
    `;
    const map: Record<string, string> = {};
    for (const b of blocks as unknown as { key: string; value: string }[]) {
      map[b.key] = b.value;
    }
    return map;
  } catch (err) {
    console.error('Error fetching our-story content blocks:', err);
    return {};
  }
}

export default async function OurStoryPage() {
  const content = await getContentMap();
  return <OurStoryClient content={content} />;
}


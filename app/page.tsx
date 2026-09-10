import { getSQL } from '@/lib/db';
import HomePageClient, { type ContentPin } from './HomePageClient';

export const dynamic = 'force-dynamic';

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

export default async function HomePage() {
  const [content, dbPins] = await Promise.all([getContentMap(), getPins()]);

  return <HomePageClient content={content} dbPins={dbPins} />;
}

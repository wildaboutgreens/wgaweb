import { Metadata } from 'next';
import { getSQL } from '@/lib/db';
import LegalPageLayout from '@/components/LegalPageLayout';
import { CONTENT_REGISTRY } from '@/lib/contentRegistry';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shipping & Returns | Wild About Greens',
  description: 'Morning harvest delivery policies and 24-hour return & exchange guidelines for Wild About Greens.',
};

async function getPolicyContent() {
  try {
    const sql = getSQL();
    const blocks = await sql`
      SELECT key, value
      FROM content_blocks
      WHERE page = 'shipping-and-returns'
    `;
    const map: Record<string, string> = {};
    for (const b of blocks as unknown as { key: string; value: string }[]) {
      map[b.key] = b.value;
    }
    return map;
  } catch {
    return {};
  }
}

export default async function ShippingAndReturnsPage() {
  const contentMap = await getPolicyContent();
  const defaults = (CONTENT_REGISTRY['shipping-and-returns'] || []).reduce<Record<string, string>>((acc, f) => {
    acc[f.key] = f.defaultValue;
    return acc;
  }, {});

  const pageTitle = contentMap.page_title || defaults.page_title || 'Shipping & Returns';
  const docHeading = contentMap.doc_heading || defaults.doc_heading || 'SHIPPING & RETURNS POLICY';
  const preamble = contentMap.preamble || defaults.preamble || '';
  const content = contentMap.body_content || defaults.body_content || '';
  const lastUpdated = contentMap.last_updated || defaults.last_updated || '';

  return (
    <LegalPageLayout
      pageTitle={pageTitle}
      docHeading={docHeading}
      preamble={preamble}
      content={content}
      lastUpdated={lastUpdated}
    />
  );
}

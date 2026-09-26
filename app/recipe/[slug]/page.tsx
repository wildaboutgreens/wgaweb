import { permanentRedirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function RecipeDetailLegacyRedirect({
  params,
}: {
  params: { slug: string };
}) {
  permanentRedirect(`/recipes/${params.slug}`);
}

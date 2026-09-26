import { notFound, permanentRedirect } from 'next/navigation';
import { getSQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function BlogPostRedirect({ params }: { params: { slug: string } }) {
  try {
    const sql = getSQL();
    const posts = await sql`
      SELECT post_type
      FROM blog_posts
      WHERE slug = ${params.slug} AND is_published = true
      LIMIT 1
    `;

    if (posts.length === 0) {
      notFound();
    }

    const postType = (posts[0] as { post_type: string }).post_type;
    if (postType === 'recipe') {
      permanentRedirect(`/recipes/${params.slug}`);
    } else {
      permanentRedirect(`/pathshala/${params.slug}`);
    }
  } catch (err) {
    console.error('Error redirecting blog post:', err);
    notFound();
  }
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getFeaturedImageUrl, generateExcerpt, formatPostDate } from '@/lib/wordpress';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found - Utilo',
    };
  }

  const excerpt = generateExcerpt(post);
  const featuredImageUrl = getFeaturedImageUrl(post);

  return {
    title: `${post.title.rendered} - Utilo Blog`,
    description: excerpt,
    keywords: 'blog, article, online tools, productivity, web development',
    openGraph: {
      title: post.title.rendered,
      description: excerpt,
      type: 'article',
      url: `https://utilo.in/blog/${post.slug}`,
      images: featuredImageUrl ? [{ url: featuredImageUrl, alt: post.title.rendered }] : [],
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: excerpt,
      images: featuredImageUrl ? [featuredImageUrl] : [],
    },
    alternates: {
      canonical: `https://utilo.in/blog/${post.slug}`,
    },
  };
}

// Generate static params for all blog posts (ISR)
export async function generateStaticParams() {
  const { getAllPosts } = await import('@/lib/wordpress');
  const allPosts = await getAllPosts();

  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImageUrl = getFeaturedImageUrl(post);
  const formattedDate = formatPostDate(post.date);

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Featured Image */}
      {featuredImageUrl && (
        <div className="mb-8">
          <Image
            src={featuredImageUrl}
            alt={post.title.rendered}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
      )}

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title.rendered}
        </h1>
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          Published on {formattedDate}
        </div>
      </header>

      {/* Article Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-900 dark:prose-code:text-white prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* Back to Blog Link */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}
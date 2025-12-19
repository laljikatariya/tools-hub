import { Metadata } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/wordpress';
import BlogContent from './blog-content';

// SEO: Set metadata for blog listing page
export const metadata: Metadata = {
  title: 'Blog - Utilo',
  description: 'Read our latest articles about online tools, productivity tips, and web development insights. Discover helpful guides and tutorials on Utilo.',
  keywords: 'blog, articles, online tools, productivity, web development, tutorials',
  openGraph: {
    title: 'Blog - Utilo',
    description: 'Read our latest articles about online tools, productivity tips, and web development insights.',
    type: 'website',
    url: 'https://utilo.in/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Utilo',
    description: 'Read our latest articles about online tools, productivity tips, and web development insights.',
  },
  alternates: {
    canonical: 'https://utilo.in/blog',
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  return <BlogContent posts={posts} categories={categories} />;
}
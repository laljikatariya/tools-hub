import { Metadata } from 'next';
import { toolsData } from '@/lib/tools-data';
import { getSEOContent } from '@/lib/seo-content';
import ToolPageClient from './tool-page-client';

// Generate static params for all tool slugs to avoid chunk load errors
export function generateStaticParams() {
  return toolsData.map((tool) => ({
    slug: tool.slug,
  }));
}

// Enable dynamic params for any new tools
export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsData.find((t) => t.slug === slug);
  const seoContent = getSEOContent(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | Utilo',
      description: 'The requested tool could not be found.',
    };
  }

  const title = seoContent?.title || `${tool.name} - Free Online Tool | Utilo`;
  const description = seoContent?.metaDescription || tool.description;
  const keywords = seoContent?.keywords || [tool.name, tool.category, 'online tool', 'free'];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Utilo' }],
    creator: 'Utilo',
    publisher: 'Utilo',
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Utilo',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `/tools/${slug}`,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolPageClient slug={slug} />;
}

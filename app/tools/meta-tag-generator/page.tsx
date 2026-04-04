import { Metadata } from 'next';
import MetaTagGeneratorClient from './tool-page-client';

export const metadata: Metadata = {
  title: 'Meta Tag Generator - Free Online Tool | Utilo',
  description: 'Generate SEO-friendly meta tags for your website with live preview.',
  keywords: 'meta tag generator, seo meta tags, open graph tags, twitter card tags',
  alternates: {
    canonical: '/tools/meta-tag-generator',
  },
  openGraph: {
    title: 'Meta Tag Generator - Free Online Tool | Utilo',
    description: 'Generate SEO-friendly meta tags for your website with live preview.',
    type: 'website',
    siteName: 'Utilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Tag Generator - Free Online Tool | Utilo',
    description: 'Generate SEO-friendly meta tags for your website with live preview.',
  },
};

export default function MetaTagGeneratorPage() {
  return <MetaTagGeneratorClient />;
}

import type { Metadata } from 'next';
import { getSEOContent } from '@/lib/seo-content';
import { toolsData } from '@/lib/tools-data';

export async function generateMetadata(): Promise<Metadata> {
const slug = 'qr-code-scanner';
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
canonical: '/tools/qr-code-scanner',
},
};
}

export default function qr_code_scannerLayout({
children,
}: {
children: React.ReactNode;
}) {
return children;
}

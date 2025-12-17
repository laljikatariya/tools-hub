import type { Metadata, Viewport } from 'next';
import { RootProvider } from './providers';
import './globals.css';
import Script from 'next/script';

// ⚡ Optimize viewport for performance
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Utilo - 30+ Free Online Tools for Text, Image, PDF & More',
  description: 'Free online tools hub with 30+ utilities including text formatter, image compressor, PDF converter, color picker, password generator, and developer tools. No sign-up required.',
  keywords: 'online tools, free tools, text tools, image tools, pdf tools, color tools, developer tools, utilities, web tools',
  authors: [{ name: 'Utilo' }],
  creator: 'Utilo',
  publisher: 'Utilo',
  metadataBase: new URL('https://utilo.app'),
  manifest: '/manifest.json', // ⚡ PWA support
  openGraph: {
    title: 'Utilo - 30+ Free Online Tools',
    description: 'Free online tools for text, image, PDF, color, and developer utilities. Fast, secure, and no registration required.',
    type: 'website',
    siteName: 'Utilo',
    locale: 'en_US',
    url: 'https://utilo.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utilo - 30+ Free Online Tools',
    description: 'Free online tools for text, image, PDF, color, and developer utilities.',
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
  icons: {
    icon: '🧰',
  },
  alternates: {
    canonical: 'https://utilo.app',
  },
  // ⚡ Performance: Reduce redirect chains
  verification: {
    // Add your verification codes here
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
    // bing: 'your-bing-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ⚡ Performance: Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ⚡ Performance: DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* ⚡ PWA: Theme Color */}
        <meta name="theme-color" content="#4F46E5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
        
        {/* Google Analytics - Add your tracking ID */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script> */}
        
        {/* Schema.org Organization Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Utilo',
              url: 'https://utilo.app',
              logo: 'https://utilo.app/logo.png',
              description: 'Free online tools and utilities',
              sameAs: [
                // Add your social media profiles
                // 'https://twitter.com/utilo',
                // 'https://github.com/utilo',
              ],
            }),
          }}
        />

        {/* Schema.org WebSite Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Utilo',
              url: 'https://utilo.app',
              description: '30+ free online tools for text, image, PDF, color, and developer utilities',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://utilo.app/?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" strategy="beforeInteractive" />
      </head>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

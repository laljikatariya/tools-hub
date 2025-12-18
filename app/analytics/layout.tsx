import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard - Utilo',
  description: 'Internal analytics dashboard for Utilo tools usage and performance metrics.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/analytics',
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
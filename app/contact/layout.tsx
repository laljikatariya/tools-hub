import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Utilo | Get in Touch',
  description: 'Have questions or feedback? Contact the Utilo team. We respond to all inquiries within 24-48 hours. Report bugs, suggest features, or share your thoughts.',
  keywords: ['contact', 'support', 'feedback', 'help', 'get in touch', 'Utilo contact', 'report bug', 'feature request'],
  openGraph: {
    title: 'Contact Us - Utilo',
    description: 'Get in touch with the Utilo team for support, feedback, or inquiries.',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/app/components/header';

export const metadata: Metadata = {
  title: 'Privacy Policy - Utilo | Your Data is Safe',
  description: 'Learn how Utilo protects your privacy. We process most data locally in your browser and never store your files. Read our comprehensive privacy policy.',
  keywords: ['privacy policy', 'data protection', 'privacy', 'security', 'GDPR', 'data safety', 'Utilo privacy'],
  openGraph: {
    title: 'Privacy Policy - Utilo',
    description: 'Your privacy is our priority. Most tools process data locally in your browser, and we never store your files.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-[#F9FAFB] to-white dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A]">
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-gray-400 mb-8">
              <Link href="/" className="hover:text-[#4F46E5] transition-colors">
                Home
              </Link>
              <span>→</span>
              <span className="text-[#111827] dark:text-[#F9FAFB]">Privacy Policy</span>
            </nav>

            {/* Title */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 dark:bg-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
                <span>🔒</span>
                <span>Your Privacy Matters</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#111827] dark:text-[#F9FAFB]">
                Privacy Policy
              </h1>
              <p className="text-lg text-[#6B7280] dark:text-gray-400">
                Last updated: November 22, 2025
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155] mb-8">
                <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">Our Commitment to Privacy</h2>
                <p className="text-[#6B7280] dark:text-gray-400 leading-relaxed">
                  At Utilo, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our free online tools. Most importantly, <strong className="text-[#111827] dark:text-[#F9FAFB]">most of our tools process data entirely in your browser</strong>, meaning your files and data never leave your device.
                </p>
              </div>

              <div className="space-y-8">
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">1. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3 mt-6">1.1 Data You Provide</h3>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    When you use our tools, you may provide:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li>Text content for text processing tools</li>
                    <li>Images for image editing and conversion tools</li>
                    <li>PDF documents for PDF tools</li>
                    <li>Feedback and contact information (if you choose to contact us)</li>
                  </ul>
                  <p className="text-[#10B981] font-semibold mt-4">
                    ✓ Important: For most tools, this data is processed entirely in your browser and is never sent to our servers.
                  </p>

                  <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3 mt-6">1.2 Automatically Collected Information</h3>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    We collect limited, anonymous analytics data including:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li>Page views and tool usage statistics</li>
                    <li>Browser type and version</li>
                    <li>Device type (desktop, mobile, tablet)</li>
                    <li>General location (country level only)</li>
                    <li>Referral source</li>
                  </ul>
                  <p className="text-[#6B7280] dark:text-gray-400 mt-4">
                    This data is collected anonymously and cannot be used to identify individual users.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">2. How We Use Your Information</h2>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    We use collected information to:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li>Provide and maintain our tools</li>
                    <li>Improve tool functionality and user experience</li>
                    <li>Understand which tools are most popular</li>
                    <li>Identify and fix bugs</li>
                    <li>Respond to feedback and support requests</li>
                    <li>Prevent abuse and ensure service security</li>
                  </ul>
                  <p className="text-[#6B7280] dark:text-gray-400 mt-4">
                    <strong className="text-[#111827] dark:text-[#F9FAFB]">We never:</strong>
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2 mt-2">
                    <li>Store your uploaded files or processed data</li>
                    <li>Sell your data to third parties</li>
                    <li>Use your data for advertising purposes</li>
                    <li>Track you across other websites</li>
                    <li>Share your information with third parties (except as required by law)</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">3. Data Processing & Storage</h2>
                  
                  <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3 mt-6">3.1 Client-Side Processing</h3>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    Most Utilo tools use <strong className="text-[#111827] dark:text-[#F9FAFB]">client-side processing</strong>, which means:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li>Your data is processed entirely in your web browser</li>
                    <li>Files and text never leave your device</li>
                    <li>No data is uploaded to our servers</li>
                    <li>You maintain complete control over your data</li>
                  </ul>
                  <p className="text-[#10B981] font-semibold mt-4">
                    ✓ Tools using client-side processing include: Color Picker, Gradient Generator, Word Counter, JSON Formatter, Password Generator, UUID Generator, and most text tools.
                  </p>

                  <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3 mt-6">3.2 Server-Side Processing</h3>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    Some tools require server processing (e.g., IP Lookup, QR Code Scanner). For these tools:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li>Data is processed in real-time and immediately discarded</li>
                    <li>No files or content are stored permanently</li>
                    <li>Processing is done over secure HTTPS connections</li>
                    <li>Temporary data is deleted within seconds of processing</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">4. Cookies & Local Storage</h2>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    We use minimal cookies and browser storage for:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li><strong className="text-[#111827] dark:text-[#F9FAFB]">Theme Preference:</strong> To remember if you prefer dark or light mode</li>
                    <li><strong className="text-[#111827] dark:text-[#F9FAFB]">Analytics:</strong> Anonymous usage statistics (via Google Analytics or similar)</li>
                    <li><strong className="text-[#111827] dark:text-[#F9FAFB]">Session Data:</strong> Temporary data to keep tools functional during your visit</li>
                  </ul>
                  <p className="text-[#6B7280] dark:text-gray-400 mt-4">
                    You can clear cookies and local storage at any time through your browser settings.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">5. Third-Party Services</h2>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    We use minimal third-party services:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li><strong className="text-[#111827] dark:text-[#F9FAFB]">Hosting:</strong> Our website is hosted on secure servers</li>
                    <li><strong className="text-[#111827] dark:text-[#F9FAFB]">Analytics:</strong> We use privacy-focused analytics to understand usage patterns</li>
                  </ul>
                  <p className="text-[#6B7280] dark:text-gray-400 mt-4">
                    These services have their own privacy policies and only receive anonymized data.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">6. Your Rights</h2>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li>Use our tools without creating an account</li>
                    <li>Access Utilo without providing personal information</li>
                    <li>Clear your browser data at any time</li>
                    <li>Contact us with privacy concerns</li>
                    <li>Request information about data we may have collected</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">7. Children's Privacy</h2>
                  <p className="text-[#6B7280] dark:text-gray-400">
                    Utilo is a general-purpose tool website and does not knowingly collect information from children under 13. Our services are not directed at children, and we do not require age verification since no personal information is collected during normal use.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">8. Security</h2>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    We implement security measures including:
                  </p>
                  <ul className="list-disc pl-6 text-[#6B7280] dark:text-gray-400 space-y-2">
                    <li>HTTPS encryption for all connections</li>
                    <li>Client-side processing to minimize data exposure</li>
                    <li>Immediate deletion of any temporarily processed data</li>
                    <li>Regular security updates and monitoring</li>
                    <li>No long-term storage of user files or content</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">9. Changes to This Policy</h2>
                  <p className="text-[#6B7280] dark:text-gray-400">
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of Utilo after changes constitutes acceptance of the updated policy.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">10. Contact Us</h2>
                  <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                    If you have questions about this Privacy Policy or how we handle your data, please contact us:
                  </p>
                  <div className="bg-[#F9FAFB] dark:bg-[#0F172A] rounded-xl p-6 border border-[#E5E7EB] dark:border-[#334155]">
                    <p className="text-[#6B7280] dark:text-gray-400">
                      <strong className="text-[#111827] dark:text-[#F9FAFB]">Email:</strong> privacy@utilo.com<br/>
                      <strong className="text-[#111827] dark:text-[#F9FAFB]">Contact Form:</strong> <Link href="/contact" className="text-[#4F46E5] hover:underline">utilo.com/contact</Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Box */}
              <div className="mt-12 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Privacy Summary</h2>
                <ul className="space-y-3 text-white/95">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Most tools process data locally in your browser</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>We never store your files or personal data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>No account or sign-up required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>We don't sell your data to anyone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Anonymous analytics only - no personal tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

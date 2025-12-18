import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/app/components/header';

export const metadata: Metadata = {
  title: 'About Utilo - Free Online Tools for Everyone',
  description: 'Learn about Utilo, your go-to platform for 30+ free online tools. We provide powerful utilities for text, images, PDFs, colors, and development tasks - all completely free and secure.',
  keywords: ['about Utilo', 'free online tools', 'utility tools', 'developers tools', 'designers tools', 'no installation required'],
  openGraph: {
    title: 'About Utilo - Free Online Tools',
    description: 'Discover Utilo\'s mission to provide accessible, powerful online tools for developers, designers, and content creators worldwide.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">
            About Utilo
          </h1>
          <p className="text-xl text-[#6B7280] dark:text-gray-400 max-w-2xl mx-auto">
            Empowering creators and developers with free, powerful online tools
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">Our Mission</h2>
            <p className="text-[#6B7280] dark:text-gray-400 leading-relaxed mb-6">
              At Utilo, we believe that powerful tools should be accessible to everyone. Our mission is to provide a comprehensive collection of free online utilities that help developers, designers, content creators, and everyday users accomplish their tasks efficiently without the need for expensive software or complex installations.
            </p>
            <p className="text-[#6B7280] dark:text-gray-400 leading-relaxed">
              We are committed to maintaining the highest standards of privacy and security, ensuring that your data stays yours and your work remains private.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">30+ Free Tools</h3>
                <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                  Our growing collection includes tools for text processing, image manipulation, PDF operations, color utilities, and development helpers.
                </p>
                <ul className="text-[#6B7280] dark:text-gray-400 space-y-2">
                  <li>• Text tools: formatters, converters, counters</li>
                  <li>• Image tools: compressors, resizers, converters</li>
                  <li>• PDF tools: mergers, splitters, converters</li>
                  <li>• Color tools: pickers, generators, converters</li>
                  <li>• Developer tools: validators, generators, testers</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">No Installation Required</h3>
                <p className="text-[#6B7280] dark:text-gray-400 mb-4">
                  All our tools work directly in your browser. No downloads, no setup, no waiting - just instant access to powerful utilities.
                </p>
                <ul className="text-[#6B7280] dark:text-gray-400 space-y-2">
                  <li>• Instant access from any device</li>
                  <li>• Works on desktop and mobile</li>
                  <li>• No software installation needed</li>
                  <li>• Compatible with all modern browsers</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-2">Privacy First</h3>
                <p className="text-[#6B7280] dark:text-gray-400 text-sm">
                  Your data never leaves your device for most tools. We prioritize your privacy and security above all else.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-2">Lightning Fast</h3>
                <p className="text-[#6B7280] dark:text-gray-400 text-sm">
                  Optimized for speed and performance. Get results instantly without unnecessary delays or loading times.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💯</div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-2">Completely Free</h3>
                <p className="text-[#6B7280] dark:text-gray-400 text-sm">
                  No hidden costs, no premium tiers, no subscriptions. All tools are free forever for everyone.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">Who We Serve</h2>
            <p className="text-[#6B7280] dark:text-gray-400 leading-relaxed mb-6">
              Utilo is designed for a wide range of users, from individual creators to large teams:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#F9FAFB] dark:bg-[#1E293B] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Developers</h3>
                <p className="text-[#6B7280] dark:text-gray-400">
                  Format JSON, validate code, generate passwords, test regex patterns, and more. Essential tools for modern development workflows.
                </p>
              </div>
              <div className="bg-[#F9FAFB] dark:bg-[#1E293B] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Designers</h3>
                <p className="text-[#6B7280] dark:text-gray-400">
                  Pick colors, generate gradients, compress images, convert formats. Streamline your design process with professional-grade tools.
                </p>
              </div>
              <div className="bg-[#F9FAFB] dark:bg-[#1E293B] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Content Creators</h3>
                <p className="text-[#6B7280] dark:text-gray-400">
                  Count words, generate lorem ipsum, create QR codes, merge PDFs. Everything you need to create and manage content efficiently.
                </p>
              </div>
              <div className="bg-[#F9FAFB] dark:bg-[#1E293B] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-3">Business Users</h3>
                <p className="text-[#6B7280] dark:text-gray-400">
                  Process documents, handle data conversion, generate secure credentials. Professional tools for everyday business tasks.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">Get Started Today</h2>
            <p className="text-[#6B7280] dark:text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
              Ready to supercharge your workflow? Explore our collection of tools and discover how Utilo can help you work faster and smarter.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors"
            >
              Browse All Tools
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
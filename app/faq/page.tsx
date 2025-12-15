import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/app/components/header';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) - Utilo | Free Online Tools',
  description: 'Find answers to commonly asked questions about Utilo\'s free online tools. Learn how to use our text, image, PDF, color, and development tools effectively.',
  keywords: ['FAQ', 'frequently asked questions', 'help', 'support', 'Utilo tools', 'online tools help', 'how to use'],
  openGraph: {
    title: 'FAQ - Utilo Free Online Tools',
    description: 'Get answers to your questions about using Utilo\'s 30+ free online tools for text, images, PDFs, and more.',
    type: 'website',
  },
};

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is Utilo?',
        a: 'Utilo is a free collection of 30+ online tools designed for developers, designers, and content creators. Our tools help you work with text, images, PDFs, colors, and development tasks without any installation or sign-up required.',
      },
      {
        q: 'Is Utilo really free?',
        a: 'Yes! All tools on Utilo are completely free to use with no hidden costs, subscriptions, or premium tiers. We believe in providing accessible tools for everyone.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No account is required. You can use all tools instantly without any registration or sign-up process.',
      },
      {
        q: 'Is there a limit on usage?',
        a: 'No, there are no usage limits. You can use any tool as many times as you need, completely free.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    questions: [
      {
        q: 'Is my data safe?',
        a: 'Absolutely. Most of our tools process data entirely in your browser, meaning your files and text never leave your device. For tools that require server processing, we do not store any data permanently.',
      },
      {
        q: 'Do you store my files?',
        a: 'No, we do not store any files you upload or process. All data is processed in real-time and immediately discarded after processing.',
      },
      {
        q: 'Do you track my usage?',
        a: 'We use anonymous analytics to improve our tools and understand which features are most helpful. We do not track personal information or identifiable data.',
      },
    ],
  },
  {
    category: 'Tool Usage',
    questions: [
      {
        q: 'What file formats are supported?',
        a: 'Each tool supports specific formats optimized for its function. For example, image tools support JPG, PNG, WebP, and GIF; PDF tools support PDF documents; and text tools work with plain text and various code formats.',
      },
      {
        q: 'What is the maximum file size?',
        a: 'File size limits vary by tool but are generally generous. Most image tools support files up to 50MB, and PDF tools support documents up to 100MB. Browser-based tools depend on your device\'s available memory.',
      },
      {
        q: 'Can I use these tools on mobile?',
        a: 'Yes! All Utilo tools are fully responsive and work perfectly on smartphones and tablets. The interface adapts to your screen size for optimal usability.',
      },
      {
        q: 'Do the tools work offline?',
        a: 'Most client-side tools (like color pickers, generators, and text tools) can work offline once the page is loaded. Tools requiring file uploads or external data need an internet connection.',
      },
    ],
  },
  {
    category: 'Technical Questions',
    questions: [
      {
        q: 'Which browsers are supported?',
        a: 'Utilo works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend keeping your browser updated for the best experience.',
      },
      {
        q: 'Why isn\'t a tool working?',
        a: 'If a tool isn\'t working, try refreshing the page, clearing your browser cache, or using a different browser. Ensure JavaScript is enabled and your browser is up to date. If problems persist, contact us.',
      },
      {
        q: 'Can I integrate these tools into my website?',
        a: 'Currently, we do not offer embeddable widgets or API access. However, you can link to any tool page from your website.',
      },
      {
        q: 'Are the tools open source?',
        a: 'Some of our tools use open-source libraries and frameworks. While Utilo itself is not currently open source, we credit all dependencies and follow open-source licenses.',
      },
    ],
  },
  {
    category: 'Features & Requests',
    questions: [
      {
        q: 'Can I suggest a new tool?',
        a: 'Absolutely! We love hearing from our users. Use the Feedback button in the header to suggest new tools or features. We review all suggestions and prioritize based on community demand.',
      },
      {
        q: 'How often are new tools added?',
        a: 'We continuously work on adding new tools and improving existing ones. New tools are typically added monthly based on user feedback and emerging needs.',
      },
      {
        q: 'Can I report a bug?',
        a: 'Yes! Please use the Feedback button to report any bugs or issues. Include details about your browser, device, and what happened. We respond to all bug reports promptly.',
      },
    ],
  },
  {
    category: 'Business & Commercial Use',
    questions: [
      {
        q: 'Can I use Utilo for commercial projects?',
        a: 'Yes! You can use all Utilo tools for personal and commercial projects at no cost. We do not require attribution, though it\'s always appreciated.',
      },
      {
        q: 'Do you offer an API or bulk processing?',
        a: 'We currently do not offer API access or bulk processing features. All tools are designed for individual, real-time use through the web interface.',
      },
      {
        q: 'Can I white-label or resell these tools?',
        a: 'No, Utilo tools cannot be white-labeled, rebranded, or resold. However, you are free to use them for your own projects and link to them from your website.',
      },
    ],
  },
];

export default function FAQPage() {
  // Generate structured data for FAQ schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((section) =>
      section.questions.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-[#F9FAFB] to-white dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A]">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-gray-400 mb-8">
              <Link href="/" className="hover:text-[#4F46E5] transition-colors">
                Home
              </Link>
              <span>→</span>
              <span className="text-[#111827] dark:text-[#F9FAFB]">FAQ</span>
            </nav>

            {/* Title */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-6">
                <span>❓</span>
                <span>Help & Support</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#111827] dark:text-[#F9FAFB]">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-[#6B7280] dark:text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions about Utilo and our free online tools.
                Can't find what you're looking for? <Link href="/contact" className="text-[#4F46E5] hover:underline">Contact us</Link>.
              </p>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-12">
              {faqs.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h2 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-8 pb-4 border-b-2 border-[#4F46E5]">
                    {section.category}
                  </h2>
                  <div className="space-y-6">
                    {section.questions.map((faq, faqIndex) => (
                      <div
                        key={faqIndex}
                        className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155] hover:border-[#4F46E5] dark:hover:border-[#4F46E5] transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4 flex items-start gap-3">
                          <span className="text-[#4F46E5] flex-shrink-0">Q:</span>
                          <span>{faq.q}</span>
                        </h3>
                        <div className="pl-8 text-[#6B7280] dark:text-gray-400 leading-relaxed">
                          <p className="flex items-start gap-3">
                            <span className="text-[#10B981] font-bold flex-shrink-0">A:</span>
                            <span>{faq.a}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-20 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-3xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-xl mb-8 text-white/90">
                We're here to help! Reach out to us and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white text-[#4F46E5] font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  Contact Us
                </Link>
                <Link
                  href="/"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border-2 border-white/30"
                >
                  Browse All Tools
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

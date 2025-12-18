'use client';

import { ToolSEO } from '@/lib/seo-content';

interface SEOContentSectionProps {
  seoContent: ToolSEO;
  toolName: string;
  slug: string;
}

export function SEOContentSection({ seoContent, toolName, slug }: SEOContentSectionProps) {
  return (
    <>
      {/* SEO Content Sections - Always Visible */}
      <div className="mt-16 space-y-12 max-w-4xl mx-auto">
        {/* What Is Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            {seoContent.whatIs.title}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            {seoContent.whatIs.content}
          </p>
        </section>

        {/* Why Use Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            {seoContent.whyUse.title}
          </h2>
          <ul className="space-y-3">
            {seoContent.whyUse.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 mt-1">✓</span>
                <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            {seoContent.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoContent.features.list.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <span className="text-indigo-600 dark:text-indigo-400">•</span>
                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            {seoContent.howToUse.title}
          </h2>
          <ol className="space-y-4">
            {seoContent.howToUse.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQs Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {seoContent.faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0">
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': seoContent.schemaType,
            name: toolName,
            description: seoContent.metaDescription,
            url: `https://utilo.in/tools/${slug}`,
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1250',
            },
            author: {
              '@type': 'Organization',
              name: 'Utilo',
            },
          }),
        }}
      />
    </>
  );
}

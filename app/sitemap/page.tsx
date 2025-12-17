import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { toolsData } from '@/lib/tools-data';
import { getTranslatedToolName } from '@/lib/tools-data';

export const metadata: Metadata = {
  title: 'Sitemap - Utilo | Complete List of Free Online Tools',
  description: 'Browse our complete sitemap of 30+ free online tools organized by category. Find text tools, image tools, PDF tools, color tools, developer tools, and security tools all in one place.',
  keywords: ['sitemap', 'Utilo tools', 'online tools directory', 'free tools list', 'tool categories'],
  openGraph: {
    title: 'Sitemap - Utilo Free Online Tools',
    description: 'Complete directory of all Utilo tools organized by category. Find exactly what you need quickly.',
    type: 'website',
  },
};

const categories = [
  { key: 'text', name: 'Text Tools', description: 'Format, convert, and analyze text' },
  { key: 'image', name: 'Image Tools', description: 'Compress, resize, and convert images' },
  { key: 'pdf', name: 'PDF Tools', description: 'Work with PDF documents' },
  { key: 'color', name: 'Color Tools', description: 'Pick, convert, and generate colors' },
  { key: 'developer', name: 'Developer Tools', description: 'Essential tools for developers' },
  { key: 'security', name: 'Security Tools', description: 'Generate passwords and secure data' },
];

const mainPages = [
  { href: '/', name: 'Home', description: 'Browse all tools and categories' },
  { href: '/about', name: 'About', description: 'Learn about Utilo and our mission' },
  { href: '/faq', name: 'FAQ', description: 'Frequently asked questions' },
  { href: '/privacy', name: 'Privacy Policy', description: 'Our privacy and data protection policies' },
  { href: '/contact', name: 'Contact Us', description: 'Get in touch with our team' },
];

export default function SitemapPage() {
  const toolsByCategory = categories.map(category => ({
    ...category,
    tools: toolsData.filter(tool => tool.category === category.key),
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">
            Sitemap
          </h1>
          <p className="text-xl text-[#6B7280] dark:text-gray-400 max-w-2xl mx-auto">
            Complete directory of all Utilo tools and pages
          </p>
        </div>

        {/* Main Pages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">Main Pages</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mainPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="block p-6 bg-[#F9FAFB] dark:bg-[#1E293B] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors group"
              >
                <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#4F46E5] transition-colors mb-2">
                  {page.name}
                </h3>
                <p className="text-sm text-[#6B7280] dark:text-gray-400">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools by Category */}
        {toolsByCategory.map((category) => (
          <section key={category.key} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">
                {category.name}
              </h2>
              <p className="text-[#6B7280] dark:text-gray-400">
                {category.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="block p-4 bg-[#F9FAFB] dark:bg-[#1E293B] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#4F46E5] transition-colors mb-1 leading-tight">
                        {getTranslatedToolName(tool)}
                      </h3>
                      <p className="text-xs text-[#6B7280] dark:text-gray-400 leading-tight">
                        {tool.description}
                      </p>
                      {tool.trending && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-[#EEF2FF] dark:bg-[#1E293B] text-[#4F46E5] rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Quick Stats */}
        <section className="text-center bg-[#F9FAFB] dark:bg-[#1E293B] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">
            Tool Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-[#4F46E5] mb-1">{toolsData.length}</div>
              <div className="text-sm text-[#6B7280] dark:text-gray-400">Total Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#4F46E5] mb-1">{categories.length}</div>
              <div className="text-sm text-[#6B7280] dark:text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#4F46E5] mb-1">{toolsData.filter(t => t.trending).length}</div>
              <div className="text-sm text-[#6B7280] dark:text-gray-400">Trending Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#4F46E5] mb-1">100%</div>
              <div className="text-sm text-[#6B7280] dark:text-gray-400">Free</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
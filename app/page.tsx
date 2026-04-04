'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { toolsData, type Tool, getTranslatedToolName } from '@/lib/tools-data';
import { getTrendingTools, trackSearch } from '@/lib/analytics';

const CATEGORY_META: Record<string, { title: string; icon: string; description: string }> = {
  text: { title: 'Text Tools', icon: 'Aa', description: 'Format, clean, and transform content quickly.' },
  image: { title: 'Image Tools', icon: '◫', description: 'Resize, compress, and convert images in one place.' },
  pdf: { title: 'PDF Tools', icon: 'PDF', description: 'Merge, split, and convert PDFs with zero setup.' },
  color: { title: 'Color Tools', icon: '🎨', description: 'Pick, convert, and build color palettes quickly.' },
  developer: { title: 'Developer Tools', icon: '</>', description: 'Everyday utilities for coding workflows.' },
  security: { title: 'Security Tools', icon: '🔒', description: 'Generate secure outputs and protect your workflow.' },
  calculators: { title: 'Calculators', icon: '🧮', description: 'Solve quick calculations and everyday formulas.' },
};

export default function Home() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [trendingToolsData, setTrendingToolsData] = useState<Tool[]>([]);
  const allToolsRef = useRef<HTMLDivElement>(null);
  const searchTrackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const quickAccessTools = useMemo(
    () => [
      { name: 'JSON Formatter', slug: 'json-formatter' },
      { name: 'Image Compressor', slug: 'image-compressor' },
      { name: 'Word Counter', slug: 'word-counter' },
      { name: 'PDF Merger', slug: 'merge-pdfs' },
    ],
    []
  );

  useEffect(() => {
    const queryFromUrl = searchParams?.get('search') || '';
    const categoryFromUrl = searchParams?.get('category') || 'all';
    setSearchQuery(queryFromUrl);
    setActiveCategory(categoryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const trending = getTrendingTools(6);
    const trendingTools = trending
      .map((analytics) => toolsData.find((tool) => tool.slug === analytics.slug))
      .filter((tool): tool is Tool => tool !== undefined);

    if (trendingTools.length > 0) {
      setTrendingToolsData(trendingTools);
      return;
    }

    setTrendingToolsData(toolsData.filter((tool) => tool.trending).slice(0, 8));
  }, []);

  useEffect(() => {
    if (searchTrackingTimeoutRef.current) {
      clearTimeout(searchTrackingTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 3) {
      searchTrackingTimeoutRef.current = setTimeout(() => {
        const query = searchQuery.toLowerCase().trim();
        const matchedTools = toolsData.filter(
          (tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.slug.toLowerCase().includes(query)
        );

        if (matchedTools.length > 0) {
          trackSearch(query, matchedTools.map((tool) => tool.slug));
        }
      }, 800);
    }

    return () => {
      if (searchTrackingTimeoutRef.current) {
        clearTimeout(searchTrackingTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const filteredTools = useMemo(() => {
    let result = [...toolsData];

    if (activeCategory !== 'all') {
      result = result.filter((tool) => tool.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.slug.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const instantResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return filteredTools.slice(0, 6);
  }, [filteredTools, searchQuery]);

  const categorySections = useMemo(() => {
    const groups = Array.from(new Set(toolsData.map((tool) => tool.category)));
    return groups.map((categoryId) => ({
      categoryId,
      ...(CATEGORY_META[categoryId] || {
        title: categoryId,
        icon: '•',
        description: 'Browse useful tools in this category.',
      }),
      tools: toolsData.filter((tool) => tool.category === categoryId).slice(0, 6),
    }));
  }, []);

  const allCategories = useMemo(() => Array.from(new Set(toolsData.map((tool) => tool.category))), []);

  const mostUsedTools = useMemo(() => {
    if (trendingToolsData.length >= 4) {
      return trendingToolsData.slice(0, 8);
    }

    return toolsData.filter((tool) => tool.trending).slice(0, 8);
  }, [trendingToolsData]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F9FB]">
        <section className="utilo-section border-b border-[#E8EDF6] bg-gradient-to-b from-[#F3F6FC] to-[#F8F9FB]">
          <div className="utilo-container text-center">
            <h1 className="mx-auto max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Find the Right Tool in Seconds
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base text-[#64748B] sm:text-lg">
              30+ free tools for text, images, PDFs, and developers - no login, no clutter.
            </p>

            <div className="mx-auto mt-8 max-w-3xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search tools like JSON formatter, image compressor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 w-full rounded-xl border border-[#DBE3EF] bg-white pl-12 pr-4 text-sm text-[#0F172A] shadow-[0_8px_30px_rgba(15,23,42,0.08)] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF] sm:h-16 sm:text-base"
                  aria-label="Search tools"
                />
              </div>

              {searchQuery.trim() && (
                <div className="mt-3 overflow-hidden rounded-xl border border-[#DBE3EF] bg-white text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  {instantResults.length > 0 ? (
                    instantResults.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3 text-sm text-[#334155] transition-colors last:border-b-0 hover:bg-[#F8FAFC] sm:text-base"
                      >
                        <span className="font-medium text-[#0F172A]">{getTranslatedToolName(tool)}</span>
                        <span className="text-xs text-[#64748B] sm:text-sm">Open</span>
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-[#64748B]">No matching tools found.</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              {quickAccessTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-[#C7D2E5] bg-white px-4 py-2 text-sm font-medium text-[#334155] transition-colors hover:border-[#A5B4FC] hover:bg-[#EEF2FF] hover:text-[#3730A3] sm:w-auto"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="utilo-section bg-[#F8F9FB]">
          <div className="utilo-container">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl">Categories</h2>
              <p className="mt-2 text-sm text-[#64748B] sm:text-base">Start with a category and open any tool instantly.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {categorySections.map((section) => (
                <div key={section.categoryId} className="utilo-card utilo-card-hover p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-semibold text-[#4338CA]">
                      {section.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#0F172A]">{section.title}</h3>
                      <p className="text-xs text-[#64748B]">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {section.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-[#334155] transition-colors hover:bg-[#F3F6FC]"
                      >
                        {getTranslatedToolName(tool)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="utilo-section border-y border-[#E8EDF6] bg-white">
          <div className="utilo-container">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl">Most Used Tools</h2>
              <p className="mt-2 text-sm text-[#64748B] sm:text-base">Popular tools people use every day.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mostUsedTools.map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.slug}`} className="block h-full">
                  <article className="utilo-card utilo-card-hover h-full p-5">
                    <div className="mb-3 text-3xl">{tool.icon}</div>
                    <h3 className="text-base font-semibold text-[#0F172A]">{getTranslatedToolName(tool)}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">{tool.description}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-[#4F46E5]">Open Tool</span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="all-tools" ref={allToolsRef} className="utilo-section bg-[#F8F9FB]">
          <div className="utilo-container">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl">{searchQuery ? 'Search Results' : 'All Tools'}</h2>
                <p className="mt-2 text-sm text-[#64748B] sm:text-base">
                  {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'} available
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', ...allCategories].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveCategory(item)}
                    className={
                      activeCategory === item
                        ? 'utilo-btn-primary min-w-[90px] w-full sm:w-auto'
                        : 'utilo-btn-secondary min-w-[90px] w-full sm:w-auto'
                    }
                  >
                    {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => (
                  <Link key={tool.id} href={`/tools/${tool.slug}`} className="block h-full">
                    <article className="utilo-card utilo-card-hover h-full p-5 sm:p-6">
                      <div className="mb-3 text-3xl">{tool.icon}</div>
                      <h3 className="text-base font-semibold text-[#0F172A] sm:text-lg">{getTranslatedToolName(tool)}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">{tool.description}</p>
                      <span className="mt-4 inline-flex text-sm font-semibold text-[#4F46E5]">Open Tool</span>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="utilo-card mx-auto max-w-xl p-10 text-center">
                <h3 className="text-xl font-semibold text-[#0F172A]">No tools found</h3>
                <p className="mt-3 text-sm text-[#64748B] sm:text-base">Try another keyword or switch category.</p>
                <button type="button" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="utilo-btn-primary mt-6 w-full sm:w-auto">
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

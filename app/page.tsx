'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { Input } from '@/components/ui/input';
import { toolsData, type Tool, getTranslatedToolName } from '@/lib/tools-data';
import { getTrendingTools, trackSearch } from '@/lib/analytics';

const CATEGORY_META: Record<string, { title: string; icon: string; description: string }> = {
  text: { title: 'Text Tools', icon: 'Aa', description: 'Format, clean, and transform content quickly.' },
  image: { title: 'Image Tools', icon: '◫', description: 'Resize, compress, and convert images in one place.' },
  pdf: { title: 'PDF Tools', icon: 'PDF', description: 'Merge, split, and convert PDFs with zero setup.' },
  developer: { title: 'Developer Tools', icon: '</>', description: 'Everyday utilities for coding workflows.' },
};

export default function Home() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [trendingToolsData, setTrendingToolsData] = useState<Tool[]>([]);
  const allToolsRef = useRef<HTMLDivElement>(null);
  const searchTrackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const categorySections = useMemo(() => {
    const groups = ['text', 'image', 'pdf', 'developer'];
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
              30+ Free Online Tools for Daily Work
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base text-[#64748B] sm:text-lg">
              One clean workspace for text, image, PDF, and developer tools. No sign-up, no clutter.
            </p>

            <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-[#DBE3EF] bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-3">
              <Input
                type="text"
                placeholder="Search by tool name, type, or task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-0 bg-[#F8FAFE] shadow-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="utilo-chip">No Login Required</span>
              <span className="utilo-chip">Always Free</span>
              <span className="utilo-chip">Fast and Secure</span>
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
                {['all', 'text', 'image', 'pdf', 'developer'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveCategory(item)}
                    className={
                      activeCategory === item
                        ? 'utilo-btn-primary min-w-[90px]'
                        : 'utilo-btn-secondary min-w-[90px]'
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
                <button type="button" onClick={() => setSearchQuery('')} className="utilo-btn-primary mt-6">
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

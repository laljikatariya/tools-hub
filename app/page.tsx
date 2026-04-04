'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from './components/header';
import { Input } from '@/components/ui/input';
import { toolsData, type Tool, getTranslatedToolName } from '@/lib/tools-data';
import { getTrendingTools, trackSearch } from '@/lib/analytics';

// ⚡ Lazy load footer (below the fold)
const Footer = dynamic(() => import('./components/footer').then(mod => ({ default: mod.Footer })), {
  loading: () => null,
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingToolsData, setTrendingToolsData] = useState<Tool[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const allToolsRef = useRef<HTMLDivElement>(null);
  const searchTrackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categoryMeta: Record<'text' | 'image' | 'pdf' | 'developer', { title: string; icon: string; description: string }> = {
    text: {
      title: 'Text Tools',
      icon: 'Aa',
      description: 'Clean, convert, and format text in seconds.',
    },
    image: {
      title: 'Image Tools',
      icon: '◫',
      description: 'Compress, resize, and convert images quickly.',
    },
    pdf: {
      title: 'PDF Tools',
      icon: 'PDF',
      description: 'Merge, split, and convert PDF files instantly.',
    },
    developer: {
      title: 'Developer Tools',
      icon: '</>',
      description: 'Daily essentials for coding and debugging.',
    },
  };

  useEffect(() => {
    const trending = getTrendingTools(6);
    const trendingTools = trending
      .map(analytics => toolsData.find(tool => tool.slug === analytics.slug))
      .filter((tool): tool is Tool => tool !== undefined);

    if (trendingTools.length > 0) {
      setTrendingToolsData(trendingTools);
    } else {
      setTrendingToolsData(toolsData.filter((tool) => tool.trending).slice(0, 8));
    }
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
          const matchedSlugs = matchedTools.map(tool => tool.slug);
          trackSearch(query, matchedSlugs);
        }
      }, 1000);
    }

    return () => {
      if (searchTrackingTimeoutRef.current) {
        clearTimeout(searchTrackingTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const filteredTools = useMemo(() => {
    let result = [...toolsData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();

      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.slug.toLowerCase().includes(query)
      );

      // Sort by relevance - prioritize exact matches and name matches
      result = result.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aSlug = a.slug.toLowerCase();
        const bSlug = b.slug.toLowerCase();

        if (aName === query) return -1;
        if (bName === query) return 1;

        if (aSlug === query) return -1;
        if (bSlug === query) return 1;

        if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
        if (bName.startsWith(query) && !aName.startsWith(query)) return 1;

        if (aSlug.startsWith(query) && !bSlug.startsWith(query)) return -1;
        if (bSlug.startsWith(query) && !aSlug.startsWith(query)) return 1;

        if (aName.includes(query) && !bName.includes(query)) return -1;
        if (bName.includes(query) && !aName.includes(query)) return 1;

        return aName.localeCompare(bName);
      });
    }

    return result;
  }, [searchQuery]);

  const categorySections = useMemo(() => {
    const groups: Array<'text' | 'image' | 'pdf' | 'developer'> = ['text', 'image', 'pdf', 'developer'];
    return groups.map((categoryId) => ({
      categoryId,
      ...categoryMeta[categoryId],
      tools: toolsData.filter((tool) => tool.category === categoryId).slice(0, 6),
    }));
  }, []);

  const mostUsedTools = useMemo(() => {
    if (trendingToolsData.length >= 6) {
      return trendingToolsData.slice(0, 8);
    }

    return toolsData.filter((tool) => tool.trending).slice(0, 8);
  }, [trendingToolsData]);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredTools.length > 0) {
      allToolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F9FB] via-white to-[#F8F9FB] pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#4F46E5]/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mx-auto max-w-4xl text-3xl font-bold leading-tight text-[#101828] sm:text-4xl md:text-5xl lg:text-6xl">
              30+ Free Online Tools - All in One Place
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base text-[#475467] sm:text-lg lg:text-xl">
              Simple, fast, and no login required. Save time with tools you actually need.
            </p>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#D0D5DD] bg-white p-2 shadow-[0_8px_30px_rgba(16,24,40,0.08)] sm:p-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">⌕</span>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tools like JSON formatter, image compressor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  className="h-12 rounded-xl border-0 bg-[#F9FAFB] pl-10 pr-10 text-sm text-[#101828] shadow-none focus-visible:ring-2 focus-visible:ring-[#6366F1] sm:h-14 sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-[#667085] transition-colors hover:bg-[#EEF2FF] hover:text-[#4338CA]"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-[#475467] sm:gap-3 sm:text-sm">
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">No Login Required</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">1000% Free</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">Fast &amp; Secure</span>
            </div>

            {searchQuery && (
              <p className="mt-4 text-sm text-[#667085]">
                Showing {filteredTools.length} result{filteredTools.length === 1 ? '' : 's'} for &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </section>

        <section className="sticky top-0 z-40 border-y border-[#E4E7EC] bg-white/95 py-3 backdrop-blur md:hidden">
          <div className="mx-auto max-w-7xl px-4">
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="h-11 rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] text-sm shadow-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            />
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#101828] sm:text-3xl">Tool Categories</h2>
                <p className="mt-2 text-sm text-[#667085] sm:text-base">
                  Pick a category and jump into the tools most people use.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {categorySections.map((section) => (
                <div
                  key={section.categoryId}
                  className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-[0_6px_20px_rgba(16,24,40,0.06)]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-semibold text-[#4338CA]">
                      {section.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#101828]">{section.title}</h3>
                      <p className="text-xs text-[#667085]">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {section.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        className="block rounded-lg border border-transparent px-3 py-2 text-sm text-[#344054] transition-colors hover:border-[#E4E7EC] hover:bg-[#F9FAFB] hover:text-[#101828]"
                      >
                        {getTranslatedToolName(tool)}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/tools?category=${section.categoryId}`}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-[#4338CA] hover:text-[#3730A3]"
                  >
                    View All →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8F9FB] py-12 sm:py-16" id="trending">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#101828] mb-2">
                  Most Used Tools
                </h2>
                <p className="text-sm sm:text-base text-[#667085]">
                  Trusted daily by thousands of users looking for quick results.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mostUsedTools.map((tool, index) => {
                return (
                  <Link key={tool.id} href={`/tools/${tool.slug}`}>
                    <div className="group relative h-full rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      {index < 3 && (
                        <div className="absolute right-3 top-3">
                          <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#4338CA]">
                            Popular
                          </span>
                        </div>
                      )}

                      <div className="mb-3 text-3xl">{tool.icon}</div>
                      <h3 className="mb-2 text-base font-bold text-[#101828] group-hover:text-[#4338CA]">
                        {getTranslatedToolName(tool)}
                      </h3>

                      <p className="mb-4 line-clamp-1 text-sm text-[#667085]">
                        {tool.description}
                      </p>

                      <div className="inline-flex items-center text-sm font-semibold text-[#4338CA]">
                        Open tool →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#101828] sm:text-3xl">How It Works</h2>
            <p className="mt-2 text-sm text-[#667085] sm:text-base">Use any tool in 3 simple steps.</p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { icon: '1', title: 'Select a tool', description: 'Choose from 30+ free tools based on your task.' },
                { icon: '2', title: 'Enter your data', description: 'Paste, upload, or type your content quickly.' },
                { icon: '3', title: 'Get instant results', description: 'Download or copy output right away.' },
              ].map((step) => (
                <div key={step.title} className="rounded-2xl border border-[#EAECF0] bg-[#F9FAFB] p-5 sm:p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-bold text-[#4338CA]">
                    {step.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#101828]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#667085]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8F9FB] py-12 sm:py-16" ref={allToolsRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#101828] mb-2">
                {searchQuery ? 'Search Results' : 'Browse All Tools'}
              </h2>
              <p className="text-sm sm:text-base text-[#667085]">
                {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'} available
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {filteredTools.map((tool, index) => (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <div className={`group h-full rounded-2xl bg-white p-5 sm:p-6 border border-[#EAECF0] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    searchQuery && index === 0 
                      ? 'ring-2 ring-[#6366F1]/30' 
                      : ''
                  }`}>
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="text-3xl sm:text-4xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-[#101828] group-hover:text-[#4338CA] transition-colors">
                          {getTranslatedToolName(tool)}
                          {searchQuery && index === 0 && (
                            <span className="ml-2 rounded-full bg-[#EEF2FF] px-2 py-1 text-xs font-semibold text-[#4338CA]">
                              Best match
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>
                    <p className="line-clamp-1 text-sm sm:text-base text-[#667085] mb-3 sm:mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-[#4338CA] font-semibold text-xs sm:text-sm">
                      <span>Open tool →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#101828] mb-2 sm:mb-3">
                  No tools found
                </h3>
                <p className="text-sm sm:text-base text-[#667085] mb-6 sm:mb-8">
                  Try a different keyword like "PDF" or "JSON".
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="min-h-[44px] rounded-xl bg-[#4F46E5] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4338CA]"
                >
                  Clear search
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

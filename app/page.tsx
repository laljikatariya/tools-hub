'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Header } from './components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toolsData, type Tool, getTranslatedToolName } from '@/lib/tools-data';
import { getTrendingTools, trackSearch } from '@/lib/analytics';
import { useLanguage } from './contexts/language-context';

// ⚡ Lazy load footer (below the fold)
const Footer = dynamic(() => import('./components/footer').then(mod => ({ default: mod.Footer })), {
  loading: () => null,
});

export default function Home() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [trendingToolsData, setTrendingToolsData] = useState<Tool[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchTrackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load category from URL and trending tools on mount
  useEffect(() => {
    // Set category from URL parameter
    const categoryParam = searchParams?.get('category');
    if (categoryParam && ['text', 'image', 'pdf', 'color', 'developer', 'security'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }

    // Load trending tools
    const trending = getTrendingTools(6);
    const trendingTools = trending
      .map(analytics => toolsData.find(tool => tool.slug === analytics.slug))
      .filter((tool): tool is Tool => tool !== undefined);
    
    // If we have tracked trending tools, use them; otherwise, use the default trending tools
    if (trendingTools.length > 0) {
      setTrendingToolsData(trendingTools);
    } else {
      setTrendingToolsData(toolsData.filter((tool) => tool.trending).slice(0, 6));
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', label: t.allTools, icon: '🎯' },
    { id: 'text', label: t.text, icon: '📝' },
    { id: 'image', label: t.image, icon: '🖼️' },
    { id: 'pdf', label: t.pdf, icon: '📄' },
    { id: 'color', label: t.color, icon: '🎨' },
    { id: 'developer', label: t.developer, icon: '🔢' },
    { id: 'security', label: t.security, icon: '🔑' },
  ];

  // Debounced search tracking effect
  useEffect(() => {
    // Clear any existing timeout
    if (searchTrackingTimeoutRef.current) {
      clearTimeout(searchTrackingTimeoutRef.current);
    }

    // Only track if search query is meaningful (3+ characters)
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
      }, 1000); // Track after 1 second of no typing
    }

    // Cleanup timeout on unmount
    return () => {
      if (searchTrackingTimeoutRef.current) {
        clearTimeout(searchTrackingTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const filteredTools = useMemo(() => {
    let result = toolsData;

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((tool) => tool.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      
      // Filter tools that match the search query
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
        
        // Exact name match comes first
        if (aName === query) return -1;
        if (bName === query) return 1;
        
        // Exact slug match
        if (aSlug === query) return -1;
        if (bSlug === query) return 1;
        
        // Name starts with query
        if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
        if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
        
        // Slug starts with query
        if (aSlug.startsWith(query) && !bSlug.startsWith(query)) return -1;
        if (bSlug.startsWith(query) && !aSlug.startsWith(query)) return 1;
        
        // Name contains query (already filtered, but for ordering)
        if (aName.includes(query) && !bName.includes(query)) return -1;
        if (bName.includes(query) && !aName.includes(query)) return 1;
        
        // Default alphabetical
        return aName.localeCompare(bName);
      });
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredTools.length > 0) {
      // Scroll to results section
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section - Minimal & Clean */}
        <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-white via-[#F9FAFB] to-white dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <span className="text-base sm:text-lg">✨</span>
              <span>{t.freeOnlineTools}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-[#111827] dark:text-[#F9FAFB] leading-tight px-2">
              {t.everythingYouNeed}
              <br />
              <span className="text-[#4F46E5]">{t.inOnePlace}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#6B7280] dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto font-normal px-4">
              {t.powerfulOnlineTools}
              <br className="hidden sm:block" />
              {t.fastSecureFree}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <button
                onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base min-h-[48px] touch-manipulation"
              >
                {t.browseAllTools} →
              </button>
              <button
                onClick={() => searchInputRef.current?.focus()}
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F9FAFB] font-semibold rounded-xl border-2 border-[#E5E7EB] dark:border-[#334155] hover:border-[#4F46E5] dark:hover:border-[#4F46E5] transition-all duration-200 active:scale-95 text-sm sm:text-base min-h-[48px] touch-manipulation"
              >
                🔍 {t.searchTools}
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-4">
              <div className="relative flex gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t.trySearch}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base rounded-xl border-2 border-[#E5E7EB] dark:border-[#334155] focus:border-[#4F46E5] dark:focus:border-[#4F46E5] bg-white dark:bg-[#1E293B] shadow-sm"
                  />
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl">
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827] dark:hover:text-[#F9FAFB] text-lg sm:text-xl min-w-[24px] min-h-[24px] touch-manipulation"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {searchQuery && (
                <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 mt-3">
                  {t.foundTools} {filteredTools.length} {filteredTools.length !== 1 ? t.tools : t.tool} {t.matching} "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-6 sm:py-8 border-y border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 sm:pb-0 scrollbar-hide lg:flex-wrap lg:justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => {
                    const newCategory = category.id === selectedCategory ? null : category.id;
                    setSelectedCategory(newCategory);
                    if (newCategory && newCategory !== 'all') {
                      setTimeout(() => {
                        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                  }}
                  className={`flex-shrink-0 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base min-h-[44px] touch-manipulation whitespace-nowrap ${
                    selectedCategory === category.id || (!selectedCategory && category.id === 'all')
                      ? 'bg-[#4F46E5] text-white shadow-md'
                      : 'bg-gray-50 dark:bg-[#1E293B] text-[#6B7280] hover:text-[#111827] dark:hover:text-[#F9FAFB] border border-[#E5E7EB] dark:border-[#334155]'
                  }`}
                >
                  <span className="mr-1.5 sm:mr-2 text-base sm:text-lg">{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Tools */}
        <section id="trending" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">
                  🔥 {t.trendingTools}
                </h2>
                <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-400">
                  {t.popularToolsUsage}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {trendingToolsData.map((tool, index) => {
                return (
                  <Link key={tool.id} href={`/tools/${tool.slug}`}>
                    <div className="group relative bg-white dark:bg-[#1E293B] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-[#334155] hover:border-[#4F46E5] dark:hover:border-[#4F46E5] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-98 touch-manipulation">
                      {/* Trending Badge */}
                      {index < 3 && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                          <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            #{index + 1} HOT
                          </span>
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{tool.icon}</div>
                      
                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#4F46E5] dark:group-hover:text-[#4F46E5] transition-colors">
                        {getTranslatedToolName(tool)}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                        {tool.description}
                      </p>
                      
                      {/* CTA */}
                      <div className="flex items-center text-[#4F46E5] font-semibold text-sm sm:text-base group-hover:gap-2 transition-all">
                        <span>{t.tryNow}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Tools */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#F9FAFB] dark:bg-[#0F172A]" ref={resultsRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">
                {searchQuery ? `🔍 ${t.searchResults}` : t.allTools}
              </h2>
              <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-400">
                {filteredTools.length} {filteredTools.length !== 1 ? t.tools : t.tool} {t.available}
              </p>
            </div>

            {searchQuery && filteredTools.length > 0 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 border border-[#4F46E5]/30 rounded-2xl">
                <p className="text-sm sm:text-base text-[#4F46E5] dark:text-[#818CF8]">
                  <strong>💡 Tip:</strong> {t.tipSortedByRelevance}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {filteredTools.map((tool, index) => (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <div className={`group bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-98 touch-manipulation ${
                    searchQuery && index === 0 
                      ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/30 dark:ring-[#4F46E5]/50' 
                      : 'border-[#E5E7EB] dark:border-[#334155] hover:border-[#4F46E5] dark:hover:border-[#4F46E5]'
                  }`}>
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="text-3xl sm:text-4xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#4F46E5] dark:group-hover:text-[#4F46E5] transition-colors">
                          {getTranslatedToolName(tool)}
                          {searchQuery && index === 0 && (
                            <span className="ml-2 text-xs bg-[#4F46E5] text-white px-2 py-1 rounded-full font-semibold">
                              {t.bestMatch}
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-[#4F46E5] font-semibold text-xs sm:text-sm group-hover:gap-1 transition-all">
                      <span>{t.openTool}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-2 sm:mb-3">
                  {t.noToolsFound}
                </h3>
                <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-400 mb-6 sm:mb-8">
                  {t.tryDifferentSearch}
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium px-6 py-3 rounded-xl min-h-[44px]"
                >
                  {t.clearFilters}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Footer - Lazy loaded */}
        <Footer />
      </main>
    </>
  );
}

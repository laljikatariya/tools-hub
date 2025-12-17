'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolsData } from '@/lib/tools-data';
import { useState } from 'react';
import { Menu, X, Home, TrendingUp, ChevronDown } from 'lucide-react';

const categories = [
  { id: 'text', label: 'Text Tools', icon: '📝' },
  { id: 'image', label: 'Image Tools', icon: '🖼️' },
  { id: 'pdf', label: 'PDF Tools', icon: '📄' },
  { id: 'color', label: 'Color Tools', icon: '🎨' },
  { id: 'developer', label: 'Developer Tools', icon: '💻' },
  { id: 'security', label: 'Security Tools', icon: '🔒' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getToolsByCategory = (categoryId: string) => {
    return toolsData.filter(tool => tool.category === categoryId);
  };

  const isToolActive = (slug: string) => {
    return pathname === `/tools/${slug}`;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] shadow-lg hover:shadow-xl transition-all touch-manipulation"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-[#111827] dark:text-[#F9FAFB]" />
        ) : (
          <Menu className="w-6 h-6 text-[#111827] dark:text-[#F9FAFB]" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          w-72 sm:w-80 lg:w-64 h-screen
          bg-white dark:bg-[#0F172A]
          border-r border-[#E5E7EB] dark:border-[#1E293B]
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 sm:p-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 mb-6 sm:mb-8"
            onClick={closeMobileMenu}
          >
            <span className="text-2xl sm:text-3xl">🧰</span>
            <span className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Utilo</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1.5 sm:space-y-2">
            {categories.map((category) => {
              const tools = getToolsByCategory(category.id);
              const isExpanded = expandedCategory === category.id;
              const hasActiveTool = tools.some(tool => isToolActive(tool.slug));

              return (
                <div key={category.id}>
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-left min-h-[44px] ${
                      isExpanded || hasActiveTool
                        ? 'bg-[#4F46E5]/10 text-[#4F46E5] dark:bg-[#4F46E5]/20'
                        : 'text-[#6B7280] hover:bg-gray-50 dark:hover:bg-[#1E293B] active:scale-98'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="text-lg sm:text-xl">{category.icon}</span>
                      <span className="font-medium text-sm sm:text-base">{category.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Tools under category */}
                  {isExpanded && (
                    <div className="mt-1 ml-3 sm:ml-4 space-y-0.5 sm:space-y-1">
                      {tools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          onClick={closeMobileMenu}
                          className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 min-h-[40px] flex items-center ${
                            isToolActive(tool.slug)
                              ? 'bg-[#4F46E5] text-white font-medium'
                              : 'text-[#6B7280] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-[#111827] dark:hover:text-[#F9FAFB] active:scale-98'
                          }`}
                        >
                          <span className="mr-2 text-base">{tool.icon}</span>
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-6 sm:mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1E293B]">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3 px-2">
              Quick Actions
            </p>
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-lg text-sm sm:text-base text-[#6B7280] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-all min-h-[40px] active:scale-98"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/#trending"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-lg text-sm sm:text-base text-[#6B7280] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-all min-h-[40px] active:scale-98"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { toolsData } from '@/lib/tools-data';

export function Header() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const router = useRouter();

  const categories = useMemo(() => {
    const unique = Array.from(new Set(toolsData.map((tool) => tool.category)));
    return unique.sort();
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      router.push('/');
      return;
    }
    router.push(`/?search=${encodeURIComponent(trimmed)}`);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (value === 'all') {
      router.push('/');
      return;
    }
    router.push(`/?category=${encodeURIComponent(value)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#DBE3EF] bg-white/95 backdrop-blur">
      <div className="utilo-container">
        <div className="flex h-16 items-center gap-3 sm:gap-4">
          <Link href="/" className="flex min-w-[104px] items-center gap-2">
            <span className="text-xl">▣</span>
            <span className="truncate text-xl font-semibold text-[#0F172A]">Utilo</span>
          </Link>

          <div className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search tools..."
              className="utilo-input pl-10"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden sm:block">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="h-11 min-w-[150px] appearance-none rounded-xl border border-[#DBE3EF] bg-white px-3 pr-8 text-sm font-medium text-[#334155] outline-none transition-colors focus:ring-2 focus:ring-[#4F46E5]"
                aria-label="Select category"
              >
                <option value="all">Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            </div>

            <Link
              href="/#all-tools"
              className="inline-flex h-11 items-center rounded-xl border border-[#C7D2E5] bg-white px-4 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F3F6FC]"
            >
              All Tools
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


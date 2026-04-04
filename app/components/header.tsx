'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'All Tools', href: '/#all-tools' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#DBE3EF] bg-white/95 backdrop-blur-md">
      <div className="utilo-container">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex min-w-[104px] items-center gap-2">
            <Image src="/logo.svg" alt="Utilo logo" width={28} height={28} className="h-7 w-7 rounded-md" priority />
            <span className="truncate text-xl font-semibold text-[#0F172A]">Utilo</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#334155] transition-colors hover:bg-[#EEF2FF] hover:text-[#3730A3]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DBE3EF] text-[#334155] transition-colors hover:bg-[#F3F6FC] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="grid gap-1 border-t border-[#E8EDF6] py-3 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#334155] transition-colors hover:bg-[#EEF2FF] hover:text-[#3730A3]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}


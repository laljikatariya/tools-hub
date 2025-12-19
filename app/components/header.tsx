'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
// import { LanguageSelector } from './language-selector';
import { FeedbackModal } from './feedback-modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/app/contexts/language-context';

export function Header() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] dark:border-[#1E293B] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 group min-w-0 flex-shrink">
            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">🧰</span>
            <span className="text-lg sm:text-xl font-bold text-[#111827] dark:text-[#F9FAFB] truncate">Utilo</span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors"
            >
              About Us
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <Button
              onClick={() => setIsFeedbackOpen(true)}
              variant="outline"
              size="sm"
              className="hidden md:inline-flex items-center gap-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 min-h-[40px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden lg:inline">{t.feedback}</span>
            </Button>
            <Button
              onClick={() => setIsFeedbackOpen(true)}
              variant="outline"
              size="sm"
              className="md:hidden p-2 min-w-[40px] min-h-[40px] border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              aria-label="Feedback"
            >
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </Button>
            {/* LanguageSelector removed */}
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </header>
  );
}


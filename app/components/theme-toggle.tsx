'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 touch-manipulation"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
      )}
    </button>
  );
}

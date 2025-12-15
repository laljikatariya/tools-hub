'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './contexts/language-context';
import { measurePerformance, enablePerformanceMode, prefetchOnHover } from '@/lib/performance';

export function RootProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ⚡ Enable performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      measurePerformance();
    }
    
    // ⚡ Enable performance mode for low-end devices
    enablePerformanceMode();
    
    // ⚡ Prefetch links on hover for faster navigation
    prefetchOnHover();
  }, []);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange // ⚡ Prevent flash during theme change
    >
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}

'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';

export function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#F9FAFB] dark:bg-[#0F172A] w-full lg:ml-0">
        {children}
      </main>
    </div>
  );
}

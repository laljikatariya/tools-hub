'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toolsData } from '@/lib/tools-data';

export function ToolPageWrapper({ 
  slug, 
  children 
}: { 
  slug: string; 
  children: React.ReactNode;
}) {
  const tool = toolsData.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#0F172A]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <Link href="/" className="text-[#4F46E5] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Minimal Sidebar */}
      <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-[#0F172A] border-r border-[#E5E7EB] dark:border-[#1E293B] overflow-y-auto hidden lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🧰</span>
            <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Utilo</span>
          </Link>
          
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-[#6B7280] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F9FAFB] dark:bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-[#6B7280] hover:text-[#4F46E5] transition-colors">
              Home
            </Link>
            <span className="text-[#6B7280]">/</span>
            <Link href="/" className="text-[#6B7280] hover:text-[#4F46E5] transition-colors">
              Tools
            </Link>
            <span className="text-[#6B7280]">/</span>
            <span className="text-[#111827] dark:text-[#F9FAFB] font-medium">{tool.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{tool.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">
                  {tool.name}
                </h1>
                <p className="text-lg text-[#6B7280] dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tool Content */}
          {children}
        </div>
      </main>
    </div>
  );
}

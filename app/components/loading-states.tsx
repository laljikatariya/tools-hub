// ⚡ Loading and Skeleton Components for Better Perceived Performance

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4F46E5] border-t-transparent"></div>
        <p className="mt-4 text-[#6B7280] dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#334155] animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] dark:border-[#1E293B] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function ContentSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="pt-16 pb-28 bg-gradient-to-b from-white via-[#F9FAFB] to-white dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-6"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-12"></div>
        <div className="flex justify-center gap-4">
          <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl w-48"></div>
          <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl w-48"></div>
        </div>
      </div>
    </section>
  );
}

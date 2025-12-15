'use client';

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#0F172A] px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📴</div>
        <h1 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">
          You're Offline
        </h1>
        <p className="text-lg text-[#6B7280] dark:text-gray-400 mb-8">
          It looks like you've lost your internet connection. Some features may not be available.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

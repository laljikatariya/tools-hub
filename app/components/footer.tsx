'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts/language-context';
import { getToolName } from '@/lib/translations';
import { toolsData } from '@/lib/tools-data';

const CATEGORY_META: Record<string, { label: string }> = {
  text: { label: 'Text Tools' },
  image: { label: 'Image Tools' },
  pdf: { label: 'PDF Tools' },
  color: { label: 'Color Tools' },
  developer: { label: 'Developer Tools' },
  security: { label: 'Security Tools' },
  calculators: { label: 'Calculators' },
};

function formatCategoryLabel(categoryId: string) {
  return categoryId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function Footer() {
  const { t } = useLanguage();
  const categories = Array.from(new Set(toolsData.map((tool) => tool.category))).map((categoryId) => ({
    id: categoryId,
    label: CATEGORY_META[categoryId]?.label || formatCategoryLabel(categoryId),
  }));
  const latestTools = [...toolsData].sort((a, b) => b.id - a.id).slice(0, 4);
  const trendingTools = toolsData.filter((tool) => tool.trending);
  const popularTools = Array.from(
    new Map([...latestTools, ...trendingTools].map((tool) => [tool.slug, tool])).values()
  ).slice(0, 4);

  return (
    <footer className="border-t border-[#DBE3EF] bg-[#F3F6FC] py-12">
      <div className="utilo-container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image src="/logo.svg" alt="Utilo logo" width={28} height={28} className="h-7 w-7 rounded-md" />
              <span className="text-xl font-semibold text-[#0F172A]">Utilo</span>
            </div>
            <p className="text-sm leading-relaxed text-[#64748B] sm:text-base">
              {t.powerfulOnlineTools}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-[#0F172A] sm:text-lg">{t.categories}</h3>
            <ul className="space-y-2 text-sm text-[#64748B] sm:text-base">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/?category=${category.id}`} className="transition-colors hover:text-[#4F46E5]">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-[#0F172A] sm:text-lg">{t.popularTools}</h3>
            <ul className="space-y-2 text-sm text-[#64748B] sm:text-base">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="transition-colors hover:text-[#4F46E5]">
                    {getToolName(tool.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-[#0F172A] sm:text-lg">Contact / Links</h3>
            <ul className="space-y-2 text-sm text-[#64748B] sm:text-base">
              <li><Link href="/about" className="transition-colors hover:text-[#4F46E5]">{t.about}</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-[#4F46E5]">{t.contactUs}</Link></li>
              <li><Link href="/faq" className="transition-colors hover:text-[#4F46E5]">{t.faq}</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-[#4F46E5]">{t.privacyPolicy}</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-[#4F46E5]">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#DBE3EF] pt-6 text-center">
          <p className="text-sm text-[#64748B] sm:text-base">
            &copy; 2025 Utilo. {t.allRightsReserved} {t.madeWithLove}
          </p>
        </div>
      </div>
    </footer>
  );
}

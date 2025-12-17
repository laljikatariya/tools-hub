'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/contexts/language-context';
import { getToolName } from '@/lib/translations';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#E5E7EB] dark:border-[#1E293B] py-12 sm:py-16 bg-white dark:bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl sm:text-3xl">🧰</span>
              <span className="text-lg sm:text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">Utilo</span>
            </div>
            <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-400 leading-relaxed">
              {t.powerfulOnlineTools}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827] dark:text-[#F9FAFB] mb-3 sm:mb-4">{t.categories}</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-[#6B7280] dark:text-gray-400">
              <li><Link href="/?category=text" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.textTools}</Link></li>
              <li><Link href="/?category=image" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.imageTools}</Link></li>
              <li><Link href="/?category=pdf" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.pdfTools}</Link></li>
              <li><Link href="/?category=color" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.colorTools}</Link></li>
              <li><Link href="/?category=developer" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.developerTools}</Link></li>
              <li><Link href="/?category=security" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.securityTools}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827] dark:text-[#F9FAFB] mb-3 sm:mb-4">{t.popularTools}</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-[#6B7280] dark:text-gray-400">
              <li><Link href="/tools/json-formatter" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{getToolName('json-formatter')}</Link></li>
              <li><Link href="/tools/password-generator" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{getToolName('password-generator')}</Link></li>
              <li><Link href="/tools/qr-code-generator" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{getToolName('qr-code-generator')}</Link></li>
              <li><Link href="/tools/image-compressor" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{getToolName('image-compressor')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827] dark:text-[#F9FAFB] mb-3 sm:mb-4">{t.support}</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-[#6B7280] dark:text-gray-400">
              <li><Link href="/faq" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.faq}</Link></li>
              <li><Link href="/privacy" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.privacyPolicy}</Link></li>
              <li><Link href="/contact" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.contactUs}</Link></li>
              <li><Link href="/about" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.about}</Link></li>
              <li><Link href="/sitemap" className="hover:text-[#4F46E5] transition-colors inline-block py-1">{t.sitemap}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#E5E7EB] dark:border-[#1E293B] pt-6 sm:pt-8 text-center">
          <p className="text-sm sm:text-base text-[#6B7280] dark:text-gray-400">
            &copy; 2025 Utilo. {t.allRightsReserved} {t.madeWithLove}
          </p>
        </div>
      </div>
    </footer>
  );
}

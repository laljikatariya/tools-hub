'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/contexts/language-context';
import { getToolName } from '@/lib/translations';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#DBE3EF] bg-[#F3F6FC] py-12">
      <div className="utilo-container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">▣</span>
              <span className="text-xl font-semibold text-[#0F172A]">Utilo</span>
            </div>
            <p className="text-sm leading-relaxed text-[#64748B] sm:text-base">
              {t.powerfulOnlineTools}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-[#0F172A] sm:text-lg">{t.categories}</h3>
            <ul className="space-y-2 text-sm text-[#64748B] sm:text-base">
              <li><Link href="/?category=text" className="transition-colors hover:text-[#4F46E5]">{t.textTools}</Link></li>
              <li><Link href="/?category=image" className="transition-colors hover:text-[#4F46E5]">{t.imageTools}</Link></li>
              <li><Link href="/?category=pdf" className="transition-colors hover:text-[#4F46E5]">{t.pdfTools}</Link></li>
              <li><Link href="/?category=developer" className="transition-colors hover:text-[#4F46E5]">{t.developerTools}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-[#0F172A] sm:text-lg">{t.popularTools}</h3>
            <ul className="space-y-2 text-sm text-[#64748B] sm:text-base">
              <li><Link href="/tools/json-formatter" className="transition-colors hover:text-[#4F46E5]">{getToolName('json-formatter')}</Link></li>
              <li><Link href="/tools/password-generator" className="transition-colors hover:text-[#4F46E5]">{getToolName('password-generator')}</Link></li>
              <li><Link href="/tools/qr-code-generator" className="transition-colors hover:text-[#4F46E5]">{getToolName('qr-code-generator')}</Link></li>
              <li><Link href="/tools/image-compressor" className="transition-colors hover:text-[#4F46E5]">{getToolName('image-compressor')}</Link></li>
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

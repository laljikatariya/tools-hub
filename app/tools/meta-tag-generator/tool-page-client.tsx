'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy } from 'lucide-react';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSEOContent } from '@/lib/seo-content';
import { getToolName } from '@/lib/translations';

type RobotsValue = 'index, follow' | 'noindex, nofollow';

type MetaForm = {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  author: string;
  robots: RobotsValue;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
};

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

const initialForm: MetaForm = {
  pageTitle: '',
  metaDescription: '',
  keywords: '',
  author: '',
  robots: 'index, follow',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
};

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function titleToPreviewPath(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (!slug) {
    return 'https://example.com/';
  }

  return `https://example.com/${slug}`;
}

export default function MetaTagGeneratorClient() {
  const [form, setForm] = useState<MetaForm>(initialForm);
  const [copied, setCopied] = useState(false);
  const seoContent = getSEOContent('meta-tag-generator');
  const toolName = getToolName('meta-tag-generator');

  const generatedTags = useMemo(() => {
    const tags: string[] = [];

    if (form.pageTitle.trim()) {
      tags.push(`<title>${form.pageTitle.trim()}</title>`);
    }

    if (form.metaDescription.trim()) {
      tags.push(`<meta name="description" content="${escapeAttribute(form.metaDescription.trim())}" />`);
    }

    if (form.keywords.trim()) {
      tags.push(`<meta name="keywords" content="${escapeAttribute(form.keywords.trim())}" />`);
    }

    if (form.author.trim()) {
      tags.push(`<meta name="author" content="${escapeAttribute(form.author.trim())}" />`);
    }

    tags.push(`<meta name="robots" content="${form.robots}" />`);

    const ogTitle = form.ogTitle.trim() || form.pageTitle.trim();
    const ogDescription = form.ogDescription.trim() || form.metaDescription.trim();

    if (ogTitle) {
      tags.push(`<meta property="og:title" content="${escapeAttribute(ogTitle)}" />`);
    }
    if (ogDescription) {
      tags.push(`<meta property="og:description" content="${escapeAttribute(ogDescription)}" />`);
    }
    if (form.ogImage.trim()) {
      tags.push(`<meta property="og:image" content="${escapeAttribute(form.ogImage.trim())}" />`);
    }

    const twitterTitle = form.twitterTitle.trim() || form.pageTitle.trim();
    const twitterDescription = form.twitterDescription.trim() || form.metaDescription.trim();

    tags.push('<meta name="twitter:card" content="summary_large_image" />');

    if (twitterTitle) {
      tags.push(`<meta name="twitter:title" content="${escapeAttribute(twitterTitle)}" />`);
    }
    if (twitterDescription) {
      tags.push(`<meta name="twitter:description" content="${escapeAttribute(twitterDescription)}" />`);
    }
    if (form.twitterImage.trim()) {
      tags.push(`<meta name="twitter:image" content="${escapeAttribute(form.twitterImage.trim())}" />`);
    }

    return tags.join('\n');
  }, [form]);

  const previewTitle = form.pageTitle.trim() || 'Your page title appears here';
  const previewDescription = form.metaDescription.trim() || 'Your meta description appears here so users can quickly understand your page.';
  const previewUrl = titleToPreviewPath(form.pageTitle);

  const handleChange = <K extends keyof MetaForm>(key: K, value: MetaForm[K]) => {
    setCopied(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = async () => {
    if (!generatedTags.trim()) {
      return;
    }

    await navigator.clipboard.writeText(generatedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F9FB]">
        <div className="utilo-container py-6 sm:py-10">
          <Link href="/" className="mb-6 inline-flex min-h-[40px] items-center gap-2 text-[#4F46E5] hover:text-[#4338CA] sm:mb-8">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Tools</span>
          </Link>

          <section className="utilo-card p-4 sm:p-6 lg:p-8">
            <header className="mb-6 border-b border-[#E8EDF6] pb-5">
              <h1 className="text-2xl font-semibold sm:text-3xl">Meta Tag Generator</h1>
              <p className="mt-3 text-sm text-[#64748B] sm:text-base">
                Generate SEO-friendly meta tags for your website with live preview.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2 shadow-none">
                <CardHeader>
                  <CardTitle>Form</CardTitle>
                  <CardDescription>Fill in details and your tags update instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-[#334155]">Page Title</label>
                      <input
                        value={form.pageTitle}
                        onChange={(e) => handleChange('pageTitle', e.target.value)}
                        maxLength={TITLE_LIMIT}
                        placeholder="Example: Ultimate JavaScript SEO Guide"
                        className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                      />
                      <p className="text-xs text-[#64748B]">{form.pageTitle.length}/{TITLE_LIMIT} characters</p>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-[#334155]">Meta Description</label>
                      <textarea
                        value={form.metaDescription}
                        onChange={(e) => handleChange('metaDescription', e.target.value)}
                        maxLength={DESCRIPTION_LIMIT}
                        rows={4}
                        placeholder="Write a concise summary of your page content."
                        className="w-full resize-none rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                      />
                      <p className="text-xs text-[#64748B]">{form.metaDescription.length}/{DESCRIPTION_LIMIT} characters</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#334155]">Keywords (comma separated)</label>
                      <input
                        value={form.keywords}
                        onChange={(e) => handleChange('keywords', e.target.value)}
                        placeholder="seo, meta tags, utilo"
                        className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#334155]">Author name</label>
                      <input
                        value={form.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#334155]">Robots</label>
                      <select
                        value={form.robots}
                        onChange={(e) => handleChange('robots', e.target.value as RobotsValue)}
                        className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                      >
                        <option value="index, follow">index</option>
                        <option value="noindex, nofollow">noindex</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E2E8F4] bg-[#F7FAFF] p-4 sm:p-5">
                    <h2 className="text-lg font-semibold text-[#0F172A]">Social Meta</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Open Graph Title</label>
                        <input
                          value={form.ogTitle}
                          onChange={(e) => handleChange('ogTitle', e.target.value)}
                          placeholder="Social title"
                          className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Twitter Title</label>
                        <input
                          value={form.twitterTitle}
                          onChange={(e) => handleChange('twitterTitle', e.target.value)}
                          placeholder="Twitter title"
                          className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Open Graph Description</label>
                        <textarea
                          value={form.ogDescription}
                          onChange={(e) => handleChange('ogDescription', e.target.value)}
                          rows={3}
                          placeholder="Social description"
                          className="w-full resize-none rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Twitter Description</label>
                        <textarea
                          value={form.twitterDescription}
                          onChange={(e) => handleChange('twitterDescription', e.target.value)}
                          rows={3}
                          placeholder="Twitter description"
                          className="w-full resize-none rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Open Graph Image URL</label>
                        <input
                          value={form.ogImage}
                          onChange={(e) => handleChange('ogImage', e.target.value)}
                          placeholder="https://example.com/og-image.jpg"
                          className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#334155]">Twitter Image</label>
                        <input
                          value={form.twitterImage}
                          onChange={(e) => handleChange('twitterImage', e.target.value)}
                          placeholder="https://example.com/twitter-image.jpg"
                          className="w-full rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-[#4F46E5]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>Google search-style snippet.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl border border-[#E2E8F4] bg-white p-4">
                      <p className="truncate text-lg leading-6 text-[#1A0DAB]">{previewTitle}</p>
                      <p className="mt-1 truncate text-xs text-[#0F7A2A]">{previewUrl}</p>
                      <p className="mt-2 text-sm text-[#4B5563]">{previewDescription}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Generated HTML Meta Tags</CardTitle>
                    <CardDescription>Copy and paste into your page head.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <pre className="max-h-[360px] overflow-auto rounded-xl border border-[#E2E8F4] bg-[#F8FAFE] p-3 text-xs leading-6 text-[#0F172A] sm:text-sm">
{generatedTags || '<!-- Your generated tags will appear here -->'}
                    </pre>
                    <Button onClick={handleCopy} className="w-full" disabled={!generatedTags.trim()}>
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? 'Copied' : 'Copy Tags'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {seoContent && (
            <SEOContentSection seoContent={seoContent} toolName={toolName} slug="meta-tag-generator" />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

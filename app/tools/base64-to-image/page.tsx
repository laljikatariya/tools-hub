'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';

export default function Base64ToImagePage() {
  const seoContent = getSEOContent('base64-to-image');
  const [base64Input, setBase64Input] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setError('');
      // Check if input already has data:image prefix
      const base64 = base64Input.trim();
      if (base64.startsWith('data:image')) {
        setImagePreview(base64);
      } else {
        // Assume it's a raw base64 string, add default prefix
        setImagePreview(`data:image/png;base64,${base64}`);
      }
    } catch (err) {
      setError('Invalid Base64 string');
      setImagePreview('');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imagePreview;
    link.download = 'converted-image.png';
    link.click();
  };

  const handlePaste = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      setBase64Input(pastedText);
    } catch (error) {
      alert('Failed to paste from clipboard. Please make sure you have granted clipboard permissions.');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>🔄 Base64 to Image</CardTitle>
                <CardDescription>Convert Base64 strings back to images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder="Paste your Base64 string here..."
                  className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-xs font-mono"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button onClick={handlePaste} variant="secondary" className="flex-1">
                      Paste
                    </Button>
                    <Button onClick={() => setBase64Input('')} variant="secondary" className="flex-1">
                      Clear
                    </Button>
                  </div>
                  <Button onClick={handleConvert} className="w-full">
                    Convert
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
                <CardDescription>Download or view the converted image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-64 border border-slate-300 dark:border-slate-600 rounded-lg p-4 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Converted" className="max-w-full h-auto rounded" />
                  ) : (
                    <p className="text-slate-400">Image preview will appear here</p>
                  )}
                </div>
                <Button onClick={handleDownload} className="w-full" disabled={!imagePreview}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="Base64 to Image"
              slug="base64-to-image"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

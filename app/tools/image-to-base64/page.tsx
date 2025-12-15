'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Upload, Check } from 'lucide-react';

export default function ImageToBase64Page() {
  const seoContent = getSEOContent('image-to-base64');
  const [base64String, setBase64String] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64String);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBase64String(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
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
                <CardTitle>🔄 Image to Base64</CardTitle>
                <CardDescription>Convert images to Base64 encoding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                      isDragging ? 'text-indigo-500' : 'text-slate-400'
                    }`} />
                    <p className={`text-sm transition-colors ${
                      isDragging
                        ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>

                {preview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Base64 Output</CardTitle>
                <CardDescription>Copy and use the encoded string</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={base64String}
                  readOnly
                  placeholder="Base64 string will appear here..."
                  className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none resize-none text-xs font-mono"
                />
                <Button onClick={handleCopy} className="w-full" disabled={!base64String}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Base64
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="Image to Base64"
              slug="image-to-base64"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

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
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PdfToTextPage() {
  const seoContent = getSEOContent('pdf-to-text');
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit. Please choose a smaller PDF.');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setError('');
    setExtractedText('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        text += `\n--- Page ${i} ---\n${pageText}\n`;
      }
      
      setExtractedText(text.trim());
    } catch (err) {
      setError('Failed to extract text from PDF: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
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
      processFile(files[0]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.pdf', '.txt');
    link.click();
    URL.revokeObjectURL(url);
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
                <CardTitle>📄 PDF to Text</CardTitle>
                <CardDescription>Extract text from PDF documents</CardDescription>
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
                    accept=".pdf"
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
                      {isDragging ? 'Drop PDF here' : 'Click to upload or drag and drop PDF file'}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">PDF up to 10MB</p>
                  </label>
                </div>

                {fileName && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{fileName}</p>
                  </div>
                )}

                {loading && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Extracting text from PDF...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>Copy or download the extracted text</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={extractedText}
                  readOnly
                  placeholder="Extracted text will appear here..."
                  className="w-full h-96 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCopy} className="flex-1" disabled={!extractedText || loading}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </>
                    )}
                  </Button>
                  <Button onClick={handleDownload} className="flex-1" disabled={!extractedText || loading}>
                    Download as TXT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="PDF to Text"
              slug="pdf-to-text"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

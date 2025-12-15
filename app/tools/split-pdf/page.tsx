'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function SplitPdfPage() {
  const seoContent = getSEOContent('split-pdf');
  const [pdfFile, setPdfFile] = useState<{ name: string; data: ArrayBuffer } | null>(null);
  const [pageRange, setPageRange] = useState<string>('');
  const [splitOption, setSplitOption] = useState<'all' | 'range'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 10MB limit. Please choose a smaller PDF.');
        e.target.value = '';
        return;
      }

      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a valid PDF file.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        setPdfFile({ name: file.name, data: arrayBuffer });
        
        // Get page count
        try {
          const pdf = await PDFDocument.load(arrayBuffer);
          setPageCount(pdf.getPageCount());
        } catch (error) {
          alert('Error reading PDF: ' + (error as Error).message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const parsePageRange = (range: string, maxPages: number): number[] => {
    const pages: number[] = [];
    const parts = range.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= end && start > 0 && end <= maxPages) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const page = parseInt(part);
        if (page > 0 && page <= maxPages && !pages.includes(page)) {
          pages.push(page);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!pdfFile) return;
    
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.load(pdfFile.data);
      const totalPages = pdfDoc.getPageCount();
      
      if (splitOption === 'all') {
        // Split each page into separate PDF
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${pdfFile.name.replace('.pdf', '')}-page-${i + 1}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
        }
        alert(`Successfully split into ${totalPages} separate PDF files!`);
      } else {
        // Extract specific pages
        const pagesToExtract = parsePageRange(pageRange, totalPages);
        if (pagesToExtract.length === 0) {
          alert('No valid pages to extract. Please check your page range.');
          return;
        }
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract.map(p => p - 1));
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${pdfFile.name.replace('.pdf', '')}-extracted.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert(`Successfully extracted ${pagesToExtract.length} pages!`);
      }
    } catch (error) {
      alert('Error splitting PDF: ' + (error as Error).message);
    } finally {
      setLoading(false);
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

          <Card>
            <CardHeader>
              <CardTitle>✂️ Split PDF</CardTitle>
              <CardDescription>Split PDF documents into separate pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Click to upload PDF file
                  </p>
                  <p className="text-xs text-slate-500 mt-2">PDF up to 10MB</p>
                </label>
              </div>

                {pdfFile && (
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm font-medium">Selected file:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{pdfFile.name}</p>
                      {pageCount > 0 && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total pages: {pageCount}</p>
                      )}
                    </div>                  <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="split"
                        value="all"
                        checked={splitOption === 'all'}
                        onChange={() => setSplitOption('all')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Split all pages into separate files</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="split"
                        value="range"
                        checked={splitOption === 'range'}
                        onChange={() => setSplitOption('range')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Extract specific page range</span>
                    </label>

                    {splitOption === 'range' && (
                      <Input
                        placeholder="e.g., 1-5, 8, 10-12"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                      />
                    )}
                  </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setPdfFile(null)} variant="secondary" className="flex-1" disabled={loading}>
                        Clear
                      </Button>
                      <Button onClick={splitPDF} className="flex-1" disabled={loading}>
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Split PDF
                          </>
                        )}
                      </Button>
                    </div>

                    {!loading && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">
                          ✅ Full PDF splitting is now working with pdf-lib!
                        </p>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="Split PDF"
              slug="split-pdf"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

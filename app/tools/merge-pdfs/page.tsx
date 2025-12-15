'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function MergePdfsPage() {
  const seoContent = getSEOContent('merge-pdfs');
  const [pdfFiles, setPdfFiles] = useState<{ name: string; data: ArrayBuffer }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Validate each file
      const maxSize = 10 * 1024 * 1024; // 10MB per file
      const validFiles: File[] = [];
      
      Array.from(files).forEach((file) => {
        if (file.size > maxSize) {
          alert(`File "${file.name}" exceeds 10MB limit and will be skipped.`);
          return;
        }
        if (file.type !== 'application/pdf') {
          alert(`File "${file.name}" is not a PDF file and will be skipped.`);
          return;
        }
        validFiles.push(file);
      });

      if (validFiles.length === 0) {
        e.target.value = '';
        return;
      }

      const readers: Promise<{ name: string; data: ArrayBuffer }>[] = [];
      validFiles.forEach((file) => {
        const reader = new FileReader();
        const promise = new Promise<{ name: string; data: ArrayBuffer }>((resolve) => {
          reader.onloadend = () => resolve({ name: file.name, data: reader.result as ArrayBuffer });
          reader.readAsArrayBuffer(file);
        });
        readers.push(promise);
      });

      Promise.all(readers).then((results) => {
        setPdfFiles([...pdfFiles, ...results]);
      });
    }
  };

  const removeFile = (index: number) => {
    setPdfFiles(pdfFiles.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }

    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of pdfFiles) {
        const pdf = await PDFDocument.load(file.data);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      link.click();
      URL.revokeObjectURL(url);
      
      alert(`Successfully merged ${pdfFiles.length} PDF files!`);
    } catch (error) {
      alert('Error merging PDFs: ' + (error as Error).message);
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
              <CardTitle>🔗 Merge PDFs</CardTitle>
              <CardDescription>Combine multiple PDF files into one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Click to upload multiple PDF files
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Select 2 or more PDF files</p>
                </label>
              </div>

              {pdfFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Selected PDFs ({pdfFiles.length})</h3>
                  <div className="space-y-2">
                    {pdfFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-slate-500">#{index + 1}</span>
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setPdfFiles([])} variant="secondary" className="flex-1" disabled={loading}>
                      Clear All
                    </Button>
                    <Button onClick={mergePDFs} className="flex-1" disabled={pdfFiles.length < 2 || loading}>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Merging...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Merge PDFs
                        </>
                      )}
                    </Button>
                  </div>

                  {!loading && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✅ Full PDF merging is now working with pdf-lib!
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
              toolName="Merge PDFs"
              slug="merge-pdfs"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

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

export default function ImageToPdfPage() {
  const seoContent = getSEOContent('image-to-pdf');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Validate each file
      const maxSize = 5 * 1024 * 1024; // 5MB per file
      const validFiles: File[] = [];
      
      Array.from(files).forEach((file) => {
        if (file.size > maxSize) {
          alert(`File "${file.name}" exceeds 5MB limit and will be skipped.`);
          return;
        }
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" is not a valid image and will be skipped.`);
          return;
        }
        validFiles.push(file);
      });

      if (validFiles.length === 0) {
        e.target.value = '';
        return;
      }

      const readers: Promise<string>[] = [];
      validFiles.forEach((file) => {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        readers.push(promise);
      });

      Promise.all(readers).then((results) => {
        setImages([...images, ...results]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imageData of images) {
        let image;
        if (imageData.includes('image/png')) {
          const imageBytes = await fetch(imageData).then(res => res.arrayBuffer());
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          const imageBytes = await fetch(imageData).then(res => res.arrayBuffer());
          image = await pdfDoc.embedJpg(imageBytes);
        }
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'images-combined.pdf';
      link.click();
      URL.revokeObjectURL(url);
      
      alert('PDF generated successfully!');
    } catch (error) {
      alert('Error generating PDF: ' + (error as Error).message);
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
              <CardTitle>📸 Image to PDF</CardTitle>
              <CardDescription>Convert images to PDF documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Click to upload or drag and drop multiple images
                  </p>
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF</p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Selected Images ({images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <img src={img} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setImages([])} variant="secondary" className="flex-1" disabled={loading}>
                      Clear All
                    </Button>
                    <Button onClick={generatePDF} className="flex-1" disabled={loading || images.length === 0}>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Generate PDF
                        </>
                      )}
                    </Button>
                  </div>

                  {!loading && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✅ Full PDF generation is now working with pdf-lib!
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
              toolName="Image to PDF"
              slug="image-to-pdf"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

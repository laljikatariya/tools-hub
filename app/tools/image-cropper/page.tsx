'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload } from 'lucide-react';

export default function ImageCropperPage() {
  const seoContent = getSEOContent('image-cropper');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('free');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 10MB limit. Please choose a smaller image.');
        e.target.value = '';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setOriginalImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let cropWidth = img.width;
      let cropHeight = img.height;
      let startX = 0;
      let startY = 0;

      // Apply aspect ratio
      switch (aspectRatio) {
        case '1:1':
          const size = Math.min(img.width, img.height);
          cropWidth = cropHeight = size;
          startX = (img.width - size) / 2;
          startY = (img.height - size) / 2;
          break;
        case '16:9':
          if (img.width / img.height > 16 / 9) {
            cropWidth = img.height * (16 / 9);
            startX = (img.width - cropWidth) / 2;
          } else {
            cropHeight = img.width * (9 / 16);
            startY = (img.height - cropHeight) / 2;
          }
          break;
        case '4:3':
          if (img.width / img.height > 4 / 3) {
            cropWidth = img.height * (4 / 3);
            startX = (img.width - cropWidth) / 2;
          } else {
            cropHeight = img.width * (3 / 4);
            startY = (img.height - cropHeight) / 2;
          }
          break;
      }

      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        const cropped = canvas.toDataURL('image/png');
        setCroppedImage(cropped);
      }
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = `cropped-${aspectRatio}.png`;
    link.click();
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

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>✂️ Image Cropper</CardTitle>
                <CardDescription>Crop images to desired size and aspect ratio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>

                {originalImage && (
                  <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                        Aspect Ratio
                      </label>
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                      >
                        <option value="free">Free (Original)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="4:3">4:3 (Standard)</option>
                      </select>
                    </div>

                    <Button onClick={handleCrop} className="w-full">
                      Crop Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {croppedImage && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Original</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={originalImage} alt="Original" className="w-full h-auto rounded-lg" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cropped</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img src={croppedImage} alt="Cropped" className="w-full h-auto rounded-lg" />
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Cropped Image
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="Image Cropper"
              slug="image-cropper"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

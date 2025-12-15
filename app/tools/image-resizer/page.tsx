'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { ArrowLeft, Download, Upload } from 'lucide-react';

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [resizedImage, setResizedImage] = useState<string>('');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const seoContent = getSEOContent('image-resizer');

  const processFile = (file: File) => {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit. Please choose a smaller image.');
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
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = result;
      setOriginalImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleResize = () => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const resized = canvas.toDataURL('image/png');
        setResizedImage(resized);
      }
    };
    img.src = originalImage;
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized-${width}x${height}.png`;
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
                <CardTitle>📐 Image Resizer</CardTitle>
                <CardDescription>Resize images to custom dimensions</CardDescription>
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
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>

                {originalImage && (
                  <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                      Original: {originalDimensions.width} × {originalDimensions.height}px
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Width (px)</label>
                        <Input
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Height (px)</label>
                        <Input
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Maintain aspect ratio</span>
                    </label>

                    <Button onClick={handleResize} className="w-full">
                      Resize Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {resizedImage && (
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
                    <CardTitle>Resized ({width} × {height}px)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img src={resizedImage} alt="Resized" className="w-full h-auto rounded-lg" />
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resized Image
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
              toolName="Image Resizer"
              slug="image-resizer"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

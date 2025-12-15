'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ImageCompressorPage() {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [compressedImage, setCompressedImage] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const seoContent = getSEOContent('image-compressor');

  const processFile = async (file: File) => {
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

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setOriginalImage(result);
    };
    reader.readAsDataURL(file);
    
    // Auto-compress on upload
    compressImageFile(file);
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

  const compressImageFile = async (file: File) => {
    setLoading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: quality / 100,
      };

      const compressedFile = await imageCompression(file, options);
      setCompressedSize(compressedFile.size);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompressedImage(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      alert('Error compressing image: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleQualityChange = async (newQuality: number) => {
    setQuality(newQuality);
    if (originalImage) {
      // Re-compress with new quality
      const response = await fetch(originalImage);
      const blob = await response.blob();
      const file = new File([blob], 'image', { type: blob.type });
      compressImageFile(file);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed-image.jpg';
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const savings = originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

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
                <CardTitle>📦 Image Compressor</CardTitle>
                <CardDescription>Compress images without losing quality</CardDescription>
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
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                        className="w-full"
                        disabled={loading}
                      />
                    </div>

                    {loading && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Compressing image...</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Original Size</p>
                        <p className="text-2xl font-bold">{formatBytes(originalSize)}</p>
                      </div>
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Compressed Size</p>
                        <p className="text-2xl font-bold">{formatBytes(compressedSize)}</p>
                      </div>
                      <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">Savings</p>
                        <p className="text-2xl font-bold">{savings}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {compressedImage && (
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
                    <CardTitle>Compressed</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img src={compressedImage} alt="Compressed" className="w-full h-auto rounded-lg" />
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Compressed Image
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
              toolName="Image Compressor"
              slug="image-compressor"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

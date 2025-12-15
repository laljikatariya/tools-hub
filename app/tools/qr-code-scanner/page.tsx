'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Upload } from 'lucide-react';
import jsQR from 'jsqr';

export default function QrCodeScannerPage() {
  const seoContent = getSEOContent('qr-code-scanner');
  const [scannedText, setScannedText] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size exceeds 5MB limit. Please choose a smaller image.');
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        scanQRCode(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanQRCode = (imageData: string) => {
    setLoading(true);
    setError('');
    setScannedText('');

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setScannedText(code.data);
        } else {
          setError('No QR code found in image. Please try another image.');
        }
      }
      setLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setLoading(false);
    };
    
    img.src = imageData;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scannedText);
    alert('Scanned text copied to clipboard!');
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
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
                <CardTitle>📸 QR Code Scanner</CardTitle>
                <CardDescription>Scan and decode QR codes from images</CardDescription>
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
                      Click to upload QR code image
                    </p>
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF</p>
                  </label>
                </div>

                {imagePreview && (
                  <div>
                    <p className="text-sm font-medium mb-2">Uploaded Image:</p>
                    <img 
                      src={imagePreview} 
                      alt="QR Code" 
                      className="max-w-full h-auto rounded-lg border border-slate-300 dark:border-slate-600"
                    />
                  </div>
                )}

                {loading && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Scanning QR code...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {!loading && !error && imagePreview && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✅ QR code scanning is now working with jsQR!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scanned Result</CardTitle>
                <CardDescription>Decoded data from QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800">
                  {scannedText ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                          Decoded Text:
                        </p>
                        <p className="font-mono text-sm break-all">{scannedText}</p>
                      </div>
                      
                      {isUrl(scannedText) && (
                        <a
                          href={scannedText}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                        >
                          Open Link →
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-12">
                      Upload a QR code to see the decoded result
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopy} 
                    className="flex-1" 
                    disabled={!scannedText}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button 
                    onClick={() => {
                      setScannedText('');
                      setImagePreview('');
                    }} 
                    variant="secondary" 
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="QR Code Scanner"
              slug="qr-code-scanner"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

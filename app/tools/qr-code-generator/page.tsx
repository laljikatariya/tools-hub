'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { ArrowLeft, Download, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '@/app/contexts/language-context';
import { getToolName } from '@/lib/translations';

export default function QrCodeGeneratorPage() {
  const { t } = useLanguage();
  const [text, setText] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [size, setSize] = useState<number>(256);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const seoContent = getSEOContent('qr-code-generator');
  const toolName = getToolName('qr-code-generator');

  const generateQRCode = async () => {
    if (!text) return;
    
    setLoading(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      alert('Error generating QR code: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    fetch(qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qr-code.png';
        link.click();
        window.URL.revokeObjectURL(url);
      });
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      setText(pastedText);
    } catch (error) {
      alert('Failed to paste from clipboard. Please make sure you have granted clipboard permissions.');
    }
  };

  const presetExamples = [
    { label: 'Website', value: 'https://example.com' },
    { label: 'Email', value: 'mailto:hello@example.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'SMS', value: 'sms:+1234567890' },
    { label: 'WiFi', value: 'WIFI:S:NetworkName;T:WPA;P:password;;' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t.backToTools}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>📱 {toolName}</CardTitle>
                <CardDescription>Create QR codes for text and URLs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                    Enter Text or URL
                  </label>
                  <div className="relative">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text, URL, email, phone number..."
                      className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    {text && (
                      <button
                        onClick={handleCopyUrl}
                        className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        title="Copy text"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <span className="text-sm">📋</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                    Size: {size}x{size}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="64"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Quick Examples</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {presetExamples.map((example) => (
                      <Button
                        key={example.label}
                        variant="secondary"
                        size="sm"
                        onClick={() => setText(example.value)}
                      >
                        {example.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button onClick={handlePaste} variant="secondary" className="flex-1">
                      Paste
                    </Button>
                    <Button onClick={() => setText('')} variant="secondary" className="flex-1">
                      {t.clear}
                    </Button>
                  </div>
                  <Button onClick={generateQRCode} className="w-full" disabled={!text || loading}>
                    {loading ? `${t.generate}...` : t.generate}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
                <CardDescription>Scan with your mobile device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-64 border border-slate-300 dark:border-slate-600 rounded-lg p-8 flex items-center justify-center bg-white dark:bg-slate-800">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="max-w-full h-auto"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <p className="text-slate-400 text-center">
                      QR code will appear here
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1" disabled={!qrCodeUrl}>
                    <Download className="w-4 h-4 mr-2" />
                    {t.download}
                  </Button>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    💡 Tip: Use WiFi format for easy network sharing: WIFI:S:YourNetwork;T:WPA;P:password;;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName={toolName}
              slug="qr-code-generator"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

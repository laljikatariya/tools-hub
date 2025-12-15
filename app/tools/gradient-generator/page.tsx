'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { ArrowLeft, Copy, Check } from 'lucide-react';

export default function GradientGeneratorPage() {
  const [color1, setColor1] = useState<string>('#3B82F6');
  const [color2, setColor2] = useState<string>('#8B5CF6');
  const [direction, setDirection] = useState<string>('to right');
  const [copied, setCopied] = useState<string | null>(null);
  const seoContent = getSEOContent('gradient-generator');

  const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
  const cssCode = `background: ${gradient};`;

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const presetGradients = [
    { name: 'Sunset', colors: ['#FF6B6B', '#FFA07A'] },
    { name: 'Ocean', colors: ['#00C9FF', '#92FE9D'] },
    { name: 'Purple Haze', colors: ['#8B5CF6', '#EC4899'] },
    { name: 'Forest', colors: ['#10B981', '#059669'] },
    { name: 'Fire', colors: ['#FF4500', '#FFD700'] },
    { name: 'Ice', colors: ['#00BFFF', '#E0FFFF'] },
  ];

  const directions = [
    { label: 'To Right →', value: 'to right' },
    { label: 'To Left ←', value: 'to left' },
    { label: 'To Bottom ↓', value: 'to bottom' },
    { label: 'To Top ↑', value: 'to top' },
    { label: 'To Bottom Right ↘', value: 'to bottom right' },
    { label: 'To Bottom Left ↙', value: 'to bottom left' },
    { label: 'To Top Right ↗', value: 'to top right' },
    { label: 'To Top Left ↖', value: 'to top left' },
  ];

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
                <CardTitle>🌈 Gradient Generator</CardTitle>
                <CardDescription>Create beautiful color gradients</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="w-full h-64 rounded-lg shadow-lg border-4 border-white dark:border-slate-700"
                  style={{ background: gradient }}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Customize</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                        Start Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color1}
                          onChange={(e) => setColor1(e.target.value)}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={color1}
                          onChange={(e) => setColor1(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                        End Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color2}
                          onChange={(e) => setColor2(e.target.value)}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={color2}
                          onChange={(e) => setColor2(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                        Direction
                      </label>
                      <select
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                      >
                        {directions.map((dir) => (
                          <option key={dir.value} value={dir.value}>
                            {dir.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Presets</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {presetGradients.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setColor1(preset.colors[0]);
                            setColor2(preset.colors[1]);
                          }}
                          className="h-12 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:scale-105 transition-transform relative overflow-hidden"
                          style={{ 
                            background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]})` 
                          }}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold bg-black bg-opacity-20">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CSS Code</CardTitle>
                  <CardDescription>Copy and use in your projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-lg">
                    <code className="text-green-400 font-mono text-sm break-all">
                      {cssCode}
                    </code>
                  </div>

                  <Button onClick={() => handleCopy(cssCode, 'CSS code')} className="w-full">
                    {copied === 'CSS code' ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy CSS
                      </>
                    )}
                  </Button>

                  <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Additional Formats</h4>
                    
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Tailwind CSS</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(`bg-gradient-to-r from-[${color1}] to-[${color2}]`, 'Tailwind classes')}
                        >
                          {copied === 'Tailwind classes' ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <code className="text-xs font-mono break-all">
                        bg-gradient-to-r from-[{color1}] to-[{color2}]
                      </code>
                    </div>

                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Full CSS</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(gradient, 'Gradient value')}
                        >
                          {copied === 'Gradient value' ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <code className="text-xs font-mono break-all">
                        {gradient}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="Gradient Generator"
              slug="gradient-generator"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

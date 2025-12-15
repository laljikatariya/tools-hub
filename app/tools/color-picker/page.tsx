'use client';

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { ArrowLeft, Copy, Palette, Share2 } from 'lucide-react';

export default function ColorPickerPage() {
  const [color, setColor] = useState<string>('#DFFC03');
  const [hue, setHue] = useState<number>(67);
  const [saturation, setSaturation] = useState<number>(99);
  const [lightness, setLightness] = useState<number>( 50);
  const [rgb, setRgb] = useState({ r: 223, g: 252, b: 3 });
  const [hsl, setHsl] = useState({ h: 67, s: 99, l: 50 });
  const [cmyk, setCmyk] = useState({ c: 12, m: 0, y: 99, k: 1 });
  const seoContent = getSEOContent('color-picker');
  
  const pickerRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const [isDraggingPicker, setIsDraggingPicker] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  // Color conversion utilities
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }
    
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    
    return { c, m, y, k };
  };

  const updateColor = (h: number, s: number, l: number) => {
    const newRgb = hslToRgb(h, s, l);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const newCmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b);
    
    setHue(h);
    setSaturation(s);
    setLightness(l);
    setRgb(newRgb);
    setColor(newHex);
    setHsl({ h, s, l });
    setCmyk(newCmyk);
  };

  // Handle shade picker dragging
  const handlePickerMove = (clientX: number, clientY: number) => {
    if (!pickerRef.current) return;
    
    const rect = pickerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    
    const newSaturation = Math.round((x / rect.width) * 100);
    const newLightness = Math.round(100 - (y / rect.height) * 100);
    
    updateColor(hue, newSaturation, newLightness);
  };

  const handlePickerMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDraggingPicker(true);
    handlePickerMove(e.clientX, e.clientY);
  };

  const handlePickerTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDraggingPicker(true);
    const touch = e.touches[0];
    handlePickerMove(touch.clientX, touch.clientY);
  };

  // Handle hue slider dragging
  const handleHueMove = (clientX: number) => {
    if (!hueSliderRef.current) return;
    
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newHue = Math.round((x / rect.width) * 360);
    
    updateColor(newHue, saturation, lightness);
  };

  const handleHueMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDraggingHue(true);
    handleHueMove(e.clientX);
  };

  const handleHueTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDraggingHue(true);
    const touch = e.touches[0];
    handleHueMove(touch.clientX);
  };

  // Global mouse/touch handlers
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDraggingPicker) {
        handlePickerMove(e.clientX, e.clientY);
      } else if (isDraggingHue) {
        handleHueMove(e.clientX);
      }
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0];
      if (isDraggingPicker) {
        handlePickerMove(touch.clientX, touch.clientY);
      } else if (isDraggingHue) {
        handleHueMove(touch.clientX);
      }
    };

    const handleEnd = () => {
      setIsDraggingPicker(false);
      setIsDraggingHue(false);
    };

    if (isDraggingPicker || isDraggingHue) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingPicker, isDraggingHue, hue, saturation, lightness]);

  const handleHexInput = (hex: string) => {
    const rgbVal = hexToRgb(hex);
    if (rgbVal) {
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      updateColor(hslVal.h, hslVal.s, hslVal.l);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    // Visual feedback is already handled by the button states
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Color Picker */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <CardTitle>Colour picker</CardTitle>
                      <CardDescription>Drag to pick shades and colors</CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shade Picker - 2D gradient */}
                <div className="relative">
                  <div
                    ref={pickerRef}
                    onMouseDown={handlePickerMouseDown}
                    onTouchStart={handlePickerTouchStart}
                    className="relative w-full h-80 rounded-2xl cursor-crosshair overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(to bottom, transparent, #000),
                                   linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
                    }}
                  >
                    {/* Color preview box (left side) */}
                    <div 
                      className="absolute left-0 top-0 w-1/3 h-full border-r-2 border-slate-700/50"
                      style={{ backgroundColor: color }}
                    />
                    
                    {/* Picker cursor */}
                    <div
                      className="absolute w-8 h-8 border-4 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${33 + (saturation * 0.67)}%`,
                        top: `${100 - lightness}%`,
                        boxShadow: '0 0 0 2px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
                      }}
                    />
                  </div>
                </div>

                {/* Hue Slider */}
                <div className="space-y-3">
                  <div
                    ref={hueSliderRef}
                    onMouseDown={handleHueMouseDown}
                    onTouchStart={handleHueTouchStart}
                    className="relative h-12 rounded-xl cursor-pointer shadow-lg"
                    style={{
                      background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                    }}
                  >
                    {/* Hue cursor */}
                    <div
                      className="absolute w-6 h-14 -top-1 bg-white border-3 border-slate-700 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2"
                      style={{
                        left: `${(hue / 360) * 100}%`,
                        boxShadow: '0 0 0 3px rgba(0,0,0,0.3), 0 6px 16px rgba(0,0,0,0.5)'
                      }}
                    />
                  </div>
                </div>

                {/* HEX Input with Copy */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">HEX</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(color)}
                      className="h-8"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={color}
                    onChange={(e) => handleHexInput(e.target.value)}
                    className="text-2xl font-bold text-center"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Color Formats Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Color Formats</CardTitle>
                <CardDescription>All format codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* RGB */}
                <div className="bg-slate-50 dark:bg-slate-900/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">RGB</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(`${rgb.r}, ${rgb.g}, ${rgb.b}`)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-lg font-bold">{rgb.r}, {rgb.g}, {rgb.b}</p>
                </div>

                {/* CMYK */}
                <div className="bg-slate-50 dark:bg-slate-900/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">CMYK</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-lg font-bold">{cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%</p>
                </div>

                {/* HSV */}
                <div className="bg-slate-50 dark:bg-slate-900/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">HSV</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-lg font-bold">{hsl.h}°, {hsl.s}%, {hsl.l}%</p>
                </div>

                {/* HSL */}
                <div className="bg-slate-50 dark:bg-slate-900/70 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">HSL</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-lg font-bold">{hsl.h}°, {hsl.s}%, {hsl.l}%</p>
                </div>

                {/* Color Preview */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Color Preview</p>
                  <div 
                    className="w-full h-32 rounded-xl shadow-2xl border-2 border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: color }}
                  />
                </div>

                {/* Quick Presets */}
                <div className="pt-4">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Colors</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
                      '#8B5CF6', '#EC4899', '#6B7280', '#000000'
                    ].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleHexInput(preset)}
                        className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform shadow-lg"
                        style={{ backgroundColor: preset }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="Color Picker"
              slug="color-picker"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

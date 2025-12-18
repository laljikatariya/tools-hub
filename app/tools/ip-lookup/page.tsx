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
import { ArrowLeft, Search } from 'lucide-react';

interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  timezone?: string;
  postal?: string;
}

export default function IpLookupPage() {
  const seoContent = getSEOContent('ip-lookup');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const lookupIP = async () => {
    if (!ipAddress.trim()) {
      setError('Please enter an IP address');
      return;
    }

    setLoading(true);
    setError('');
    setIpInfo(null);

    try {
      // Using ipinfo.io free API (no key required for basic usage)
      const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few minutes.');
        }
        throw new Error('Failed to fetch IP information');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Invalid IP address');
      }

      if (data.bogon) {
        throw new Error('This is a private/reserved IP address');
      }

      setIpInfo(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to lookup IP address');
    } finally {
      setLoading(false);
    }
  };

  const lookupMyIP = async () => {
    setIpAddress('');
    setLoading(true);
    setError('');
    setIpInfo(null);

    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      setIpInfo(data);
    } catch (err) {
      setError('Failed to fetch your IP information');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      setIpAddress(pastedText);
    } catch (error) {
      alert('Failed to paste from clipboard. Please make sure you have granted clipboard permissions.');
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
                <CardTitle>🌐 IP Address Lookup</CardTitle>
                <CardDescription>Get information about IP addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">
                    IP Address
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="e.g., 8.8.8.8"
                      onKeyPress={(e) => e.key === 'Enter' && lookupIP()}
                    />
                    <Button onClick={handlePaste} variant="secondary">
                      Paste
                    </Button>
                    <Button onClick={lookupIP} disabled={loading}>
                      <Search className="w-4 h-4 mr-2" />
                      Lookup
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">or</span>
                  </div>
                </div>

                <Button 
                  onClick={lookupMyIP} 
                  variant="secondary" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Looking up...' : 'Lookup My IP Address'}
                </Button>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    💡 Supports both IPv4 and IPv6 addresses
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IP Information</CardTitle>
                <CardDescription>Geolocation and network details</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : ipInfo ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400">IP Address</p>
                      <p className="text-lg font-mono font-bold">{ipInfo.ip}</p>
                    </div>

                    {ipInfo.city && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Location</p>
                        <p className="text-lg font-medium">
                          {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
                        </p>
                      </div>
                    )}

                    {ipInfo.loc && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Coordinates</p>
                        <p className="text-lg font-mono">{ipInfo.loc}</p>
                      </div>
                    )}

                    {ipInfo.org && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Organization</p>
                        <p className="text-base">{ipInfo.org}</p>
                      </div>
                    )}

                    {ipInfo.timezone && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Timezone</p>
                        <p className="text-lg font-medium">{ipInfo.timezone}</p>
                      </div>
                    )}

                    {ipInfo.postal && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Postal Code</p>
                        <p className="text-lg font-medium">{ipInfo.postal}</p>
                      </div>
                    )}

                    {ipInfo.loc && (
                      <a
                        href={`https://www.google.com/maps?q=${ipInfo.loc}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        View on Map →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-slate-400">Enter an IP address to see information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="IP Lookup"
              slug="ip-lookup"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

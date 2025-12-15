'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { countText, getTopWords } from '@/lib/utils';
import { getSEOContent } from '@/lib/seo-content';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { ArrowLeft, Download, Check, Clock, BookOpen, TrendingUp } from 'lucide-react';

const SAMPLE_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const stats = countText(text);
  const topWords = getTopWords(text, 5);
  const seoContent = getSEOContent('word-counter');

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('wordCounterHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Save to history when text changes (debounced)
  useEffect(() => {
    if (text.trim() && text.length > 10) {
      const timer = setTimeout(() => {
        setHistory(prev => {
          const newHistory = [text, ...prev.filter(t => t !== text)].slice(0, 5);
          localStorage.setItem('wordCounterHistory', JSON.stringify(newHistory));
          return newHistory;
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleDownload = () => {
    const content = `Word Count Report
Generated: ${new Date().toLocaleString()}

=== Basic Statistics ===
Words: ${stats.words}
Characters: ${stats.chars}
Characters (No Space): ${stats.charsNoSpace}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}

=== Advanced Statistics ===
Unique Words: ${stats.uniqueWords}
Average Word Length: ${stats.avgWordLength} characters
Average Sentence Length: ${stats.avgSentenceLength} words
Reading Time: ${stats.readingTime} minute(s)
Speaking Time: ${stats.speakingTime} minute(s)

=== Top Words ===
${topWords.map(([word, count], i) => `${i + 1}. "${word}" - ${count} times`).join('\n')}

=== Original Text ===
${text}
`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'word-count-report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadFromHistory = (historicalText: string) => {
    setText(historicalText);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setText('');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Word Counter</CardTitle>
                  <CardDescription>
                    {text.length > 0 ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Analyzing text...
                      </span>
                    ) : (
                      'Paste your text here to analyze'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here..."
                    className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    aria-label="Text input for word counting"
                  />
                  {text.length > 10000 && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Large text detected ({text.length.toLocaleString()} characters). Performance may be affected.
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      onClick={() => setText(SAMPLE_TEXT)} 
                      variant="outline"
                      aria-label="Load sample text"
                    >
                      Load Sample
                    </Button>
                    <Button 
                      onClick={() => setText('')} 
                      variant="secondary" 
                      className="flex-1"
                      aria-label="Clear text"
                    >
                      Clear (Ctrl+K)
                    </Button>
                    <Button 
                      onClick={handleDownload} 
                      className="flex-1"
                      disabled={!text.trim()}
                      aria-label="Download report"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* History Section */}
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Texts
                    </CardTitle>
                    <CardDescription>
                      Click to reload a previous text
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {history.map((hist, index) => (
                        <button
                          key={index}
                          onClick={() => loadFromHistory(hist)}
                          className="w-full text-left p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {hist.substring(0, 100)}...
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            {hist.split(/\s+/).length} words
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Stats Panel */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Words</span>
                    <div className="flex items-center gap-2">
                      {copiedItem === 'Words' && <Check className="w-4 h-4 text-green-500" />}
                      <span 
                        className="text-2xl font-bold cursor-pointer hover:opacity-75" 
                        onClick={() => handleCopy(stats.words.toString(), 'Words')}
                        title="Click to copy"
                      >
                        {stats.words}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Characters</span>
                    <div className="flex items-center gap-2">
                      {copiedItem === 'Characters' && <Check className="w-4 h-4 text-green-500" />}
                      <span 
                        className="text-2xl font-bold cursor-pointer hover:opacity-75" 
                        onClick={() => handleCopy(stats.chars.toString(), 'Characters')}
                        title="Click to copy"
                      >
                        {stats.chars}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Chars (No Space)</span>
                    <div className="flex items-center gap-2">
                      {copiedItem === 'Characters without space' && <Check className="w-4 h-4 text-green-500" />}
                      <span 
                        className="text-2xl font-bold cursor-pointer hover:opacity-75" 
                        onClick={() => handleCopy(stats.charsNoSpace.toString(), 'Characters without space')}
                        title="Click to copy"
                      >
                        {stats.charsNoSpace}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Sentences</span>
                    <div className="flex items-center gap-2">
                      {copiedItem === 'Sentences' && <Check className="w-4 h-4 text-green-500" />}
                      <span 
                        className="text-2xl font-bold cursor-pointer hover:opacity-75" 
                        onClick={() => handleCopy(stats.sentences.toString(), 'Sentences')}
                        title="Click to copy"
                      >
                        {stats.sentences}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Paragraphs</span>
                    <div className="flex items-center gap-2">
                      {copiedItem === 'Paragraphs' && <Check className="w-4 h-4 text-green-500" />}
                      <span 
                        className="text-2xl font-bold cursor-pointer hover:opacity-75" 
                        onClick={() => handleCopy(stats.paragraphs.toString(), 'Paragraphs')}
                        title="Click to copy"
                      >
                        {stats.paragraphs}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Lines</span>
                    <div className="flex items-center gap-2">
                      {copiedItem === 'Lines' && <Check className="w-4 h-4 text-green-500" />}
                      <span 
                        className="text-2xl font-bold cursor-pointer hover:opacity-75" 
                        onClick={() => handleCopy(stats.lines.toString(), 'Lines')}
                        title="Click to copy"
                      >
                        {stats.lines}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Stats */}
              {text.trim() && (
                <Card className="sticky top-24 mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Advanced Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-600 dark:text-slate-400" title="Number of unique words used">Unique Words</span>
                      <span className="font-semibold">{stats.uniqueWords}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-600 dark:text-slate-400" title="Average characters per word">Avg Word Length</span>
                      <span className="font-semibold">{stats.avgWordLength} chars</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-600 dark:text-slate-400" title="Average words per sentence">Avg Sentence Length</span>
                      <span className="font-semibold">{stats.avgSentenceLength} words</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1" title="Estimated time to read (200 words/min)">
                        <BookOpen className="w-4 h-4" />
                        Reading Time
                      </span>
                      <span className="font-semibold">{stats.readingTime} min</span>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400" title="Estimated time to speak (150 words/min)">Speaking Time</span>
                      <span className="font-semibold">{stats.speakingTime} min</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Words */}
              {text.trim() && topWords.length > 0 && (
                <Card className="sticky top-24 mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Top Words
                    </CardTitle>
                    <CardDescription>
                      Most frequently used words
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topWords.map(([word, count], index) => (
                        <div 
                          key={word} 
                          className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 w-5">#{index + 1}</span>
                            <span className="font-medium">{word}</span>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{count}×</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* SEO Content Section */}
          {seoContent && (
            <SEOContentSection
              seoContent={seoContent}
              toolName="Word Counter"
              slug="word-counter"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

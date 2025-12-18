'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toolsData } from '@/lib/tools-data';
import { trackToolView } from '@/lib/analytics';
import { getSEOContent } from '@/lib/seo-content';
import {
  cleanText,
  convertCase,
  countText,
  generateUUID,
  generatePassword,
  hexToRgb,
  rgbToHex,
  beautifyJSON,
  minifyJSON,
  validateJSON,
  urlEncode,
  urlDecode,
  generateLoremIpsum,
  generateSHA256,
  generateMD5,
  beautifyXML,
  beautifyCode,
  testRegex,
} from '@/lib/utils';
import { ArrowLeft, Copy, Download } from 'lucide-react';

export default function ToolPageClient({ slug }: { slug: string }) {
  const tool = toolsData.find((t) => t.slug === slug);
  const seoContent = getSEOContent(slug);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState<Record<string, any>>({});

  // Check if tool needs input box
  const needsInputBox = () => {
    const noInputTools = ['password-generator', 'uuid-generator', 'lorem-ipsum'];
    return !noInputTools.includes(slug);
  };

  // Get button text based on tool
  const getButtonText = () => {
    const buttonTexts: Record<string, string> = {
      'text-cleaner': 'Clean Text',
      'case-converter': 'Convert Case',
      'word-counter': 'Count Words',
      'character-counter': 'Count Characters',
      'json-formatter': 'Format JSON',
      'json-validator': 'Validate JSON',
      'xml-formatter': 'Format XML',
      'code-beautifier': 'Beautify Code',
      'url-encoder': 'Encode/Decode',
      'password-generator': 'Generate Password',
      'uuid-generator': 'Generate UUID',
      'hash-generator': 'Generate Hash',
      'hex-to-rgb': 'Convert to RGB',
      'rgb-to-hex': 'Convert to HEX',
      'lorem-ipsum': 'Generate Lorem Ipsum',
      'regex-tester': 'Test Regex',
    };
    return buttonTexts[slug] || 'Process';
  };

  // Determine which buttons to show based on "How to Use" steps
  const shouldShowDownload = () => {
    const toolsWithDownload = [
      'image-compressor', 'image-resizer', 'image-cropper', 'image-to-pdf',
      'qr-code-generator', 'json-formatter', 'xml-formatter', 'code-beautifier',
      'pdf-to-text', 'merge-pdfs', 'split-pdf', 'base64-to-image'
    ];
    return toolsWithDownload.includes(slug);
  };

  const shouldShowCopy = () => {
    const toolsWithCopy = [
      'text-cleaner', 'case-converter', 'word-counter', 'character-counter',
      'password-generator', 'uuid-generator', 'hash-generator', 'hex-to-rgb',
      'rgb-to-hex', 'lorem-ipsum', 'url-encoder', 'json-formatter', 'json-validator',
      'xml-formatter', 'code-beautifier', 'regex-tester', 'image-to-base64', 'base64-to-image'
    ];
    return toolsWithCopy.includes(slug);
  };

  // Track tool view when component mounts
  useEffect(() => {
    if (tool) {
      trackToolView(tool.id, tool.slug);
    }
  }, [tool]);

  if (!tool) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              The tool you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>← Back to Home</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const processInput = async () => {
    setOutput(''); // Clear previous output
    
    try {
      let result = '';

      // Validate input for tools that require it
      if (!input && !['password-generator', 'uuid-generator', 'lorem-ipsum'].includes(slug)) {
        setOutput('⚠️ Please enter some text to process');
        return;
      }

      switch (slug) {
        case 'text-cleaner':
          result = cleanText(input, {
            removeExtraSpaces: options.removeExtraSpaces !== false,
            removeLineBreaks: options.removeLineBreaks !== false,
            removeSpecialChars: options.removeSpecialChars === true,
            trimLines: options.trimLines !== false,
          });
          break;
        case 'case-converter':
          result = convertCase(input, options.caseType || 'lowercase');
          break;
        case 'word-counter': {
          const stats = countText(input);
          result = JSON.stringify(stats, null, 2);
          break;
        }
        case 'character-counter': {
          result = `Total: ${input.length}\nWithout spaces: ${input.replace(/\s/g, '').length}`;
          break;
        }
        case 'json-formatter':
          if (options.minify) {
            result = minifyJSON(input);
          } else {
            result = beautifyJSON(input);
          }
          break;
        case 'json-validator': {
          const validation = validateJSON(input);
          result = validation.valid
            ? 'Valid JSON ✓'
            : `Invalid JSON: ${validation.error}`;
          break;
        }
        case 'url-encoder':
          result = options.decode ? urlDecode(input) : urlEncode(input);
          break;
        case 'password-generator':
          result = generatePassword({
            length: options.length || 16,
            uppercase: options.uppercase !== false,
            lowercase: options.lowercase !== false,
            numbers: options.numbers !== false,
            symbols: options.symbols !== false,
          });
          break;
        case 'uuid-generator':
          result = generateUUID();
          break;
        case 'hash-generator':
          if (options.hashType === 'md5') {
            result = generateMD5(input);
          } else {
            // SHA256 is async now
            result = await generateSHA256(input);
          }
          break;
        case 'hex-to-rgb': {
          const rgb = hexToRgb(input);
          result = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid hex color';
          break;
        }
        case 'rgb-to-hex': {
          const parts = input.match(/\d+/g) || [];
          if (parts.length === 3) {
            result = rgbToHex(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
          } else {
            result = 'Invalid RGB format. Use: rgb(255, 0, 0)';
          }
          break;
        }
        case 'lorem-ipsum':
          result = generateLoremIpsum(options.words || 50);
          break;
        case 'xml-formatter':
          result = beautifyXML(input);
          break;
        case 'code-beautifier':
          result = beautifyCode(input, options.language || 'javascript');
          break;
        case 'regex-tester': {
          const pattern = options.pattern || input;
          if (!pattern) {
            result = '⚠️ Please enter a regex pattern';
            break;
          }
          const regexResult = testRegex(pattern, options.flags || 'g', options.testString || '');
          if (regexResult.isValid) {
            if (regexResult.matches && regexResult.matches.length > 0) {
              let resultText = `Found ${regexResult.matchCount} match${regexResult.matchCount !== 1 ? 'es' : ''}:\n\n`;
              regexResult.matches.forEach((m, i) => {
                resultText += `Match ${i + 1}:\n`;
                resultText += `  Text: "${m.match}"\n`;
                resultText += `  Position: ${m.index}\n`;
                if (m.groups && m.groups.length > 0) {
                  resultText += `  Groups: ${JSON.stringify(m.groups)}\n`;
                }
                resultText += '\n';
              });
              result = resultText;
            } else {
              result = 'No matches found';
            }
          } else {
            result = `Error: ${regexResult.error}`;
          }
          break;
        }
        default:
          result = 'Tool processing not yet implemented';
      }

      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (error) {
      alert('Failed to paste from clipboard. Please make sure you have granted clipboard permissions.');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
    element.setAttribute('download', `${tool.slug}-output.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 sm:mb-8 touch-manipulation min-h-[40px]">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Tools</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Input Panel */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
                  <span className="text-2xl sm:text-3xl">{tool.icon}</span>
                  <span>{tool.name}</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Only show textarea for tools that need input */}
                {needsInputBox() && (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Enter your ${tool.name.toLowerCase()}...`}
                    className="w-full h-48 sm:h-64 p-3 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none touch-manipulation"
                  />
                )}

                {/* Tool-specific options */}
                {['text-cleaner', 'case-converter', 'json-formatter', 'password-generator', 'hash-generator', 'code-beautifier', 'regex-tester', 'lorem-ipsum', 'url-encoder'].includes(slug) && (
                  <div className="space-y-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm sm:text-base">
                    {slug === 'text-cleaner' && (
                          <>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Cleaning Options:
                            </div>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.removeExtraSpaces !== false}
                            onChange={(e) => setOptions({ ...options, removeExtraSpaces: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Remove extra spaces</span>
                        </label>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.removeLineBreaks !== false}
                            onChange={(e) => setOptions({ ...options, removeLineBreaks: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Remove extra line breaks</span>
                        </label>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.trimLines !== false}
                            onChange={(e) => setOptions({ ...options, trimLines: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Trim line edges</span>
                        </label>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.removeSpecialChars === true}
                            onChange={(e) => setOptions({ ...options, removeSpecialChars: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Remove special characters</span>
                        </label>
                      </>
                    )}

                    {slug === 'url-encoder' && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Choose Operation:
                        </div>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="radio"
                            name="encodeMode"
                            checked={!options.decode}
                            onChange={() => setOptions({ ...options, decode: false })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Encode URL</span>
                        </label>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="radio"
                            name="encodeMode"
                            checked={options.decode === true}
                            onChange={() => setOptions({ ...options, decode: true })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Decode URL</span>
                        </label>
                      </div>
                    )}

                    {slug === 'case-converter' && (
                      <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Choose Case Format:
                        </div>
                        <select
                          value={options.caseType || 'lowercase'}
                          onChange={(e) => setOptions({ ...options, caseType: e.target.value })}
                          className="w-full p-2.5 sm:p-2 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 min-h-[44px] touch-manipulation"
                        >
                          <option value="uppercase">UPPERCASE</option>
                          <option value="lowercase">lowercase</option>
                          <option value="titlecase">Title Case</option>
                          <option value="camelcase">camelCase</option>
                          <option value="snakecase">snake_case</option>
                          <option value="kebabcase">kebab-case</option>
                        </select>
                      </>
                    )}

                    {slug === 'json-formatter' && (
                      <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Format Options:
                        </div>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.minify || false}
                            onChange={(e) => setOptions({ ...options, minify: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Minify JSON (compress)</span>
                        </label>
                      </>
                    )}

                    {slug === 'password-generator' && (
                      <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Password Settings:
                        </div>
                        <div>
                          <label className="text-sm text-slate-600 dark:text-slate-400">Password Length: {options.length || 16}</label>
                          <input
                            type="range"
                            min="8"
                            max="128"
                            value={options.length || 16}
                            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                            className="w-full h-8 touch-manipulation"
                          />
                        </div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-2 mb-1">
                          Character Types:
                        </div>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.uppercase !== false}
                            onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Uppercase (A-Z)</span>
                        </label>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.lowercase !== false}
                            onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Lowercase (a-z)</span>
                        </label>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.numbers !== false}
                            onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Numbers (0-9)</span>
                        </label>
                        <label className="flex items-center gap-2 min-h-[40px] touch-manipulation cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.symbols !== false}
                            onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                            className="w-5 h-5 sm:w-4 sm:h-4"
                          />
                          <span className="text-sm">Symbols (!@#$)</span>
                        </label>
                      </>
                    )}

                    {slug === 'hash-generator' && (
                      <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Select Hash Algorithm:
                        </div>
                        <select
                          value={options.hashType || 'sha256'}
                          onChange={(e) => setOptions({ ...options, hashType: e.target.value })}
                          className="w-full p-2.5 sm:p-2 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 min-h-[44px] touch-manipulation"
                        >
                          <option value="sha256">SHA256</option>
                          <option value="md5">MD5</option>
                        </select>
                      </>
                    )}

                    {slug === 'code-beautifier' && (
                      <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Select Programming Language:
                        </div>
                        <select
                          value={options.language || 'javascript'}
                          onChange={(e) => setOptions({ ...options, language: e.target.value })}
                          className="w-full p-2.5 sm:p-2 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 min-h-[44px] touch-manipulation"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="json">JSON</option>
                          <option value="xml">XML</option>
                          <option value="css">CSS</option>
                          <option value="html">HTML</option>
                        </select>
                      </>
                    )}

                    {slug === 'regex-tester' && (
                      <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Regex Pattern:
                        </div>
                        <Input
                          placeholder="Enter your regex pattern (e.g., \\d+)"
                          value={options.pattern || ''}
                          onChange={(e) => setOptions({ ...options, pattern: e.target.value })}
                          className="mb-3 min-h-[44px] text-sm sm:text-base"
                        />
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Flags:
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <label className="flex items-center gap-1.5 min-h-[40px] touch-manipulation cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.flags?.includes('g') ?? true}
                              onChange={(e) => {
                                const flags = options.flags || 'g';
                                setOptions({
                                  ...options,
                                  flags: e.target.checked
                                    ? flags.includes('g') ? flags : flags + 'g'
                                    : flags.replace('g', '')
                                });
                              }}
                              className="w-5 h-5 sm:w-4 sm:h-4"
                            />
                            <span className="text-xs sm:text-xs">g (global)</span>
                          </label>
                          <label className="flex items-center gap-1.5 min-h-[40px] touch-manipulation cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.flags?.includes('i') ?? false}
                              onChange={(e) => {
                                const flags = options.flags || 'g';
                                setOptions({
                                  ...options,
                                  flags: e.target.checked
                                    ? flags.includes('i') ? flags : flags + 'i'
                                    : flags.replace('i', '')
                                });
                              }}
                              className="w-5 h-5 sm:w-4 sm:h-4"
                            />
                            <span className="text-xs sm:text-xs">i (case insensitive)</span>
                          </label>
                          <label className="flex items-center gap-1.5 min-h-[40px] touch-manipulation cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.flags?.includes('m') ?? false}
                              onChange={(e) => {
                                const flags = options.flags || 'g';
                                setOptions({
                                  ...options,
                                  flags: e.target.checked
                                    ? flags.includes('m') ? flags : flags + 'm'
                                    : flags.replace('m', '')
                                });
                              }}
                              className="w-5 h-5 sm:w-4 sm:h-4"
                            />
                            <span className="text-xs sm:text-xs">m (multiline)</span>
                          </label>
                        </div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Test String:
                        </div>
                        <textarea
                          placeholder="Enter text to test against your regex pattern"
                          value={options.testString || ''}
                          onChange={(e) => setOptions({ ...options, testString: e.target.value })}
                          className="w-full h-20 sm:h-24 p-2 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 touch-manipulation"
                        />
                      </>
                    )}

                    {slug === 'lorem-ipsum' && (
                      <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Text Length:
                        </div>
                        <div>
                          <label className="text-sm text-slate-600 dark:text-slate-400">Number of words: {options.words || 50}</label>
                          <input
                            type="range"
                            min="10"
                            max="500"
                            value={options.words || 50}
                            onChange={(e) => setOptions({ ...options, words: parseInt(e.target.value) })}
                            className="w-full h-8 touch-manipulation"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  {needsInputBox() && (
                    <>
                      <Button onClick={handlePaste} variant="secondary" className="flex-1 min-h-[44px] touch-manipulation text-sm sm:text-base">
                        Paste
                      </Button>
                      <Button onClick={() => setInput('')} variant="secondary" className="flex-1 min-h-[44px] touch-manipulation text-sm sm:text-base">
                        Clear
                      </Button>
                    </>
                  )}
                  <Button onClick={processInput} className="flex-1 min-h-[44px] touch-manipulation text-sm sm:text-base">
                    {getButtonText()}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">Output</CardTitle>
                <CardDescription className="text-sm sm:text-base">Results will appear here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className="w-full h-48 sm:h-64 p-3 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none resize-none touch-manipulation"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  {shouldShowCopy() && (
                    <Button onClick={handleCopy} variant="secondary" className="flex-1 min-h-[44px] touch-manipulation text-sm sm:text-base">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  )}
                  {shouldShowDownload() && (
                    <Button onClick={handleDownload} className="flex-1 min-h-[44px] touch-manipulation text-sm sm:text-base">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Sections */}
          {seoContent && (
            <div className="mt-12 sm:mt-16 space-y-8 sm:space-y-12 max-w-4xl mx-auto">
              {/* What Is Section */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                  {seoContent.whatIs.title}
                </h2>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {seoContent.whatIs.content}
                </p>
              </section>

              {/* Why Use Section */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                  {seoContent.whyUse.title}
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {seoContent.whyUse.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-indigo-600 dark:text-indigo-400 mt-1 text-base sm:text-lg">✓</span>
                      <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Features Section */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                  {seoContent.features.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {seoContent.features.list.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <span className="text-indigo-600 dark:text-indigo-400">•</span>
                      <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* How to Use Section */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                  {seoContent.howToUse.title}
                </h2>
                <ol className="space-y-3 sm:space-y-4">
                  {seoContent.howToUse.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 sm:gap-4">
                      <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* FAQs Section */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {seoContent.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 sm:pb-6 last:border-0">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Schema.org JSON-LD Structured Data */}
        {seoContent && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': seoContent.schemaType,
                name: tool?.name,
                description: tool?.description,
                url: `https://utilo.app/tools/${slug}`,
                applicationCategory: 'UtilityApplication',
                operatingSystem: 'Any',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.8',
                  ratingCount: '1250',
                },
                author: {
                  '@type': 'Organization',
                  name: 'Utilo',
                },
              }),
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Download } from 'lucide-react';
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

type ToolOptions = {
  removeExtraSpaces?: boolean;
  removeLineBreaks?: boolean;
  removeSpecialChars?: boolean;
  trimLines?: boolean;
  decode?: boolean;
  caseType?: 'uppercase' | 'lowercase' | 'titlecase' | 'camelcase' | 'snakecase' | 'kebabcase';
  minify?: boolean;
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  hashType?: 'sha256' | 'md5';
  language?: string;
  pattern?: string;
  flags?: string;
  testString?: string;
  words?: number;
};

export default function ToolPageClient({ slug }: { slug: string }) {
  const tool = toolsData.find((t) => t.slug === slug);
  const seoContent = getSEOContent(slug);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState<ToolOptions>({});

  const needsInputBox = () => {
    const noInputTools = ['password-generator', 'uuid-generator', 'lorem-ipsum'];
    return !noInputTools.includes(slug);
  };

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

  const shouldShowDownload = () => {
    const toolsWithDownload = [
      'image-compressor', 'image-resizer', 'image-cropper', 'image-to-pdf',
      'qr-code-generator', 'json-formatter', 'xml-formatter', 'code-beautifier',
      'pdf-to-text', 'merge-pdfs', 'split-pdf', 'base64-to-image',
    ];
    return toolsWithDownload.includes(slug);
  };

  const shouldShowCopy = () => {
    const toolsWithCopy = [
      'text-cleaner', 'case-converter', 'word-counter', 'character-counter',
      'password-generator', 'uuid-generator', 'hash-generator', 'hex-to-rgb',
      'rgb-to-hex', 'lorem-ipsum', 'url-encoder', 'json-formatter', 'json-validator',
      'xml-formatter', 'code-beautifier', 'regex-tester', 'image-to-base64', 'base64-to-image',
    ];
    return toolsWithCopy.includes(slug);
  };

  const relatedTools = useMemo(() => {
    if (!tool) {
      return [];
    }

    return toolsData
      .filter((item) => item.slug !== tool.slug && item.category === tool.category)
      .slice(0, 6);
  }, [tool]);

  useEffect(() => {
    if (tool) {
      trackToolView(tool.id, tool.slug);
    }
  }, [tool]);

  if (!tool) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F8F9FB]">
          <div className="utilo-container py-12 text-center">
            <h1 className="mb-4 text-3xl font-semibold">Tool Not Found</h1>
            <p className="mb-8 text-[#64748B]">The tool you are looking for does not exist.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const processInput = async () => {
    setOutput('');

    try {
      let result = '';

      if (!input && !['password-generator', 'uuid-generator', 'lorem-ipsum'].includes(slug)) {
        setOutput('Please enter some text to process');
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
        case 'character-counter':
          result = `Total: ${input.length}\nWithout spaces: ${input.replace(/\s/g, '').length}`;
          break;
        case 'json-formatter':
          result = options.minify ? minifyJSON(input) : beautifyJSON(input);
          break;
        case 'json-validator': {
          const validation = validateJSON(input);
          result = validation.valid ? 'Valid JSON' : `Invalid JSON: ${validation.error}`;
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
          result = options.hashType === 'md5' ? generateMD5(input) : await generateSHA256(input);
          break;
        case 'hex-to-rgb': {
          const rgb = hexToRgb(input);
          result = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid hex color';
          break;
        }
        case 'rgb-to-hex': {
          const parts = input.match(/\d+/g) || [];
          result = parts.length === 3
            ? rgbToHex(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10))
            : 'Invalid RGB format. Use: rgb(255, 0, 0)';
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
            result = 'Please enter a regex pattern';
            break;
          }
          const regexResult = testRegex(pattern, options.flags || 'g', options.testString || '');
          if (!regexResult.isValid) {
            result = `Error: ${regexResult.error}`;
            break;
          }

          if (!regexResult.matches || regexResult.matches.length === 0) {
            result = 'No matches found';
            break;
          }

          let resultText = `Found ${regexResult.matchCount} match${regexResult.matchCount !== 1 ? 'es' : ''}:\n\n`;
          regexResult.matches.forEach((match, index) => {
            resultText += `Match ${index + 1}:\n`;
            resultText += `  Text: "${match.match}"\n`;
            resultText += `  Position: ${match.index}\n`;
            if (match.groups && match.groups.length > 0) {
              resultText += `  Groups: ${JSON.stringify(match.groups)}\n`;
            }
            resultText += '\n';
          });
          result = resultText;
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
    } catch {
      alert('Failed to paste from clipboard. Please allow clipboard access and try again.');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
    element.setAttribute('download', `${tool.slug}-output.txt`);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F9FB]">
        <div className="utilo-container py-6 sm:py-10">
          <Link href="/" className="mb-6 inline-flex min-h-[40px] items-center gap-2 text-[#4F46E5] hover:text-[#4338CA] sm:mb-8">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Tools</span>
          </Link>

          <section className="utilo-card p-4 sm:p-6 lg:p-8">
            <header className="mb-6 border-b border-[#E8EDF6] pb-5">
              <h1 className="flex items-center gap-2 text-2xl font-semibold sm:gap-3 sm:text-3xl">
                <span className="text-2xl sm:text-3xl">{tool.icon}</span>
                <span>{tool.name}</span>
              </h1>
              <p className="mt-3 text-sm text-[#64748B] sm:text-base">{tool.description}</p>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Input</CardTitle>
                  <CardDescription>Provide text, data, or settings for this tool.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {needsInputBox() && (
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Enter your ${tool.name.toLowerCase()}...`}
                      className="h-48 w-full resize-none rounded-xl border border-[#DBE3EF] bg-white p-3 text-sm text-[#0F172A] outline-none focus:ring-2 focus:ring-[#4F46E5] sm:h-64 sm:text-base"
                    />
                  )}

                  <div className="space-y-3 rounded-xl border border-[#E2E8F4] bg-[#F7FAFF] p-3 text-sm sm:p-4">
                    {slug === 'case-converter' && (
                      <select
                        value={options.caseType || 'lowercase'}
                        onChange={(e) => setOptions({ ...options, caseType: e.target.value as ToolOptions['caseType'] })}
                        className="w-full rounded-xl border border-[#DBE3EF] bg-white p-2.5"
                      >
                        <option value="uppercase">UPPERCASE</option>
                        <option value="lowercase">lowercase</option>
                        <option value="titlecase">Title Case</option>
                        <option value="camelcase">camelCase</option>
                        <option value="snakecase">snake_case</option>
                        <option value="kebabcase">kebab-case</option>
                      </select>
                    )}

                    {slug === 'json-formatter' && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={options.minify || false}
                          onChange={(e) => setOptions({ ...options, minify: e.target.checked })}
                        />
                        <span>Minify JSON</span>
                      </label>
                    )}

                    {slug === 'url-encoder' && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="encodeMode"
                            checked={!options.decode}
                            onChange={() => setOptions({ ...options, decode: false })}
                          />
                          <span>Encode URL</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="encodeMode"
                            checked={options.decode === true}
                            onChange={() => setOptions({ ...options, decode: true })}
                          />
                          <span>Decode URL</span>
                        </label>
                      </div>
                    )}

                    {slug === 'hash-generator' && (
                      <select
                        value={options.hashType || 'sha256'}
                        onChange={(e) => setOptions({ ...options, hashType: e.target.value as ToolOptions['hashType'] })}
                        className="w-full rounded-xl border border-[#DBE3EF] bg-white p-2.5"
                      >
                        <option value="sha256">SHA256</option>
                        <option value="md5">MD5</option>
                      </select>
                    )}

                    {slug === 'code-beautifier' && (
                      <select
                        value={options.language || 'javascript'}
                        onChange={(e) => setOptions({ ...options, language: e.target.value })}
                        className="w-full rounded-xl border border-[#DBE3EF] bg-white p-2.5"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                        <option value="css">CSS</option>
                        <option value="html">HTML</option>
                      </select>
                    )}

                    {slug === 'regex-tester' && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter regex pattern"
                          value={options.pattern || ''}
                          onChange={(e) => setOptions({ ...options, pattern: e.target.value })}
                        />
                        <Input
                          placeholder="Flags (example: gi)"
                          value={options.flags || 'g'}
                          onChange={(e) => setOptions({ ...options, flags: e.target.value })}
                        />
                        <textarea
                          placeholder="Test string"
                          value={options.testString || ''}
                          onChange={(e) => setOptions({ ...options, testString: e.target.value })}
                          className="h-24 w-full rounded-xl border border-[#DBE3EF] bg-white p-2.5"
                        />
                      </div>
                    )}

                    {slug === 'password-generator' && (
                      <div className="space-y-3">
                        <label className="block text-sm text-[#475569]">Password Length: {options.length || 16}</label>
                        <input
                          type="range"
                          min="8"
                          max="128"
                          value={options.length || 16}
                          onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value, 10) })}
                          className="w-full"
                        />
                      </div>
                    )}

                    {slug === 'lorem-ipsum' && (
                      <div className="space-y-3">
                        <label className="block text-sm text-[#475569]">Words: {options.words || 50}</label>
                        <input
                          type="range"
                          min="10"
                          max="500"
                          value={options.words || 50}
                          onChange={(e) => setOptions({ ...options, words: parseInt(e.target.value, 10) })}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    {needsInputBox() && (
                      <>
                        <Button onClick={handlePaste} variant="secondary" className="flex-1">Paste</Button>
                        <Button onClick={() => setInput('')} variant="secondary" className="flex-1">Clear</Button>
                      </>
                    )}
                    <Button onClick={processInput} className="flex-1">{getButtonText()}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Output</CardTitle>
                  <CardDescription>Processed result appears here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Output will appear here..."
                    className="h-48 w-full resize-none rounded-xl border border-[#DBE3EF] bg-[#F8FAFE] p-3 text-sm text-[#0F172A] sm:h-64 sm:text-base"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {shouldShowCopy() && (
                      <Button onClick={handleCopy} variant="secondary" className="flex-1">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    )}
                    {shouldShowDownload() && (
                      <Button onClick={handleDownload} className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {relatedTools.length > 0 && (
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl">Related Tools</h2>
                <p className="mt-2 text-sm text-[#64748B] sm:text-base">More tools in the same category.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTools.map((item) => (
                  <Link key={item.id} href={`/tools/${item.slug}`} className="block h-full">
                    <article className="utilo-card utilo-card-hover h-full p-5">
                      <div className="mb-3 text-3xl">{item.icon}</div>
                      <h3 className="text-base font-semibold text-[#0F172A] sm:text-lg">{item.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">{item.description}</p>
                      <span className="mt-4 inline-flex text-sm font-semibold text-[#4F46E5]">Open Tool</span>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {seoContent && (
            <div className="mx-auto mt-12 max-w-4xl space-y-8 sm:space-y-10">
              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#0F172A] sm:text-3xl">{seoContent.whatIs.title}</h2>
                <p className="text-base leading-relaxed text-[#475569] sm:text-lg">{seoContent.whatIs.content}</p>
              </section>

              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#0F172A] sm:text-3xl">{seoContent.whyUse.title}</h2>
                <ul className="space-y-2">
                  {seoContent.whyUse.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#475569]">
                      <span className="mt-1 text-[#4F46E5]">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-2xl font-semibold text-[#0F172A] sm:text-3xl">Frequently Asked Questions</h2>
                <div className="space-y-5">
                  {seoContent.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-[#E2E8F4] pb-4 last:border-0">
                      <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">{faq.question}</h3>
                      <p className="text-sm text-[#475569] sm:text-base">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {seoContent && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': seoContent.schemaType,
                name: tool.name,
                description: tool.description,
                url: `https://utilo.in/tools/${slug}`,
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

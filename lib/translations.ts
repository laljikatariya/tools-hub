// English translations only
export interface Translations {
  // Header
  feedback: string;

  // Homepage
  freeOnlineTools: string;
  everythingYouNeed: string;
  inOnePlace: string;
  powerfulOnlineTools: string;
  fastSecureFree: string;
  browseAllTools: string;
  searchTools: string;
  trySearch: string;
  foundTools: string;
  tool: string;
  tools: string;
  matching: string;
  clearSearch: string;

  // Categories
  allTools: string;
  textTools: string;
  imageTools: string;
  pdfTools: string;
  colorTools: string;
  developerTools: string;
  securityTools: string;

  // Category labels (shortened)
  text: string;
  image: string;
  pdf: string;
  color: string;
  developer: string;
  security: string;

  // Sections
  trending: string;
  trendingTools: string;
  popularToolsUsage: string;
  searchResults: string;
  available: string;

  // Actions
  tryNow: string;
  openTool: string;
  clearFilters: string;
  backToTools: string;
  noToolsFound: string;
  tryDifferentSearch: string;
  bestMatch: string;
  tipSortedByRelevance: string;
  generate: string;
  download: string;
  upload: string;
  clear: string;
  copy: string;
  paste: string;
  reset: string;
  convert: string;
  compress: string;
  resize: string;
  crop: string;
  merge: string;
  split: string;
  format: string;
  validate: string;
  categories: string;
  popularTools: string;
  support: string;
  faq: string;
  privacyPolicy: string;
  contactUs: string;
  allRightsReserved: string;
  madeWithLove: string;
}

export const translations: Translations = {
  feedback: 'Feedback',
  freeOnlineTools: '30+ Free Online Tools',
  everythingYouNeed: 'Everything You Need',
  inOnePlace: 'In One Place',
  powerfulOnlineTools: 'Powerful online tools for text, images, PDFs, colors and development.',
  fastSecureFree: 'Fast, secure, and completely free.',
  browseAllTools: 'Browse All Tools',
  searchTools: 'Search Tools',
  trySearch: "Try 'QR Code', 'JSON', 'Password'...",
  foundTools: 'Found',
  tool: 'tool',
  tools: 'tools',
  matching: 'matching',
  clearSearch: 'Clear search',
  allTools: 'All Tools',
  textTools: 'Text Tools',
  imageTools: 'Image Tools',
  pdfTools: 'PDF Tools',
  colorTools: 'Color Tools',
  developerTools: 'Developer Tools',
  securityTools: 'Security Tools',
  text: 'Text',
  image: 'Image',
  pdf: 'PDF',
  color: 'Color',
  developer: 'Developer',
  security: 'Security',
  trending: 'Trending',
  trendingTools: 'Trending Tools',
  popularToolsUsage: 'Most popular tools based on usage and searches',
  searchResults: 'Search Results',
  available: 'available',
  tryNow: 'Try Now',
  openTool: 'Open Tool',
  clearFilters: 'Clear Filters',
  backToTools: 'Back to Tools',
  noToolsFound: 'No tools found',
  tryDifferentSearch: 'Try a different search term or browse all categories',
  bestMatch: 'Best Match',
  tipSortedByRelevance: 'Results are sorted by relevance. The best match appears first.',
  generate: 'Generate',
  download: 'Download',
  upload: 'Upload',
  clear: 'Clear',
  copy: 'Copy',
  paste: 'Paste',
  reset: 'Reset',
  convert: 'Convert',
  compress: 'Compress',
  resize: 'Resize',
  crop: 'Crop',
  merge: 'Merge',
  split: 'Split',
  format: 'Format',
  validate: 'Validate',
  categories: 'Categories',
  popularTools: 'Popular Tools',
  support: 'Support',
  faq: 'FAQ',
  privacyPolicy: 'Privacy Policy',
  contactUs: 'Contact Us',
  allRightsReserved: 'All rights reserved.',
  madeWithLove: 'Made with ❤️ for developers',
};

// Tool name translations (keeping only English)
export const toolNameTranslations: Record<string, string> = {
  'base64-to-image': 'Base64 to Image',
  'case-converter': 'Case Converter',
  'character-counter': 'Character Counter',
  'code-beautifier': 'Code Beautifier',
  'color-picker': 'Color Picker',
  'gradient-generator': 'Gradient Generator',
  'hash-generator': 'Hash Generator',
  'hex-to-rgb': 'Hex to RGB',
  'image-compressor': 'Image Compressor',
  'image-cropper': 'Image Cropper',
  'image-resizer': 'Image Resizer',
  'image-to-base64': 'Image to Base64',
  'image-to-pdf': 'Image to PDF',
  'ip-lookup': 'IP Lookup',
  'json-formatter': 'JSON Formatter',
  'json-validator': 'JSON Validator',
  'lorem-ipsum': 'Lorem Ipsum',
  'merge-pdfs': 'Merge PDFs',
  'password-generator': 'Password Generator',
  'pdf-to-text': 'PDF to Text',
  'qr-code-generator': 'QR Code Generator',
  'qr-code-scanner': 'QR Code Scanner',
  'regex-tester': 'Regex Tester',
  'rgb-to-hex': 'RGB to Hex',
  'split-pdf': 'Split PDF',
  'text-cleaner': 'Text Cleaner',
  'url-encoder': 'URL Encoder',
  'uuid-generator': 'UUID Generator',
  'word-counter': 'Word Counter',
  'xml-formatter': 'XML Formatter',
};

export function getTranslation(): Translations {
  return translations;
}

export function getToolName(slug: string): string {
  return toolNameTranslations[slug] || slug;
}

import { getToolName } from './translations';

export interface Tool {
  id: number;
  name: string;
  category: 'text' | 'image' | 'pdf' | 'color' | 'developer' | 'security';
  icon: string;
  description: string;
  slug: string;
  trending?: boolean;
}

// Helper function to get translated tool name
export function getTranslatedToolName(tool: Tool): string {
  return getToolName(tool.slug);
}

export const toolsData: Tool[] = [
  // Text Tools
  {
    id: 1,
    name: 'Text Cleaner',
    category: 'text',
    icon: '🧹',
    description: 'Remove extra spaces, line breaks, and formatting',
    slug: 'text-cleaner',
    trending: true,
  },
  {
    id: 2,
    name: 'Case Converter',
    category: 'text',
    icon: 'Aa',
    description: 'Convert text to uppercase, lowercase, or title case',
    slug: 'case-converter',
  },
  {
    id: 3,
    name: 'Word Counter',
    category: 'text',
    icon: '📊',
    description: 'Count words, characters, sentences, and paragraphs',
    slug: 'word-counter',
    trending: true,
  },
  {
    id: 4,
    name: 'Character Counter',
    category: 'text',
    icon: '🔢',
    description: 'Count total characters with and without spaces',
    slug: 'character-counter',
  },
  {
    id: 5,
    name: 'JSON Formatter',
    category: 'text',
    icon: '{}',
    description: 'Beautify, minify, and validate JSON code',
    slug: 'json-formatter',
    trending: true,
  },
  {
    id: 6,
    name: 'XML Formatter',
    category: 'text',
    icon: '⟨⟩',
    description: 'Format and validate XML documents',
    slug: 'xml-formatter',
  },
  {
    id: 7,
    name: 'Code Beautifier',
    category: 'text',
    icon: '✨',
    description: 'Beautify and format source code',
    slug: 'code-beautifier',
  },
  {
    id: 8,
    name: 'Lorem Ipsum Generator',
    category: 'text',
    icon: '📝',
    description: 'Generate dummy text for mockups and designs',
    slug: 'lorem-ipsum',
  },
  {
    id: 9,
    name: 'URL Encoder/Decoder',
    category: 'text',
    icon: '🔗',
    description: 'Encode and decode URL parameters',
    slug: 'url-encoder',
  },

  // Image Tools
  {
    id: 10,
    name: 'Image Compressor',
    category: 'image',
    icon: '📦',
    description: 'Compress images without losing quality',
    slug: 'image-compressor',
    trending: true,
  },
  {
    id: 11,
    name: 'Image to Base64',
    category: 'image',
    icon: '🔄',
    description: 'Convert images to Base64 encoding',
    slug: 'image-to-base64',
  },
  {
    id: 12,
    name: 'Base64 to Image',
    category: 'image',
    icon: '🔄',
    description: 'Convert Base64 strings back to images',
    slug: 'base64-to-image',
  },
  {
    id: 13,
    name: 'Image Resizer',
    category: 'image',
    icon: '📐',
    description: 'Resize images to custom dimensions',
    slug: 'image-resizer',
  },
  {
    id: 14,
    name: 'Image Cropper',
    category: 'image',
    icon: '✂️',
    description: 'Crop images to desired size and aspect ratio',
    slug: 'image-cropper',
  },

  // PDF Tools
  {
    id: 15,
    name: 'PDF to Text',
    category: 'pdf',
    icon: '📄',
    description: 'Extract text from PDF documents',
    slug: 'pdf-to-text',
  },
  {
    id: 16,
    name: 'Image to PDF',
    category: 'pdf',
    icon: '📸',
    description: 'Convert images to PDF documents',
    slug: 'image-to-pdf',
    trending: true,
  },
  {
    id: 17,
    name: 'Merge PDFs',
    category: 'pdf',
    icon: '🔗',
    description: 'Combine multiple PDF files into one',
    slug: 'merge-pdfs',
  },
  {
    id: 18,
    name: 'Split PDF',
    category: 'pdf',
    icon: '✂️',
    description: 'Split PDF documents into separate pages',
    slug: 'split-pdf',
  },

  // Color Tools
  {
    id: 19,
    name: 'Color Picker',
    category: 'color',
    icon: '🎨',
    description: 'Pick and explore colors interactively',
    slug: 'color-picker',
    trending: true,
  },
  {
    id: 20,
    name: 'HEX to RGB',
    category: 'color',
    icon: '#️⃣',
    description: 'Convert hexadecimal colors to RGB format',
    slug: 'hex-to-rgb',
  },
  {
    id: 21,
    name: 'RGB to HEX',
    category: 'color',
    icon: '#️⃣',
    description: 'Convert RGB colors to hexadecimal format',
    slug: 'rgb-to-hex',
  },
  {
    id: 22,
    name: 'Gradient Generator',
    category: 'color',
    icon: '🌈',
    description: 'Create beautiful color gradients',
    slug: 'gradient-generator',
  },

  // Developer Tools
  {
    id: 23,
    name: 'UUID Generator',
    category: 'developer',
    icon: '🆔',
    description: 'Generate unique identifier codes',
    slug: 'uuid-generator',
    trending: true,
  },
  {
    id: 24,
    name: 'Hash Generator',
    category: 'developer',
    icon: '🔐',
    description: 'Generate SHA256 and MD5 hashes',
    slug: 'hash-generator',
  },
  {
    id: 25,
    name: 'Regex Tester',
    category: 'developer',
    icon: '🔍',
    description: 'Test and validate regular expressions',
    slug: 'regex-tester',
  },
  {
    id: 26,
    name: 'JSON Validator',
    category: 'developer',
    icon: '✅',
    description: 'Validate JSON syntax and structure',
    slug: 'json-validator',
  },

  // Security & Utility Tools
  {
    id: 27,
    name: 'Password Generator',
    category: 'security',
    icon: '🔑',
    description: 'Generate strong, secure passwords',
    slug: 'password-generator',
    trending: true,
  },
  {
    id: 28,
    name: 'QR Code Generator',
    category: 'security',
    icon: '📱',
    description: 'Create QR codes for text and URLs',
    slug: 'qr-code-generator',
    trending: true,
  },
  {
    id: 29,
    name: 'QR Code Scanner',
    category: 'security',
    icon: '📸',
    description: 'Scan and decode QR codes',
    slug: 'qr-code-scanner',
  },
  {
    id: 30,
    name: 'IP Address Lookup',
    category: 'security',
    icon: '🌐',
    description: 'Get information about IP addresses',
    slug: 'ip-lookup',
  },
];

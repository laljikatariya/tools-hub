import crypto from 'crypto';

// Base64 encoding/decoding
export const base64Encode = (str: string): string => {
  try {
    return Buffer.from(str).toString('base64');
  } catch {
    return '';
  }
};

export const base64Decode = (str: string): string => {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return '';
  }
};

// UUID generation (browser-compatible)
export const generateUUID = (): string => {
  // Check if crypto.randomUUID is available (modern browsers and Node.js)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// SHA256 hashing (browser-compatible using Web Crypto API)
export const generateSHA256 = async (str: string): Promise<string> => {
  if (typeof window === 'undefined') {
    // Server-side (Node.js)
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(str).digest('hex');
  }
  // Browser - use Web Crypto API
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('SHA256 hashing requires a secure context (HTTPS or localhost). Please access the site via HTTPS.');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// MD5 hashing (browser-compatible using simple implementation)
export const generateMD5 = (str: string): string => {
  // Simple MD5 implementation for browser compatibility
  // Note: For production, consider using a proper crypto library
  
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function add32(a: number, b: number) {
    return (a + b) & 0xFFFFFFFF;
  }

  function md51(s: string) {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  function md5blk(s: string) {
    const md5blks = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  const hex_chr = '0123456789abcdef'.split('');

  function rhex(n: number) {
    let s = '';
    for (let j = 0; j < 4; j++)
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
  }

  function hex(x: number[]): string {
    const result: string[] = [];
    for (let i = 0; i < x.length; i++)
      result[i] = rhex(x[i]);
    return result.join('');
  }

  return hex(md51(str));
};

// URL encoding/decoding
export const urlEncode = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch (error) {
    throw new Error('Failed to encode URL: ' + (error as Error).message);
  }
};

export const urlDecode = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    throw new Error('Failed to decode URL: ' + (error as Error).message);
  }
};

// JSON utilities
export const beautifyJSON = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
};

export const minifyJSON = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON: ' + (error as Error).message);
  }
};

export const validateJSON = (json: string): { valid: boolean; error?: string } => {
  try {
    JSON.parse(json);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// Text utilities
export const cleanText = (text: string, options?: {
  removeExtraSpaces?: boolean;
  removeLineBreaks?: boolean;
  removeSpecialChars?: boolean;
  trimLines?: boolean;
}): string => {
  let cleaned = text;
  
  // Default options: all enabled
  const opts = {
    removeExtraSpaces: options?.removeExtraSpaces !== false,
    removeLineBreaks: options?.removeLineBreaks !== false,
    removeSpecialChars: options?.removeSpecialChars ?? false,
    trimLines: options?.trimLines !== false,
  };
  
  // Remove multiple spaces
  if (opts.removeExtraSpaces) {
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
  }
  
  // Remove multiple line breaks (keep max 2)
  if (opts.removeLineBreaks) {
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  }
  
  // Remove special characters (keep alphanumeric and basic punctuation)
  if (opts.removeSpecialChars) {
    cleaned = cleaned.replace(/[^\w\s.,!?;:()\-"']/g, '');
  }
  
  // Trim spaces at start/end of lines
  if (opts.trimLines) {
    cleaned = cleaned
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  }
  
  // Remove leading/trailing whitespace
  return cleaned.trim();
};

export const convertCase = (
  text: string,
  caseType: 'uppercase' | 'lowercase' | 'titlecase' | 'camelcase' | 'snakecase' | 'kebabcase'
): string => {
  switch (caseType) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text
        .toLowerCase()
        .replace(/(?:^|\s|-|_)\S/g, (char) => char.toUpperCase());
    case 'camelcase':
      return text
        .trim()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (char) => char.toLowerCase());
    case 'snakecase':
      return text
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[A-Z]/g, (char) => '_' + char.toLowerCase())
        .replace(/[^a-z0-9_]/g, '')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');
    case 'kebabcase':
      return text
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[A-Z]/g, (char) => '-' + char.toLowerCase())
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '');
    default:
      return text;
  }
};

// Word/Character counters
export const countText = (text: string) => {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\n+/).length : 0;
  const lines = trimmed ? trimmed.split('\n').length : 0;

  // Calculate additional statistics
  const avgWordLength = words > 0 ? (charsNoSpace / words).toFixed(1) : '0';
  const avgSentenceLength = sentences > 0 ? (words / sentences).toFixed(1) : '0';
  const readingTime = Math.ceil(words / 200); // avg reading speed: 200 words/min
  const speakingTime = Math.ceil(words / 150); // avg speaking speed: 150 words/min
  
  // Count unique words
  const wordMatches = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(wordMatches).size;

  return { 
    words, 
    chars, 
    charsNoSpace, 
    sentences, 
    paragraphs, 
    lines,
    avgWordLength,
    avgSentenceLength,
    readingTime,
    speakingTime,
    uniqueWords
  };
};

// Get top words from text
export const getTopWords = (text: string, limit: number = 5): [string, number][] => {
  if (!text.trim()) return [];
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how']);
  
  const wordCount = new Map<string, number>();
  
  words.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  });
  
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};

// Password generation
export const generatePassword = (options: {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let characters = '';
  if (options.uppercase) characters += uppercase;
  if (options.lowercase) characters += lowercase;
  if (options.numbers) characters += numbers;
  if (options.symbols) characters += symbols;

  if (!characters) characters = lowercase;

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

// Color utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

// Lorem ipsum
export const generateLoremIpsum = (words: number): string => {
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  let result = [];
  let sentenceWordCount = 0;
  const minSentenceLength = 10;
  const maxSentenceLength = 20;
  let nextSentenceLength = Math.floor(Math.random() * (maxSentenceLength - minSentenceLength + 1)) + minSentenceLength;
  
  for (let i = 0; i < words; i++) {
    const word = loremWords[Math.floor(Math.random() * loremWords.length)];
    
    if (sentenceWordCount === 0) {
      // Capitalize first word of sentence
      result.push(word.charAt(0).toUpperCase() + word.slice(1));
    } else {
      result.push(word);
    }
    
    sentenceWordCount++;
    
    // End sentence after random number of words
    if (sentenceWordCount >= nextSentenceLength || i === words - 1) {
      result[result.length - 1] += '.';
      sentenceWordCount = 0;
      // Generate new random sentence length for next sentence
      nextSentenceLength = Math.floor(Math.random() * (maxSentenceLength - minSentenceLength + 1)) + minSentenceLength;
    }
  }
  
  return result.join(' ');
};

// XML formatting
export const beautifyXML = (xml: string): string => {
  try {
    // Remove all whitespace between tags but preserve content
    const cleaned = xml.replace(/>\s+</g, '><').trim();
    
    let formatted = '';
    let indent = 0;
    const indentStr = '  ';
    
    // Split into tokens (tags and text content)
    const tokens = cleaned.split(/(<[^>]+>)/g).filter(token => token);
    
    tokens.forEach((token) => {
      const trimmed = token.trim();
      if (!trimmed) return;
      
      if (token.match(/^<\//)) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        formatted += indentStr.repeat(indent) + token + '\n';
      } else if (token.match(/^<[^>]+\/>/)) {
        // Self-closing tag
        formatted += indentStr.repeat(indent) + token + '\n';
      } else if (token.match(/^<[^/][^>]*>$/)) {
        // Opening tag (not self-closing, not closing)
        formatted += indentStr.repeat(indent) + token + '\n';
        // Don't increase indent for inline tags like br, img, input, etc.
        if (!token.match(/<(br|img|input|hr|meta|link|area|base|col|embed|param|source|track|wbr)/i)) {
          indent++;
        }
      } else if (token.match(/^<![^>]+>/)) {
        // Comments, CDATA, DOCTYPE
        formatted += indentStr.repeat(indent) + token + '\n';
      } else {
        // Text content
        if (trimmed) {
          formatted += indentStr.repeat(indent) + trimmed + '\n';
        }
      }
    });
    
    return formatted.trim();
  } catch (error) {
    throw new Error('Invalid XML/HTML: ' + (error as Error).message);
  }
};

// Code beautifier (basic implementation for JS/CSS)
export const beautifyCode = (code: string, language: string): string => {
  try {
    if (language === 'json') {
      return beautifyJSON(code);
    }
    if (language === 'xml' || language === 'html') {
      return beautifyXML(code);
    }
    
    // Basic beautification for JavaScript and CSS
    if (language === 'javascript') {
      return beautifyJavaScript(code);
    }
    
    if (language === 'css') {
      return beautifyCSS(code);
    }
    
    // For other languages, just normalize spacing
    return code.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  } catch (error) {
    throw new Error('Code formatting error: ' + (error as Error).message);
  }
};

// Beautify JavaScript code
const beautifyJavaScript = (code: string): string => {
  let formatted = code.replace(/\s+/g, ' ').trim();
  let indent = 0;
  const lines: string[] = [];
  const indentStr = '  ';
  
  // Add spaces around operators
  formatted = formatted
    .replace(/([=+\-*/<>!&|])(=)/g, '$1$2 ')
    .replace(/([^=+\-*/<>!&|])([=+\-*/<>])/g, '$1 $2')
    .replace(/([=+\-*/<>])([^=+\-*/<>])/g, '$1 $2');
  
  // Split by brackets, semicolons, and parentheses
  const tokens = formatted.split(/(\{|\}|;|\n)/g);
  
  tokens.forEach((token, index) => {
    const trimmed = token.trim();
    if (!trimmed) return;
    
    if (trimmed === '}') {
      indent = Math.max(0, indent - 1);
      lines.push(indentStr.repeat(indent) + trimmed);
    } else if (trimmed === '{') {
      // Check if previous line exists and append brace if it's on the same line
      if (lines.length > 0 && tokens[index - 1] && !tokens[index - 1].includes('\n')) {
        lines[lines.length - 1] += ' {';
      } else {
        lines.push(indentStr.repeat(indent) + trimmed);
      }
      indent++;
    } else if (trimmed === ';') {
      if (lines.length > 0) {
        lines[lines.length - 1] += ';';
      }
    } else {
      lines.push(indentStr.repeat(indent) + trimmed);
    }
  });
  
  return lines.join('\n');
};

// Beautify CSS code
const beautifyCSS = (code: string): string => {
  let formatted = code.replace(/\s+/g, ' ').trim();
  let indent = 0;
  const lines: string[] = [];
  const indentStr = '  ';
  
  // Add line breaks after semicolons and braces
  formatted = formatted
    .replace(/;/g, ';\n')
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n');
  
  const splitLines = formatted.split('\n');
  
  splitLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed === '}') {
      indent = Math.max(0, indent - 1);
      lines.push(indentStr.repeat(indent) + trimmed);
    } else if (trimmed.includes('{')) {
      lines.push(indentStr.repeat(indent) + trimmed);
      indent++;
    } else {
      lines.push(indentStr.repeat(indent) + trimmed);
    }
  });
  
  return lines.join('\n');
};

// Regex tester
export const testRegex = (pattern: string, flags: string, testString: string): {
  matches: Array<{match: string; index: number; groups?: string[]}> | null;
  isValid: boolean;
  error?: string;
  matchCount: number;
} => {
  try {
    if (!pattern) {
      return { matches: null, isValid: false, error: 'Pattern is required', matchCount: 0 };
    }
    
    const regex = new RegExp(pattern, flags);
    const matches: Array<{match: string; index: number; groups?: string[]}> = [];
    
    if (flags.includes('g')) {
      // Global flag: find all matches
      let match;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.length > 1 ? match.slice(1) : undefined
        });
        
        // Prevent infinite loop on zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      // Non-global: find first match only
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.length > 1 ? match.slice(1) : undefined
        });
      }
    }
    
    return { 
      matches: matches.length > 0 ? matches : null, 
      isValid: true, 
      matchCount: matches.length 
    };
  } catch (error) {
    return { 
      matches: null, 
      isValid: false, 
      error: (error as Error).message,
      matchCount: 0
    };
  }
};

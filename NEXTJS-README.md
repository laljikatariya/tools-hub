# Utilo - Next.js Version 🧰

A modern, fast, and beautiful online tools hub built with **Next.js 15**, **React 18**, **Tailwind CSS**, and **ShadCN UI components**.

## ✨ What's New

### Technology Stack Upgrade
- ✅ **Next.js 15** with App Router for better performance and DX
- ✅ **React 18** with latest features
- ✅ **Tailwind CSS** for modern, responsive styling
- ✅ **ShadCN UI** components for consistent design
- ✅ **TypeScript** for type safety
- ✅ **Next Themes** for seamless dark mode support
- ✅ **Lucide React** for beautiful icons

### Architecture Improvements
- Component-based architecture with reusable UI components
- Utility functions organized in `/lib` directory
- Type-safe tool data management
- Server-side and client-side rendering optimization
- Improved image optimization (Next.js built-in)

### Developer Experience
- Hot module reloading with Next.js dev server
- Better error messages and debugging
- TypeScript support out of the box
- ESLint configured for code quality
- Tailwind CSS IntelliSense

## 🚀 Getting Started

### Installation

```bash
# Navigate to project directory
cd Utilo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000` (or next available port)

### Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📁 Project Structure

```
Utilo/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page with tool grid
│   ├── providers.tsx        # Next Themes provider
│   ├── globals.css          # Global styles & Tailwind
│   ├── components/          # App-specific components
│   │   ├── header.tsx       # Header with navigation
│   │   └── theme-toggle.tsx # Dark mode toggle
│   ├── tools/               # Tool pages
│   │   ├── [slug]/          # Dynamic tool page route
│   │   └── word-counter/    # Example specific tool
│   └── hooks/               # Custom React hooks
├── components/
│   └── ui/                  # Reusable ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── cn.ts                # Class name utilities
│   ├── tools-data.ts        # Tool definitions and metadata
│   └── ...
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── next.config.mjs          # Next.js configuration
```

## 🛠️ 30 Tools Included

### 📝 Text Tools (9)
- Text Cleaner
- Case Converter
- Word Counter
- Character Counter
- JSON Formatter
- XML Formatter
- Code Beautifier
- Lorem Ipsum Generator
- URL Encoder/Decoder

### 🖼️ Image Tools (5)
- Image Compressor
- Image to Base64
- Base64 to Image
- Image Resizer
- Image Cropper

### 📄 PDF Tools (4)
- PDF to Text
- Image to PDF
- Merge PDFs
- Split PDF

### 🎨 Color Tools (4)
- Color Picker
- HEX to RGB
- RGB to HEX
- Gradient Generator

### 🔢 Developer Tools (4)
- UUID Generator
- Hash Generator (SHA256/MD5)
- Regex Tester
- JSON Validator

### 🔒 Security/Utility Tools (4)
- Password Generator
- QR Code Generator
- QR Code Scanner
- IP Address Lookup

## 🎨 UI Components

### Available ShadCN Components
- `Button` - Versatile button component with variants
- `Input` - Text input field with validation
- `Card` - Container component for content
  - `CardHeader` - Card title area
  - `CardTitle` - Main heading
  - `CardDescription` - Subtitle
  - `CardContent` - Main content area
  - `CardFooter` - Footer section

### Creating New Components
All UI components are in `/components/ui/`. To create a new component:

```tsx
// Example: New select component
'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900',
        className
      )}
      {...props}
    />
  )
);

export { Select };
```

## 🌙 Dark Mode

Dark mode is automatically handled by `next-themes`:
- Respects system preference
- Toggle available in header
- Persists to localStorage
- Smooth transitions

## 🎯 Creating New Tools

### 1. Add Tool to `lib/tools-data.ts`

```typescript
export const toolsData: Tool[] = [
  {
    id: 31,
    name: 'My New Tool',
    category: 'text',
    icon: '🔧',
    description: 'Tool description',
    slug: 'my-new-tool',
    trending: false,
  },
  // ... other tools
];
```

### 2. Implement Tool Logic

Add function to `lib/utils.ts`:

```typescript
export const myToolFunction = (input: string) => {
  // Your logic here
  return result;
};
```

### 3. Create Tool Page

Create `/app/tools/my-new-tool/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Header } from '@/app/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { myToolFunction } from '@/lib/utils';

export default function MyNewToolPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleProcess = () => {
    setOutput(myToolFunction(input));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900">
        {/* Tool UI */}
      </main>
    </>
  );
}
```

## 📊 Performance

- **Fast Load Times**: Next.js optimization
- **Automatic Code Splitting**: Only load what's needed
- **Image Optimization**: Built-in image optimization
- **CSS Optimization**: Tailwind purges unused styles
- **Minimal JavaScript**: Client-side processing only

## 🔒 Privacy

- ✅ 100% client-side processing
- ✅ No data sent to servers
- ✅ No cookies or tracking
- ✅ No ads
- ✅ No accounts required

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy the `out` directory or connect your Git repo
```

### Deploy to Custom Server

```bash
# Build
npm run build

# Start production server
npm start
```

## 🤝 Contributing

### Adding Features
1. Create a new branch
2. Make your changes
3. Test locally with `npm run dev`
4. Submit a pull request

### Code Style
- Use TypeScript
- Follow ESLint rules
- Use Tailwind classes
- Keep components small and focused

## 📚 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [ShadCN UI Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Lint check
npm run lint
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🎉 What's Next?

Potential enhancements:
- [ ] Add image editing tools with canvas
- [ ] PDF manipulation with advanced features
- [ ] Real-time collaboration features
- [ ] Browser extension version
- [ ] Mobile app with React Native
- [ ] API for third-party integration
- [ ] Plugin system for community tools

## 💬 Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Join our community discussions

---

**Built with ❤️ for developers, designers, and content creators**

Made with Next.js 15 • React 18 • Tailwind CSS • ShadCN UI

*Version 2.0 - Modern, Fast, Beautiful*

# Utilo - 30 Powerful Online Tools

A modern, responsive web application featuring 30 free online tools for text, images, PDFs, colors, developers, and security. Built with vanilla HTML, CSS, and JavaScript with dark mode support.

## 🎯 Features

- **30 Powerful Tools** across 6 categories
- **Dark Mode Toggle** with persistent storage
- **Mobile-First Responsive Design** - works perfectly on all devices
- **Fast & Lightweight** - No heavy frameworks, pure vanilla JavaScript
- **Beautiful UI** with smooth animations and transitions
- **Copy & Download** functionality for all tools
- **Real-time Processing** for most tools

## 📚 Tool Categories

### 📝 Text Tools (9 Tools)
1. **Text Cleaner** - Remove extra spaces, line breaks, and formatting
2. **Case Converter** - Convert to uppercase, lowercase, title case, camelCase, snake_case, kebab-case
3. **Word Counter** - Count words, characters, sentences, paragraphs
4. **Character Counter** - Count with/without spaces, letters, numbers
5. **JSON Formatter** - Beautify, minify, and validate JSON
6. **XML Formatter** - Format and validate XML documents
7. **Code Beautifier** - Beautify HTML, CSS, JavaScript, JSON, XML
8. **Lorem Ipsum Generator** - Generate dummy text for mockups
9. **URL Encoder/Decoder** - Encode and decode URL parameters

### 🖼️ Image Tools (5 Tools)
10. **Image Compressor** - Compress images with quality control
11. **Image to Base64** - Convert images to Base64 encoding
12. **Base64 to Image** - Convert Base64 strings back to images
13. **Image Resizer** - Resize images to custom dimensions
14. **Image Cropper** - Crop images to desired size

### 📄 PDF Tools (4 Tools)
15. **PDF to Text** - Extract text from PDF documents
16. **Image to PDF** - Convert images to PDF documents
17. **Merge PDFs** - Combine multiple PDF files
18. **Split PDF** - Split PDF into separate pages

### 🎨 Color Tools (4 Tools)
19. **Color Picker** - Interactive color selection with HEX, RGB, HSL
20. **HEX to RGB** - Convert hexadecimal colors to RGB format
21. **RGB to HEX** - Convert RGB colors to hexadecimal format
22. **Gradient Generator** - Create beautiful color gradients

### 🔢 Developer Tools (4 Tools)
23. **UUID Generator** - Generate unique identifier codes
24. **Hash Generator** - Generate SHA256 and MD5 hashes
25. **Regex Tester** - Test and validate regular expressions
26. **JSON Validator** - Validate JSON syntax and structure

### 🔑 Security & Utility Tools (4 Tools)
27. **Password Generator** - Generate strong, secure passwords
28. **QR Code Generator** - Create QR codes for text and URLs
29. **QR Code Scanner** - Scan and decode QR codes
30. **IP Address Lookup** - Get information about IP addresses

## 🚀 Quick Start

### Installation

No installation required! Just open the files in a browser.

1. Download or clone the repository
2. Open `index.html` in your web browser
3. That's it! Start using the tools

### File Structure

```
Utilo/
├── index.html                 # Home page
├── css/
│   └── style.css             # All styles with dark mode support
├── js/
│   └── utils.js              # Shared utility functions
├── pages/                    # Individual tool pages (30 files)
│   ├── text-cleaner.html
│   ├── case-converter.html
│   ├── word-counter.html
│   ├── character-counter.html
│   ├── json-formatter.html
│   ├── xml-formatter.html
│   ├── code-beautifier.html
│   ├── lorem-ipsum.html
│   ├── url-encoder.html
│   ├── image-compressor.html
│   ├── image-to-base64.html
│   ├── base64-to-image.html
│   ├── image-resizer.html
│   ├── image-cropper.html
│   ├── pdf-to-text.html
│   ├── image-to-pdf.html
│   ├── merge-pdfs.html
│   ├── split-pdf.html
│   ├── color-picker.html
│   ├── hex-to-rgb.html
│   ├── rgb-to-hex.html
│   ├── gradient-generator.html
│   ├── uuid-generator.html
│   ├── hash-generator.html
│   ├── regex-tester.html
│   ├── json-validator.html
│   ├── password-generator.html
│   ├── qr-code-generator.html
│   ├── qr-code-scanner.html
│   └── ip-lookup.html
└── README.md
```

## 🎨 Design Features

### Responsive Layout
- **Desktop View**: Two-column layout (Input on left, Output on right)
- **Mobile View**: Single column stack layout
- Works seamlessly on all screen sizes

### Color Scheme
- **Light Mode**: Clean, professional white and gray tones
- **Dark Mode**: Dark blue-gray background for comfortable viewing
- Smooth theme transitions with localStorage persistence

### Accessibility
- Keyboard navigation support
- Clear, readable typography
- High contrast ratios for visibility
- Semantic HTML structure

## 🔧 Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No frameworks, pure JS
- **External Libraries** (CDN):
  - QR Code JS - For QR code generation
  - PDF.js - For PDF text extraction
  - HTML2PDF - For image to PDF conversion
  - jsQR - For QR code scanning

## 💾 How to Use

### Text Tools
1. Open the tool from home page
2. Enter your text in the input area
3. Select options if available
4. View results in real-time or click process button
5. Copy or download results

### Image Tools
1. Upload an image using the file input
2. Adjust settings if needed
3. Process the image
4. Preview the result
5. Download the processed image

### Color Tools
1. Pick a color using the color picker
2. See conversions in real-time
3. Copy any format (HEX, RGB, HSL)
4. Generate gradients and get CSS code

### Developer Tools
1. Paste or type your code/data
2. Select options if needed
3. Get instant validation or processing
4. Copy the output

## 🌙 Dark Mode

- Toggle dark mode using the moon icon (🌙) in the header
- Theme preference is saved in browser's localStorage
- Automatically applies your last selected theme on page reload

## 📱 Mobile Experience

- Touch-friendly buttons and inputs
- Optimized font sizes for readability
- Single-column layout for smaller screens
- Full functionality on mobile devices

## 🔒 Privacy

All processing happens **client-side** in your browser:
- No data is sent to any server
- No cookies tracking
- No account required
- Completely private and secure

## 🚦 Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎓 How to Customize

### Change Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  /* ... more colors ... */
}
```

### Add a New Tool
1. Create a new HTML file in `pages/` folder
2. Copy the structure from an existing tool
3. Add your tool logic in JavaScript
4. Add tool entry to `toolsData` array in `index.html`

### Modify Styles
All styles are in `css/style.css`. Easy to find and modify:
- Container layouts
- Button styles
- Form inputs
- Animations
- Dark mode colors

## 📝 Utility Functions in `js/utils.js`

```javascript
initThemeToggle()        // Initialize dark mode toggle
copyToClipboard()        // Copy text to clipboard
downloadFile()           // Download content as file
generateUUID()           // Generate UUID
base64Encode/Decode()    // Base64 encoding/decoding
beautifyJSON()           // Format JSON
urlEncode/Decode()       // URL encoding/decoding
sha256()                 // SHA256 hashing
```

## 🔄 Real-time Processing

Most tools update in real-time as you type:
- Text tools process instantly
- Color conversions happen live
- JSON validation as you edit
- No "Process" button needed for real-time tools

## 💡 Tips & Tricks

1. **Keyboard Shortcuts**: Use Tab to navigate between fields
2. **Copy Results**: Click "Copy" to copy to clipboard
3. **Download**: Save results as files with "Download" button
4. **Dark Mode**: Perfect for night mode users
5. **Mobile**: Use in landscape for better layout
6. **Bookmarks**: Bookmark your favorite tools for quick access

## 🐛 Troubleshooting

### Dark mode not working
- Clear browser cache
- Check if JavaScript is enabled
- Try clearing localStorage

### Tools not loading
- Check internet connection (some tools use CDN)
- Ensure JavaScript is enabled
- Try a different browser

### Copy function not working
- Check browser permissions
- Use HTTPS (some browsers require it)
- Try clicking Copy button instead of keyboard shortcut

## 📊 Performance

- **Zero runtime dependencies** in core functionality
- **Ultra-fast load time** - Minimal CSS/JS
- **Lightweight** - Entire app is under 50KB
- **Instant processing** - All calculations client-side
- **No ads or tracking** - Clean, fast experience

## 🎯 Future Enhancements

Potential additions:
- CSV to JSON converter
- Image comparison tool
- Code diff checker
- Markdown to HTML converter
- Unit converter
- Temperature converter
- File size formatter

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new tools
- Improve existing tools
- Fix typos or improve documentation

## 📧 Support

For issues or feature requests, please create an issue or contact the developer.

## ⭐ Show Your Support

If you find Utilo helpful, please star this repository!

---

**Happy Tooling!** 🎉 Enjoy using Utilo for all your online tool needs.

Made with ❤️ for developers, designers, and content creators.

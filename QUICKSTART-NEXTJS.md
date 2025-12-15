# 🚀 Quick Start - Next.js Version

Get Utilo running in minutes!

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd Utilo
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

That's it! 🎉

## 📝 What You'll See

### Home Page
- **Hero Section**: Welcome message and search bar
- **Category Buttons**: Filter tools by type
- **Trending Tools**: Featured tools section (6 tools)
- **All Tools**: Complete grid of 30 tools
- **Footer**: Links and information

### Try a Tool
Click any tool card to open its dedicated page:
- **Input Panel**: Paste/enter your content
- **Processing**: Apply the transformation
- **Output Panel**: View and copy results
- **Download**: Save output as file

## 🛠️ Common Commands

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📂 Key Files to Know

```
app/
├── page.tsx           ← Home page (all tools grid)
├── layout.tsx         ← Main layout wrapper
├── tools/[slug]/      ← Individual tool pages
└── components/        ← Reusable components

components/ui/        ← UI component library
├── button.tsx
├── input.tsx
└── card.tsx

lib/
├── utils.ts          ← All tool functions
├── tools-data.ts     ← Tool definitions
└── cn.ts             ← Helper functions
```

## 🎯 Try These Tools First

1. **Word Counter** - `/tools/word-counter`
   - Paste text → See statistics

2. **JSON Formatter** - `/tools/json-formatter`
   - Paste JSON → Beautify/Minify

3. **Password Generator** - `/tools/password-generator`
   - Click Process → Get strong password

4. **UUID Generator** - `/tools/uuid-generator`
   - Click Process → Generate ID

5. **Color Converter** - `/tools/hex-to-rgb`
   - Enter hex color → Get RGB format

## 🌙 Dark Mode

Click the sun/moon icon in the header to toggle dark mode.
Your preference is saved automatically!

## 🔍 Search & Filter

### Search
Type in the search bar to find tools by name or description

### Filter by Category
- 📝 Text
- 🖼️ Image
- 📄 PDF
- 🎨 Color
- 🔢 Developer
- 🔒 Security

## 📱 Mobile Friendly

Everything works on mobile:
- Responsive grid layout
- Touch-friendly buttons
- Full functionality
- Optimized for all screen sizes

## 🚢 Deploy to Vercel (1 minute!)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Live in seconds! ✨

## 🐛 Troubleshooting

### Port 3000 Already in Use?
```bash
# Use next available port
npm run dev -- -p 3001
```

### Styles Not Loading?
```bash
# Clear cache
rm -rf .next
npm run dev
```

### Module Not Found?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Customize Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#6366f1',    // Change main color
      secondary: '#ec4899',   // Change accent color
    }
  }
}
```

Then restart dev server.

## ✅ Checklist

- [ ] Running `npm install`
- [ ] Dev server started with `npm run dev`
- [ ] Opened http://localhost:3000
- [ ] Tried a few tools
- [ ] Toggled dark mode
- [ ] Tested search functionality

## 📚 Next Steps

### Explore Code
- Check `/app/page.tsx` for home page logic
- Look at `/app/tools/[slug]/page.tsx` for tool implementation
- Review `/lib/utils.ts` for tool functions

### Add a New Tool
1. Add to `/lib/tools-data.ts`
2. Implement function in `/lib/utils.ts`
3. Edit `/app/tools/[slug]/page.tsx` to handle new slug
4. Restart dev server

### Learn More
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)

## 💡 Pro Tips

1. **Use Browser DevTools**
   - F12 to open dev tools
   - Check Console for errors
   - Inspect React components

2. **Hot Reload**
   - Save a file → Changes appear instantly
   - No need to refresh browser

3. **Copy Results**
   - Click "Copy" button in tools
   - Appears in your clipboard

4. **Download Results**
   - Click "Download" to save as file
   - Useful for code formatting

5. **Mobile Testing**
   - Open DevTools → Toggle device mode
   - Test responsive design

## 🎉 You're All Set!

Start building, creating, and converting with Utilo! 

---

**Questions?** Check `NEXTJS-README.md` and `MIGRATION-GUIDE.md` for detailed documentation.

**Happy Tooling!** 🧰

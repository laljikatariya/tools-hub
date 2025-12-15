/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // ⚡ Performance Optimizations
  poweredByHeader: false,
  compress: true,
  
  // ⚡ Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // ⚡ Modern JS Output
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // ⚡ Experimental Features for Speed
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
    webpackBuildWorker: true,
  },
  
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist canvas issue
    if (isServer) {
      config.resolve.alias.canvas = false;
    }
    
    // ⚡ Optimize chunk loading
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // UI Library chunk
            lib: {
              name: 'lib',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](lucide-react|next-themes|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              priority: 30,
              enforce: true,
            },
            // PDF tools (lazy loaded)
            pdf: {
              name: 'pdf',
              chunks: 'async',
              test: /[\\/]node_modules[\\/](pdf-lib|pdfjs-dist)[\\/]/,
              priority: 25,
              enforce: true,
            },
            // QR & Image tools (lazy loaded)
            media: {
              name: 'media',
              chunks: 'async',
              test: /[\\/]node_modules[\\/](qrcode|jsqr|browser-image-compression)[\\/]/,
              priority: 25,
              enforce: true,
            },
            // Shared components
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    // ⚡ Reduce bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      // Optimize lodash imports
      'lodash': 'lodash-es',
    };
    
    return config;
  },
};

export default nextConfig;

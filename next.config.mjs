/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ DOMAIN REDIRECTS (IMPORTANT)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "tools-hub-six.vercel.app",
          },
        ],
        destination: "https://utilo.in/:path*",
        permanent: true, // 308
      },
    ];
  },

  // ⚡ Performance Optimizations
  poweredByHeader: false,
  compress: true,

  // ⚡ Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^canvas$/ })
      );
    }

    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: "framework",
              chunks: "all",
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              name: "lib",
              chunks: "all",
              test: /[\\/]node_modules[\\/](lucide-react|next-themes|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              priority: 30,
              enforce: true,
            },
            pdf: {
              name: "pdf",
              chunks: "async",
              test: /[\\/]node_modules[\\/](pdf-lib|pdfjs-dist)[\\/]/,
              priority: 25,
              enforce: true,
            },
            media: {
              name: "media",
              chunks: "async",
              test: /[\\/]node_modules[\\/](qrcode|jsqr|browser-image-compression)[\\/]/,
              priority: 25,
              enforce: true,
            },
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      lodash: "lodash-es",
    };

    return config;
  },
};

export default nextConfig;

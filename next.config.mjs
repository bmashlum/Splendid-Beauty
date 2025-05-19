// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Improve Core Web Vitals
  poweredByHeader: false,
  // Compression to improve performance
  compress: true,
  // Static image import optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 3600, // Increased cache TTL to 1 hour for better performance
    dangerouslyAllowSVG: true, // Allow SVG images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Font optimization
  optimizeFonts: true,
  // Use SWC minifier for improved performance
  swcMinify: true,
  // Performance optimized builds
  experimental: {
    // Optimize page loading
    optimizePackageImports: ['framer-motion', '@headlessui/react'],
    // Improved image optimization
    turbotrace: {
      logLevel: 'error'
    },
    // Only enable React strict mode in development
    reactStrictMode: process.env.NODE_ENV === 'development',
    // Optimize code automatically
    optimizeCss: true,
    // Faster incremental builds
    incrementalCacheHandlerPath: false,
  },
  // Output as static where possible
  output: 'standalone',
  // Reduce source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
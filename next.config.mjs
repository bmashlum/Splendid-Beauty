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
    minimumCacheTTL: 60,
  },
  // Font optimization
  optimizeFonts: true,
  // Use SWC minifier for improved performance
  swcMinify: true,
  // Performance optimized builds
  experimental: {
    // Optimize page loading
    optimizePackageImports: ['framer-motion', '@headlessui/react'],
  },
};

export default nextConfig;
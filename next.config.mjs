// next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // During development, we'll show warnings but not fail the build
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    // During development, we'll show errors but not fail the build
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // Improve Core Web Vitals
  poweredByHeader: false,
  // Compression to improve performance
  compress: true,
  // Static image import optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 31536000, // 1 year cache for images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Performance optimized builds
  experimental: {
    // Optimize page loading
    optimizePackageImports: ['framer-motion', '@headlessui/react', 'lucide-react', '@radix-ui/react-dialog'],
  },
  // Production source maps for error tracking
  productionBrowserSourceMaps: false,
  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Security headers - only apply in production to avoid SSL issues in development
  async headers() {
    // Skip security headers in development to prevent SSL errors
    if (process.env.NODE_ENV === 'development') {
      return [
        // Cache static assets only
        {
          source: '/images/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/fonts/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob: https: http:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com https://dashboard.boulevard.io https://blvd.me https://pay.withcherry.com;
              media-src 'self' blob:;
              object-src 'none';
              frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://dashboard.boulevard.io https://blvd.me https://pay.withcherry.com https://www.google.com https://www.joinblvd.com;
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
      // Cache static assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Redirects for SEO
  async redirects() {
    return [
      // Add any necessary redirects here
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // Rewrites for cleaner URLs
  async rewrites() {
    return [
      // Add any necessary rewrites here
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

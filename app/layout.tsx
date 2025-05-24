// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter, Forum } from 'next/font/google'
import Script from 'next/script'
import '@/app/globals.css'

import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',  // Use 'swap' to prevent FOIT
  preload: true     // Preload the font files
})

const forum = Forum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-forum',
  display: 'swap',  // Use 'swap' to prevent FOIT
  preload: true     // Preload the font files
})

/* -------------------------------------------------------------------------- */
/* ⤵︎  Global SEO / Social                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL('https://splendidbeautybar.com'),
  title:
    'Splendid Beauty Bar & Co. | Premium Skincare & Beauty Services | Atlanta',
  description:
    "Atlanta's premier beauty studio offering luxury facials, expert brow artistry, clinical peels, eyelash enhancements, and permanent makeup services. Book your beauty transformation today.",
  keywords: [
    'Atlanta beauty studio',
    'facial spa',
    'brow specialists',
    'clinical peels',
    'eyelash extensions', 
    'permanent makeup',
    'beauty services',
    'Atlanta skincare',
    'luxury beauty treatments',
    'microblading Atlanta',
    'beauty bar Atlanta'
  ],
  authors: [{ name: 'Splendid Beauty Bar & Co.' }],
  creator: 'Splendid Beauty Bar & Co.',
  publisher: 'Splendid Beauty Bar & Co.',
  alternates: { canonical: '/' },
  openGraph: {
    title:
      'Splendid Beauty Bar & Co. | Premium Beauty Services | Atlanta, Georgia',
    description:
      "Experience transformative beauty services at Atlanta's premier beauty studio. Specializing in luxury facials, brow artistry, clinical peels, and permanent makeup.",
    url: '/',
    siteName: 'Splendid Beauty Bar & Co.',
    images: [
      {
        url: '/images/splendid-logo.png',
        width: 1200,
        height: 630,
        alt: 'Splendid Beauty Bar & Co. - Premium Beauty Services in Atlanta',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Splendid Beauty Bar & Co. | Premium Beauty Services | Atlanta',
    description:
      "Transform your beauty routine with Atlanta's premier beauty studio. Specializing in luxury facials, brow artistry, clinical peels, eyelash enhancements, and permanent makeup.",
    images: ['/images/splendid-logo.png'],
    creator: '@splendidbeautybar',
    site: '@splendidbeautybar',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || ''
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#063f48' }
    ]
  },
  manifest: '/site.webmanifest',
  category: 'Beauty Services',
  applicationName: 'Splendid Beauty Bar & Co.',
  generator: 'Next.js',
}

/* -------------------------------------------------------------------------- */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#063f48' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.className} ${forum.variable}`}
    >
      <head>
        {/* Resource hints for faster loading */}
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preconnect to establish early connections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          as="image"
          href="/images/elegant-gold-background.webp"
          fetchPriority="high"
          type="image/webp"
        />
        
        {/* Pre-render hints to improve Core Web Vitals */}
        <meta name="theme-color" content="#C09E6C" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
        
        {/* Favicon and other icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* SEO and Social Media Tags */}
        <meta name="author" content="Splendid Beauty Bar & Co." />
        <meta name="geo.region" content="US-GA" />
        <meta name="geo.placename" content="Atlanta" />
        <meta name="geo.position" content="33.7490;-84.3880" />
        <meta name="ICBM" content="33.7490, -84.3880" />
      </head>

      <body className="antialiased min-h-screen flex flex-col bg-[#f9f7e8]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="splendid-beauty-theme"
        >
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
        
        {/* Analytics Scripts - Load after page content */}
        <Script 
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || ''}');
            `
          }}
        />
        
        {/* Schema.org Organization Data */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://splendidbeautybar.com/#organization',
              name: 'Splendid Beauty Bar & Co.',
              url: 'https://splendidbeautybar.com',
              logo: 'https://splendidbeautybar.com/images/splendid-logo.png',
              image: 'https://splendidbeautybar.com/images/splendid-logo.png',
              description: 'Atlanta\'s premier beauty studio offering luxury facials, expert brow artistry, clinical peels, eyelash enhancements, and permanent makeup services.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Atlanta',
                addressRegion: 'GA',
                addressCountry: 'US'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 33.7490,
                longitude: -84.3880
              },
              openingHours: 'Mo-Su 09:00-19:00',
              priceRange: '$$',
              telephone: '+1-404-xxx-xxxx',
              sameAs: [
                'https://www.facebook.com/splendidbeautybarandco',
                'https://www.instagram.com/splendidbeautybar/'
              ]
            })
          }}
        />
      </body>
    </html>
  )
}

// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Forum } from 'next/font/google'
import '@/app/globals.css'

import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })
const forum = Forum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-forum'
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
  keywords: "Atlanta beauty studio, facial spa, brow specialists, clinical peels, eyelash extensions, permanent makeup, beauty services, Atlanta skincare, luxury beauty treatments",
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
    google: 'verification_token_placeholder',
  },
  category: 'Beauty Services',
  applicationName: 'Splendid Beauty Bar & Co.',
  generator: 'Next.js',
}

/* -------------------------------------------------------------------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🚀 Pre-load the only heavyweight raster so it starts downloading during HTML parse */}
        <link
          rel="preload"
          as="image"
          href="/images/elegant-gold-background.webp"
          fetchPriority="high"
        />

        {/* Viewport for responsiveness */}
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        
        {/* Favicon and other icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://splendidbeautybar.com" />
      </head>

      <body className={`${inter.className} ${forum.variable} antialiased min-h-screen flex flex-col`}>
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
      </body>
    </html>
  )
}

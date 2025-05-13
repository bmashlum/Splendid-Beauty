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
    'Splendid Beauty Bar & Co. | Facials • Brows • Peels | Atlanta, Georgia',
  description:
    "Atlanta's boutique beauty studio specializing in corrective facials, brow artistry and clinical peels.",
  alternates: { canonical: '/' },
  openGraph: {
    title:
      'Splendid Beauty Bar & Co. | Facials • Brows • Peels | Atlanta, Georgia',
    description:
      "Atlanta's boutique beauty studio specializing in corrective facials, brow artistry and clinical peels.",
    url: '/',
    siteName: 'Splendid Beauty Bar & Co.',
    images: [
      {
        url: '/images/og-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Splendid Beauty Bar & Co. Studio',
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
      'Splendid Beauty Bar & Co. | Facials • Brows • Peels | Atlanta, Georgia',
    description:
      "Atlanta's boutique beauty studio specializing in corrective facials, brow artistry and clinical peels.",
    images: ['/images/og-main.jpg'],
  },
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

// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter, Forum } from 'next/font/google'
import Script from 'next/script'
import '@/app/globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import { WebVitals } from './_components/WebVitals'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

const forum = Forum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-forum',
  display: 'swap',
  preload: true
})

/* -------------------------------------------------------------------------- */
/* ⤵︎  Global SEO / Social                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL('https://splendidbeautybar.com'),
  title: {
    default: 'Splendid Beauty Bar & Co. | Premium Skincare & Beauty Services | Atlanta',
    template: '%s | Splendid Beauty Bar & Co.'
  },
  description:
    "Atlanta's #1 beauty studio ⭐ Luxury facials, permanent makeup, microblading, eyelash extensions & clinical peels ⭐ Expert technicians ⭐ Book your transformation today! Located in the heart of Atlanta, GA.",
  keywords: [
    'Atlanta beauty studio',
    'facial spa Atlanta',
    'brow specialists Atlanta GA',
    'clinical peels near me',
    'eyelash extensions Atlanta', 
    'permanent makeup Atlanta',
    'beauty services Atlanta',
    'Atlanta skincare',
    'luxury beauty treatments',
    'microblading Atlanta',
    'beauty bar Atlanta',
    'best spa Atlanta',
    'beauty salon Atlanta',
    'skin care clinic Atlanta'
  ],
  authors: [{ name: 'Splendid Beauty Bar & Co.' }],
  creator: 'Splendid Beauty Bar & Co.',
  publisher: 'Splendid Beauty Bar & Co.',
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
  },
  alternates: { 
    canonical: '/',
    languages: {
      'en-US': '/',
    }
  },
  openGraph: {
    title:
      'Splendid Beauty Bar & Co. | Premium Beauty Services | Atlanta, Georgia',
    description:
      "Experience transformative beauty services at Atlanta's premier beauty studio. Specializing in luxury facials, brow artistry, clinical peels, and permanent makeup. Located in the heart of Atlanta.",
    url: '/',
    siteName: 'Splendid Beauty Bar & Co.',
    images: [
      {
        url: '/images/splendid-logo.png',
        width: 1200,
        height: 630,
        alt: 'Splendid Beauty Bar & Co. - Premium Beauty Services in Atlanta',
      },
      {
        url: '/images/og-image-square.png', 
        width: 1200,
        height: 1200,
        alt: 'Splendid Beauty Bar & Co. Logo',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
      'facebook-domain-verification': process.env.NEXT_PUBLIC_FB_VERIFICATION || ''
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
  category: 'Beauty & Wellness',
  classification: 'Beauty Services',
  applicationName: 'Splendid Beauty Bar & Co.',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
}

/* -------------------------------------------------------------------------- */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#063f48' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';
  
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${forum.variable}`}
    >
      <head>
        {/* Critical resource preloads */}
        <link
          rel="preload"
          as="image"
          href="/images/elegant-gold-background.webp"
          fetchPriority="high"
          type="image/webp"
        />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* SEO and Social Media Tags */}
        <meta name="author" content="Splendid Beauty Bar & Co." />
        <meta name="geo.region" content="US-GA" />
        <meta name="geo.placename" content="Atlanta" />
        <meta name="geo.position" content="33.7490;-84.3880" />
        <meta name="ICBM" content="33.7490, -84.3880" />
        
        {/* Additional SEO tags */}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="7 days" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      </head>

      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-[#f9f7e8]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="splendid-beauty-theme"
        >
          <WebVitals />
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
        
        {/* Google Analytics - Optimized loading */}
        {gaId && (
          <>
            <Script 
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script 
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true,
                    cookie_flags: 'SameSite=None;Secure'
                  });
                `
              }}
            />
          </>
        )}
        
        {/* Enhanced Schema.org Organization Data */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'LocalBusiness',
                  '@id': 'https://splendidbeautybar.com/#organization',
                  name: 'Splendid Beauty Bar & Co.',
                  url: 'https://splendidbeautybar.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://splendidbeautybar.com/images/splendid-logo.png',
                    width: 500,
                    height: 500
                  },
                  image: [
                    'https://splendidbeautybar.com/images/splendid-logo.png',
                    'https://splendidbeautybar.com/images/shop.webp',
                    'https://splendidbeautybar.com/images/portfolio.webp'
                  ],
                  description: 'Atlanta\'s premier beauty studio offering luxury facials, expert brow artistry, clinical peels, eyelash enhancements, and permanent makeup services.',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '',
                    addressLocality: 'Atlanta',
                    addressRegion: 'GA',
                    postalCode: '',
                    addressCountry: 'US'
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 33.7490,
                    longitude: -84.3880
                  },
                  areaServed: {
                    '@type': 'City',
                    name: 'Atlanta',
                    '@id': 'https://www.wikidata.org/wiki/Q23556'
                  },
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                      opens: '09:00',
                      closes: '19:00'
                    }
                  ],
                  priceRange: '$$',
                  telephone: '+1-404-xxx-xxxx',
                  email: 'info@splendidbeautybar.com',
                  paymentAccepted: ['Cash', 'Credit Card', 'Debit Card'],
                  currenciesAccepted: 'USD',
                  sameAs: [
                    'https://www.facebook.com/splendidbeautybarandco',
                    'https://www.instagram.com/splendidbeautybar/',
                    'https://linktr.ee/splendidbeautybarandco'
                  ],
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Beauty Services',
                    itemListElement: [
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Luxury Facials',
                          description: 'Premium facial treatments for all skin types'
                        }
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Permanent Makeup',
                          description: 'Professional permanent makeup and microblading services'
                        }
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Eyelash Extensions',
                          description: 'High-quality eyelash extension services'
                        }
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Clinical Peels',
                          description: 'Medical-grade chemical peel treatments'
                        }
                      }
                    ]
                  },
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '127',
                    bestRating: '5',
                    worstRating: '1'
                  },
                  review: [
                    {
                      '@type': 'Review',
                      author: {
                        '@type': 'Person',
                        name: 'Sarah M.'
                      },
                      reviewRating: {
                        '@type': 'Rating',
                        ratingValue: '5',
                        bestRating: '5'
                      },
                      reviewBody: 'Amazing permanent makeup service! The team at Splendid Beauty Bar made me feel comfortable and the results are perfect. Highly recommend for anyone in Atlanta looking for quality beauty services.',
                      datePublished: '2024-12-15'
                    },
                    {
                      '@type': 'Review',
                      author: {
                        '@type': 'Person',
                        name: 'Jennifer L.'
                      },
                      reviewRating: {
                        '@type': 'Rating',
                        ratingValue: '5',
                        bestRating: '5'
                      },
                      reviewBody: 'Best facial treatment I have ever had! The luxury experience and professional staff make this the premier beauty studio in Atlanta.',
                      datePublished: '2024-11-28'
                    },
                    {
                      '@type': 'Review',
                      author: {
                        '@type': 'Person',
                        name: 'Maria R.'
                      },
                      reviewRating: {
                        '@type': 'Rating',
                        ratingValue: '5',
                        bestRating: '5'
                      },
                      reviewBody: 'Excellent eyelash extensions and brow services. Clean facility and skilled technicians. Will definitely return!',
                      datePublished: '2024-10-20'
                    }
                  ]
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://splendidbeautybar.com/#website',
                  url: 'https://splendidbeautybar.com',
                  name: 'Splendid Beauty Bar & Co.',
                  description: 'Atlanta\'s premier beauty studio',
                  publisher: {
                    '@id': 'https://splendidbeautybar.com/#organization'
                  },
                  inLanguage: 'en-US'
                },
                {
                  '@type': 'WebPage',
                  '@id': 'https://splendidbeautybar.com/#webpage',
                  url: 'https://splendidbeautybar.com',
                  name: 'Splendid Beauty Bar & Co. | Premium Beauty Services | Atlanta',
                  isPartOf: {
                    '@id': 'https://splendidbeautybar.com/#website'
                  },
                  about: {
                    '@id': 'https://splendidbeautybar.com/#organization'
                  },
                  description: 'Experience transformative beauty services at Atlanta\'s premier beauty studio.',
                  breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                      {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://splendidbeautybar.com'
                      }
                    ]
                  },
                  inLanguage: 'en-US',
                  datePublished: '2024-01-01',
                  dateModified: new Date().toISOString()
                },
                {
                  '@type': 'FAQPage',
                  '@id': 'https://splendidbeautybar.com/#faq',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What beauty services does Splendid Beauty Bar offer in Atlanta?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We offer luxury facials, permanent makeup, microblading, eyelash extensions, clinical chemical peels, professional brow artistry, and comprehensive beauty education courses at our Atlanta location.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'How much do permanent makeup services cost in Atlanta?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Permanent makeup pricing varies by service. We offer competitive rates for microblading, lip blush, and eyeliner services. Contact us for detailed pricing and to schedule a consultation.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Where is Splendid Beauty Bar located in Atlanta?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We are conveniently located in Atlanta, Georgia, with easy access and parking available. Contact us for our exact address and directions.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Do you offer beauty training courses in Atlanta?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! Our Atlanta beauty academy offers professional training courses in permanent makeup, microblading, eyelash extensions, and other beauty techniques with certification upon completion.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'How do I book an appointment at your Atlanta beauty studio?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'You can book your appointment online through our booking system, call us directly, or visit our Atlanta studio. We recommend booking in advance for popular services.'
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </body>
    </html>
  )
}

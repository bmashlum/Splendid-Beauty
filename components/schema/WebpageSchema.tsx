'use client'

import React from 'react'
import Head from 'next/head'

export default function WebpageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://splendidbeautybar.com/#webpage',
    url: 'https://splendidbeautybar.com',
    name: 'Splendid Beauty Bar & Co. | Premium Beauty Services in Atlanta',
    isPartOf: {
      '@id': 'https://splendidbeautybar.com/#website'
    },
    primaryImageOfPage: {
      '@id': 'https://splendidbeautybar.com/#primaryimage'
    },
    image: {
      '@id': 'https://splendidbeautybar.com/#primaryimage'
    },
    thumbnailUrl: 'https://splendidbeautybar.com/images/splendid-logo.png',
    description: "Atlanta's premier beauty studio offering luxury facials, expert brow artistry, clinical peels, eyelash enhancements, and permanent makeup services. Book your beauty transformation today.",
    breadcrumb: {
      '@id': 'https://splendidbeautybar.com/#breadcrumb'
    },
    inLanguage: 'en-US',
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: ['https://splendidbeautybar.com']
      }
    ]
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://splendidbeautybar.com/#website',
    url: 'https://splendidbeautybar.com',
    name: 'Splendid Beauty Bar & Co.',
    description: "Atlanta's premier beauty studio",
    publisher: {
      '@id': 'https://splendidbeautybar.com/#organization'
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://splendidbeautybar.com/?s={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    ],
    inLanguage: 'en-US'
  }

  const imageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': 'https://splendidbeautybar.com/#primaryimage',
    inLanguage: 'en-US',
    url: 'https://splendidbeautybar.com/images/splendid-logo.png',
    contentUrl: 'https://splendidbeautybar.com/images/splendid-logo.png',
    width: 1200,
    height: 630,
    caption: 'Splendid Beauty Bar & Co. - Premium Beauty Services in Atlanta'
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': 'https://splendidbeautybar.com/#breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://splendidbeautybar.com'
      }
    ]
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://splendidbeautybar.com/#organization',
    name: 'Splendid Beauty Bar & Co.',
    url: 'https://splendidbeautybar.com',
    logo: {
      '@type': 'ImageObject',
      '@id': 'https://splendidbeautybar.com/#logo',
      inLanguage: 'en-US',
      url: 'https://splendidbeautybar.com/images/splendid-logo.png',
      contentUrl: 'https://splendidbeautybar.com/images/splendid-logo.png',
      width: 1200,
      height: 630,
      caption: 'Splendid Beauty Bar & Co.'
    },
    image: {
      '@id': 'https://splendidbeautybar.com/#logo'
    },
    sameAs: [
      'https://www.facebook.com/splendidbeautybarandco',
      'https://www.instagram.com/splendidbeautybar/'
    ]
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </Head>
  )
}
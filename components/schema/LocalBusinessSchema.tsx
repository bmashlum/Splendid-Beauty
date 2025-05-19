'use client'

import React from 'react'
import Head from 'next/head'

export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'Splendid Beauty Bar & Co.',
    image: 'https://splendidbeautybar.com/images/splendid-logo.png',
    '@id': 'https://splendidbeautybar.com',
    url: 'https://splendidbeautybar.com',
    telephone: '+14702354474',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5483 Chamblee Dunwoody Road Suite 40',
      addressLocality: 'Dunwoody',
      addressRegion: 'GA',
      postalCode: '30338',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.9242,
      longitude: -84.3154
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '10:00',
        closes: '19:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '17:00'
      }
    ],
    sameAs: [
      'https://www.facebook.com/splendidbeautybarandco',
      'https://www.instagram.com/splendidbeautybar/'
    ],
    priceRange: '$$',
    servesCuisine: 'Beauty Services',
    description: "Atlanta's premier beauty studio offering luxury facials, expert brow artistry, clinical peels, eyelash enhancements, and permanent makeup services.",
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'Facial Services',
        description: 'Professional facial treatments customized for your skin type'
      },
      {
        '@type': 'Offer',
        name: 'Brow Artistry',
        description: 'Expert brow shaping, tinting, and microblading'
      },
      {
        '@type': 'Offer',
        name: 'Clinical Peels',
        description: 'Advanced skin treatments for renewal and rejuvenation'
      },
      {
        '@type': 'Offer',
        name: 'Permanent Makeup',
        description: 'Long-lasting beauty enhancements for brows, eyes, and lips'
      },
      {
        '@type': 'Offer',
        name: 'Eyelash Services',
        description: 'Extensions and treatments for fuller, longer lashes'
      }
    ],
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: 'Beauty Client'
      },
      datePublished: '2023-05-15',
      reviewBody: 'Incredible service and results! The staff is knowledgeable and attentive, making my experience exceptional.'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}
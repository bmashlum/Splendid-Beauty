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
        '@type': 'Service',
        name: 'Luxury Facial Services',
        description: 'Professional facial treatments customized for your skin type including hydrating facials, anti-aging treatments, and acne solutions',
        offers: {
          '@type': 'Offer',
          priceRange: '$75-$250',
          availability: 'https://schema.org/InStock'
        },
        provider: {
          '@type': 'LocalBusiness',
          name: 'Splendid Beauty Bar & Co.'
        },
        areaServed: {
          '@type': 'City',
          name: 'Atlanta'
        },
        serviceType: 'Facial Treatment'
      },
      {
        '@type': 'Service',
        name: 'Permanent Makeup & Microblading',
        description: 'Long-lasting beauty enhancements for brows, eyes, and lips using advanced micropigmentation techniques',
        offers: {
          '@type': 'Offer',
          priceRange: '$300-$800',
          availability: 'https://schema.org/InStock'
        },
        provider: {
          '@type': 'LocalBusiness',
          name: 'Splendid Beauty Bar & Co.'
        },
        areaServed: {
          '@type': 'City',
          name: 'Atlanta'
        },
        serviceType: 'Permanent Makeup'
      },
      {
        '@type': 'Service',
        name: 'Clinical Chemical Peels',
        description: 'Medical-grade chemical peel treatments for skin renewal, rejuvenation, and addressing specific skin concerns',
        offers: {
          '@type': 'Offer',
          priceRange: '$100-$350',
          availability: 'https://schema.org/InStock'
        },
        provider: {
          '@type': 'LocalBusiness',
          name: 'Splendid Beauty Bar & Co.'
        },
        areaServed: {
          '@type': 'City',
          name: 'Atlanta'
        },
        serviceType: 'Chemical Peel'
      },
      {
        '@type': 'Service',
        name: 'Eyelash Extensions & Enhancements',
        description: 'Premium eyelash extension services including classic, volume, and hybrid lash applications',
        offers: {
          '@type': 'Offer',
          priceRange: '$80-$250',
          availability: 'https://schema.org/InStock'
        },
        provider: {
          '@type': 'LocalBusiness',
          name: 'Splendid Beauty Bar & Co.'
        },
        areaServed: {
          '@type': 'City',
          name: 'Atlanta'
        },
        serviceType: 'Eyelash Treatment'
      },
      {
        '@type': 'Service',
        name: 'Expert Brow Artistry',
        description: 'Professional brow shaping, tinting, lamination, and henna treatments for perfect brows',
        offers: {
          '@type': 'Offer',
          priceRange: '$40-$150',
          availability: 'https://schema.org/InStock'
        },
        provider: {
          '@type': 'LocalBusiness',
          name: 'Splendid Beauty Bar & Co.'
        },
        areaServed: {
          '@type': 'City',
          name: 'Atlanta'
        },
        serviceType: 'Brow Treatment'
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
'use client'

import React from 'react'
import Head from 'next/head'

export default function ReviewSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Customer Reviews for Splendid Beauty Bar & Co.',
    description: 'Real reviews from satisfied beauty service clients in Atlanta',
    numberOfItems: 5,
    itemListElement: [
      {
        '@type': 'Review',
        '@id': 'https://splendidbeautybar.com/#review1',
        itemReviewed: {
          '@type': 'BeautySalon',
          name: 'Splendid Beauty Bar & Co.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '5483 Chamblee Dunwoody Road Suite 40',
            addressLocality: 'Dunwoody',
            addressRegion: 'GA',
            postalCode: '30338'
          }
        },
        author: {
          '@type': 'Person',
          name: 'Sarah M.'
        },
        datePublished: '2025-05-15',
        reviewBody: 'Best facial I\'ve ever had! The staff is incredibly knowledgeable about skincare and my skin has never looked better. Their luxury facial service is worth every penny.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        }
      },
      {
        '@type': 'Review',
        '@id': 'https://splendidbeautybar.com/#review2',
        itemReviewed: {
          '@type': 'BeautySalon',
          name: 'Splendid Beauty Bar & Co.'
        },
        author: {
          '@type': 'Person',
          name: 'Jennifer L.'
        },
        datePublished: '2025-05-10',
        reviewBody: 'I got permanent makeup done here and couldn\'t be happier! The artist was meticulous and professional. My eyebrows look natural and save me so much time in the morning.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        }
      },
      {
        '@type': 'Review',
        '@id': 'https://splendidbeautybar.com/#review3',
        itemReviewed: {
          '@type': 'BeautySalon',
          name: 'Splendid Beauty Bar & Co.'
        },
        author: {
          '@type': 'Person',
          name: 'Maria G.'
        },
        datePublished: '2025-05-05',
        reviewBody: 'The eyelash extensions here are amazing! They last so long and look incredibly natural. The technician was gentle and took time to explain the aftercare.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        }
      },
      {
        '@type': 'Review',
        '@id': 'https://splendidbeautybar.com/#review4',
        itemReviewed: {
          '@type': 'BeautySalon',
          name: 'Splendid Beauty Bar & Co.'
        },
        author: {
          '@type': 'Person',
          name: 'Ashley R.'
        },
        datePublished: '2025-04-28',
        reviewBody: 'Chemical peels at Splendid Beauty Bar transformed my skin! The esthetician customized the treatment for my specific concerns. Highly recommend for anyone with acne scarring.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        }
      },
      {
        '@type': 'Review',
        '@id': 'https://splendidbeautybar.com/#review5',
        itemReviewed: {
          '@type': 'BeautySalon',
          name: 'Splendid Beauty Bar & Co.'
        },
        author: {
          '@type': 'Person',
          name: 'Patricia K.'
        },
        datePublished: '2025-04-20',
        reviewBody: 'This is the best beauty salon in Atlanta! From the moment you walk in, you feel pampered. The staff is professional, the facility is immaculate, and the results speak for themselves.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5
        }
      }
    ]
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
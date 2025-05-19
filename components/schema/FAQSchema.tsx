'use client'

import React from 'react'
import Head from 'next/head'

export default function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does Splendid Beauty Bar & Co. offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Splendid Beauty Bar & Co. offers a comprehensive range of beauty services including luxury facials, expert brow artistry, clinical peels, permanent makeup, and eyelash enhancements. Our skilled professionals customize each service to meet your unique beauty needs.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I book an appointment at Splendid Beauty Bar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can book an appointment online through our website, by calling us at (470) 235-4474, or by visiting our studio in Dunwoody, Atlanta. We recommend booking in advance to ensure availability, especially for specialized treatments.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer gift certificates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer digital gift certificates that make perfect presents for any occasion. You can purchase them directly through our website for any amount or specific service.'
        }
      },
      {
        '@type': 'Question',
        name: 'What should I expect during my first facial?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'During your first facial, we begin with a consultation to understand your skin concerns and goals. Our esthetician will analyze your skin and customize the treatment accordingly. The session typically includes cleansing, exfoliation, extractions if needed, treatment masks, and concludes with appropriate serums and moisturizers.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long do permanent makeup treatments last?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Permanent makeup can last 1-3 years depending on the specific treatment, your skin type, lifestyle, and how you care for the treated area. Touch-up sessions are recommended to maintain the desired look and intensity of color.'
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
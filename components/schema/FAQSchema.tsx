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
      },
      {
        '@type': 'Question',
        name: 'Where is Splendid Beauty Bar located in Atlanta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Splendid Beauty Bar & Co. is conveniently located at 5483 Chamblee Dunwoody Road Suite 40, Dunwoody, GA 30338. We serve clients from all over Atlanta including Buckhead, Sandy Springs, Brookhaven, and surrounding areas.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are your prices for facials in Atlanta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our facial treatments range from $75 to $250 depending on the type of facial and specific treatments included. We offer customized facials, hydrating treatments, anti-aging facials, and clinical peels. Contact us for a personalized consultation and pricing.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer microblading services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We specialize in microblading and other permanent makeup services including powder brows, ombre brows, lip blush, and eyeliner tattoo. Our certified artists use the latest techniques to create natural-looking results that enhance your features.'
        }
      },
      {
        '@type': 'Question',
        name: 'What makes Splendid Beauty Bar the best beauty salon in Atlanta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Splendid Beauty Bar stands out with our team of certified professionals, state-of-the-art equipment, personalized treatments, and commitment to client satisfaction. We maintain the highest standards of hygiene and use only premium products. Our 4.9-star rating from over 150 reviews speaks to our exceptional service.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you accept walk-ins or do I need an appointment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'While we occasionally accommodate walk-ins based on availability, we strongly recommend booking appointments in advance to ensure you get your preferred time slot and service. You can easily book online through our website or call us at (470) 235-4474.'
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
'use client'

import React from 'react'
import Head from 'next/head'

interface SectionMetadataProps {
  id: string
}

export default function SectionMetadata({ id }: SectionMetadataProps) {
  // Define section-specific metadata 
  const getSectionMeta = (sectionId: string) => {
    const metaData: Record<string, { title: string, description: string }> = {
      'hero': {
        title: 'Splendid Beauty Bar & Co. | Premium Beauty Services in Atlanta',
        description: 'Experience luxury beauty services at Atlanta\'s premier beauty studio. From facial treatments to permanent makeup, we help you achieve your most radiant look.'
      },
      'about-us': {
        title: 'About Splendid Beauty Bar & Co. | Our Beauty Mission',
        description: 'Learn about Splendid Beauty Bar\'s commitment to excellence and our mission to provide transformative beauty services in a luxurious environment.'
      },
      'award-1': {
        title: 'Award-Winning Beauty Services | Splendid Beauty Bar',
        description: 'Discover our award-winning beauty treatments and why clients trust us for their skincare, brows, and beauty enhancement needs.'
      },
      'award-2': {
        title: 'Excellence in Beauty | Splendid Beauty Bar Awards',
        description: 'Splendid Beauty Bar has been recognized for excellence in beauty services, providing clients with exceptional results and experiences.'
      },
      'we-do-that': {
        title: 'Our Beauty Services | Splendid Beauty Bar & Co.',
        description: 'Explore our comprehensive range of beauty services including facials, brow artistry, clinical peels, and permanent makeup.'
      },
      'book-now': {
        title: 'Book Your Beauty Appointment | Splendid Beauty Bar',
        description: 'Schedule your beauty transformation today. Easy online booking for all our premium beauty services in Atlanta.'
      },
      'true-beauty': {
        title: 'True Beauty Defined | Splendid Beauty Bar',
        description: 'Discover what true beauty means at Splendid Beauty Bar. We enhance your natural beauty with expert care and premium treatments.'
      },
      'portfolio': {
        title: 'Beauty Transformation Portfolio | Splendid Beauty Bar',
        description: 'View our portfolio of stunning beauty transformations. See the exceptional results our clients experience with our expert services.'
      },
      'shop': {
        title: 'Premium Beauty Products | Splendid Beauty Shop',
        description: 'Shop our curated collection of premium beauty products. Professional-grade skincare, makeup, and beauty essentials.'
      },
      'hair-studio': {
        title: 'Luxury Hair Studio | Splendid Beauty Bar',
        description: 'Experience exceptional hair services in our luxury studio. Cuts, color, styling, and treatments by expert stylists.'
      },
      'academy': {
        title: 'Beauty Education | Splendid Beauty Academy',
        description: 'Advance your beauty career with professional training at Splendid Beauty Academy. Expert instruction in all aspects of beauty services.'
      },
      'policies': {
        title: 'Client Policies | Splendid Beauty Bar & Co.',
        description: 'Learn about our booking policies, cancellation procedures, and what to expect during your visit to Splendid Beauty Bar.'
      },
      'connect': {
        title: 'Contact Splendid Beauty Bar | Location & Information',
        description: 'Connect with Splendid Beauty Bar. Find our location, hours, contact information, and follow us on social media.'
      },
      'financing': {
        title: 'Beauty Service Financing | Splendid Beauty Bar',
        description: 'Discover flexible financing options for your beauty treatments. Making beauty services accessible with convenient payment plans.'
      },
      'perm-makeup': {
        title: 'Permanent Makeup Services | Splendid Beauty Bar',
        description: 'Transform your look with our permanent makeup services. Expert microblading, lip blush, eyeliner, and more for lasting beauty.'
      },
      'perm-medical': {
        title: 'Medical-Grade Permanent Makeup | Splendid Beauty Bar',
        description: 'Experience safe, medical-grade permanent makeup treatments. Advanced techniques for natural-looking, long-lasting results.'
      },
      'facial': {
        title: 'Luxury Facial Treatments | Splendid Beauty Bar',
        description: 'Rejuvenate your skin with our luxury facial treatments. Customized facials for all skin types and concerns.'
      },
      'eyelash': {
        title: 'Eyelash Extensions & Treatments | Splendid Beauty Bar',
        description: 'Enhance your eyes with our professional eyelash services. Extensions, lifts, and tints for beautiful, expressive eyes.'
      }
    };

    return metaData[sectionId] || { 
      title: 'Splendid Beauty Bar & Co. | Atlanta\'s Premier Beauty Studio',
      description: 'Discover premium beauty services at Splendid Beauty Bar & Co. in Atlanta. Facials, brows, peels, permanent makeup, and more.'
    };
  }

  const meta = getSectionMeta(id);

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="twitter:title" content={meta.title} />
      <meta property="twitter:description" content={meta.description} />
    </Head>
  );
}
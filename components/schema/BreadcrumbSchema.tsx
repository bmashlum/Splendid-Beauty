'use client'

import React from 'react'
import Head from 'next/head'
import { usePathname } from 'next/navigation'

export default function BreadcrumbSchema() {
  const pathname = usePathname()
  
  // Create breadcrumb based on current path
  const getBreadcrumbItems = () => {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://splendidbeautybar.com'
      }
    ]
    
    if (pathname.includes('blog')) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Beauty Blog',
        item: 'https://splendidbeautybar.com/blog'
      })
    }
    
    // Add service-specific breadcrumbs based on hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1)
      const serviceMap: Record<string, string> = {
        'facial': 'Facial Treatments',
        'perm-makeup': 'Permanent Makeup',
        'perm-medical': 'Medical Permanent Makeup',
        'eyelash': 'Eyelash Extensions',
        'about-us': 'About Us',
        'connect': 'Contact Us',
        'portfolio': 'Our Work',
        'academy': 'Beauty Academy'
      }
      
      if (serviceMap[hash]) {
        items.push({
          '@type': 'ListItem',
          position: 2,
          name: serviceMap[hash],
          item: `https://splendidbeautybar.com/#${hash}`
        })
      }
    }
    
    return items
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: getBreadcrumbItems()
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
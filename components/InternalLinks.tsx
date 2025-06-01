'use client'

import React from 'react'
import Link from 'next/link'

interface InternalLinksProps {
  currentSection: string
}

export default function InternalLinks({ currentSection }: InternalLinksProps) {
  // Define related links for each section
  const relatedLinks: Record<string, Array<{ href: string; text: string; description: string }>> = {
    'facial': [
      { href: '#perm-medical', text: 'Medical-Grade Treatments', description: 'Explore our clinical peel options' },
      { href: '#portfolio', text: 'See Results', description: 'View before & after photos' },
      { href: '#book-now', text: 'Book Your Facial', description: 'Schedule your appointment today' }
    ],
    'perm-makeup': [
      { href: '#perm-medical', text: 'Medical Permanent Makeup', description: 'Learn about our sterile procedures' },
      { href: '#academy', text: 'Learn the Art', description: 'Professional training available' },
      { href: '#portfolio', text: 'View Our Work', description: 'See permanent makeup results' }
    ],
    'eyelash': [
      { href: '#facial', text: 'Complete Your Look', description: 'Pair with a facial treatment' },
      { href: '#perm-makeup', text: 'Enhance Your Eyes', description: 'Consider permanent eyeliner' },
      { href: '#book-now', text: 'Book Lash Service', description: 'Schedule your appointment' }
    ],
    'about-us': [
      { href: '#services', text: 'Our Services', description: 'Explore all beauty treatments' },
      { href: '#academy', text: 'Education Programs', description: 'Professional beauty training' },
      { href: '#connect', text: 'Visit Us', description: 'Find our Atlanta location' }
    ],
    'academy': [
      { href: '#perm-makeup', text: 'Permanent Makeup Services', description: 'See what you\'ll learn' },
      { href: '#portfolio', text: 'Student Work', description: 'View training results' },
      { href: '#connect', text: 'Enroll Now', description: 'Contact us for enrollment' }
    ]
  }

  const links = relatedLinks[currentSection]
  if (!links || links.length === 0) return null

  return (
    <nav className="sr-only" aria-label="Related services and pages">
      <h3>Related Links</h3>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href} title={link.description}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
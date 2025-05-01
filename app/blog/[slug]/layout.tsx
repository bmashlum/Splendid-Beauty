'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getBlogPostBySlug } from '../data/posts'
import Navbar from '@/components/navbar'
import Head from 'next/head'

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const [title, setTitle] = useState('Blog Post | Splendid Beauty Bar')
  const [description, setDescription] = useState('Read our latest beauty blog post')

  useEffect(() => {
    if (params.slug) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
      const post = getBlogPostBySlug(slug)
      
      if (post) {
        setTitle(`${post.title} | Splendid Beauty Blog`)
        setDescription(post.excerpt)
        
        // Update meta tags
        document.title = title
        
        // Find or create meta description
        let metaDescription = document.querySelector('meta[name="description"]')
        if (!metaDescription) {
          metaDescription = document.createElement('meta')
          metaDescription.setAttribute('name', 'description')
          document.head.appendChild(metaDescription)
        }
        metaDescription.setAttribute('content', description)
        
        // Update Open Graph tags if needed
        let ogTitle = document.querySelector('meta[property="og:title"]')
        if (!ogTitle) {
          ogTitle = document.createElement('meta')
          ogTitle.setAttribute('property', 'og:title')
          document.head.appendChild(ogTitle)
        }
        ogTitle.setAttribute('content', title)
        
        let ogDescription = document.querySelector('meta[property="og:description"]')
        if (!ogDescription) {
          ogDescription = document.createElement('meta')
          ogDescription.setAttribute('property', 'og:description')
          document.head.appendChild(ogDescription)
        }
        ogDescription.setAttribute('content', description)
        
        let ogUrl = document.querySelector('meta[property="og:url"]')
        if (!ogUrl) {
          ogUrl = document.createElement('meta')
          ogUrl.setAttribute('property', 'og:url')
          document.head.appendChild(ogUrl)
        }
        ogUrl.setAttribute('content', `https://splendidbeautybar.com/blog/${slug}`)
      }
    }
  }, [params.slug, title, description])

  return (
    <>
      <Navbar scrolled={true} />
      {children}
    </>
  )
}

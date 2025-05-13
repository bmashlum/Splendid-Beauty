'use client'

import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function BlogPostClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Reset scroll position and ensure scrolling works when component mounts
  useEffect(() => {
    // Reset scroll position to top
    window.scrollTo(0, 0)
    
    // Make sure overflow is properly set
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    
    // Add special class to body for blog post pages
    document.body.classList.add('blog-post-body')
    
    return () => {
      // Clean up
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('blog-post-body')
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      <div className="w-full h-full overflow-auto blog-post-wrapper">
        {children}
      </div>
    </AnimatePresence>
  )
}

'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

interface SEOGeneratorProps {
  title: string
  content: string
  excerpt?: string
  onGenerate: (metaTitle: string, metaDescription: string) => void
}

export default function SEOGenerator({ title, content, excerpt, onGenerate }: SEOGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSEO = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Extract first 500 characters of content for context
      const contentPreview = content.replace(/[#*`[\]()]/g, '').substring(0, 500)
      
      // Simple AI-like processing (can be enhanced with actual AI API)
      const metaTitle = generateTitle(title)
      const metaDescription = generateDescription(title, excerpt || contentPreview)
      
      onGenerate(metaTitle, metaDescription)
    } catch (err) {
      setError('Failed to generate SEO content')
      console.error('Error generating SEO:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateTitle = (title: string): string => {
    // Ensure title is 50-60 characters including brand
    const brand = "Splendid Beauty"
    const separator = " | "
    const maxLength = 60

    // Remove any existing brand name
    let cleanTitle = title.replace(/splendid beauty/i, '').trim()
    
    // Calculate available space
    const availableSpace = maxLength - brand.length - separator.length
    
    // Truncate if necessary
    if (cleanTitle.length > availableSpace) {
      cleanTitle = cleanTitle.substring(0, availableSpace - 3) + '...'
    }
    
    return `${cleanTitle}${separator}${brand}`
  }

  const generateDescription = (title: string, content: string): string => {
    // Generate description between 150-160 characters
    const maxLength = 160
    
    // Extract key information from content
    let description = content
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Add actionable language
    const actionWords = ['Discover', 'Learn', 'Explore', 'Find out']
    const actionWord = actionWords[Math.floor(Math.random() * actionWords.length)]
    
    // Combine title with content summary
    let metaDescription = `${actionWord} ${title.toLowerCase()}. ${description}`
    
    // Truncate if necessary, ensuring it ends at a word boundary
    if (metaDescription.length > maxLength) {
      const truncated = metaDescription.substring(0, maxLength - 3)
      const lastSpace = truncated.lastIndexOf(' ')
      metaDescription = truncated.substring(0, lastSpace) + '...'
    }
    
    return metaDescription
  }

  return (
    <button
      type="button"
      onClick={generateSEO}
      disabled={isGenerating || !title || !content}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2 ${
        isGenerating || !title || !content
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
      }`}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {isGenerating ? 'Generating SEO...' : 'Generate SEO'}
    </button>
  )
}

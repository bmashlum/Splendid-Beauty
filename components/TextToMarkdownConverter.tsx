'use client'

import React from 'react'
import { Wand2, Sparkles } from 'lucide-react'

export interface TextToMarkdownConverterProps {
  content: string
  onConvert: (markdown: string) => void
}

export default function TextToMarkdownConverter({ content, onConvert }: TextToMarkdownConverterProps) {
  const convertToMarkdown = (text: string): string => {
    let markdown = text

    // Convert numbered items with topics to headers (like "**1. Topic**" or "1. Topic")
    markdown = markdown.replace(/\*\*(\d+)\.\s+([^*]+)\*\*/g, '\n## $1. $2\n')
    markdown = markdown.replace(/^(\d+)\.\s+([A-Za-z][^1-9]+)$/gm, '\n## $1. $2\n')

    // Convert "Ready to glow?" to a header
    markdown = markdown.replace(/Ready to glow\?/g, '\n## Ready to glow?\n')

    // Ensure proper spacing between paragraphs
    markdown = markdown.replace(/\n(?!\n)/g, '\n\n')

    // Clean up extra newlines (ensure only double newlines exist)
    markdown = markdown.replace(/\n{3,}/g, '\n\n')

    // Add paragraph breaks after list items if content follows directly
    markdown = markdown.replace(/(\. [^\n]+)\n([A-Z])/g, '$1\n\n$2')

    // Ensure proper paragraph spacing after headers
    markdown = markdown.replace(/^(## [^\n]+)$/gm, '$1\n')

    return markdown.trim()
  }

  const handleConvert = () => {
    const convertedMarkdown = convertToMarkdown(content)
    onConvert(convertedMarkdown)
  }

  // Example patterns for tooltip
  const examplePatterns = `Supported patterns:
**1. Topic** → ## Headers
Ready to glow? → ## Headers
Paragraphs → Proper spacing
@username → Links`

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={handleConvert}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48]"
        title="Convert text to markdown"
      >
        <Wand2 className="h-4 w-4" />
        Convert to Markdown
      </button>

      {/* Tooltip with supported patterns */}
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2 text-xs text-gray-600 bg-white border border-gray-200 rounded-md shadow-lg z-10">
        <pre className="whitespace-pre-wrap">{examplePatterns}</pre>
      </div>
    </div>
  )
}

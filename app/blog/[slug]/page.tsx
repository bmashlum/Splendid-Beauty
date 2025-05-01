'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostBySlug, BlogPost } from '../data/posts'

export default function BlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
      const foundPost = getBlogPostBySlug(slug)

      if (foundPost) {
        setPost(foundPost)
      } else {
        // Redirect to blog index if post not found
        router.push('/blog')
      }

      setLoading(false)
    }
  }, [params.slug, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#063f48]"></div>
      </div>
    )
  }

  if (!post) {
    return null // This will not render as we redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/blog"
            className="text-primary hover:text-primary/80 inline-flex items-center text-sm sm:text-base"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        <div className="relative h-64 sm:h-96 w-full mb-6 sm:mb-8 rounded-lg overflow-hidden shadow-md">
          <div className="relative w-full h-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-contain sm:object-cover"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{post.title}</h1>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 text-gray-600 text-sm">
          <span>{post.date}</span>
          <span className="mt-2 sm:mt-0">By {post.author}</span>
        </div>

        <div className="prose prose-sm sm:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-8 sm:mt-12 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-16 border-t pt-8">
          <div className="flex justify-between">
            <Link
              href="/blog"
              className="bg-[#063f48] text-white px-6 py-2 rounded-full hover:bg-[#052b31] transition-colors"
            >
              Back to All Posts
            </Link>

            <button
              onClick={() => router.push('/#blog', { scroll: false })}
              className="border border-[#063f48] text-[#063f48] px-6 py-2 rounded-full hover:bg-[#063f48] hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

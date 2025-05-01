'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts } from './data/posts'

export default function BlogPage() {
  const router = useRouter()
  const blogPosts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Splendid Beauty Blog</h1>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">Discover the latest beauty trends, expert tips, and professional advice from the Splendid Beauty team.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48 sm:h-64 w-full">
                <div className="relative w-full h-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-contain sm:object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/#blog', { scroll: false })}
            className="bg-[#063f48] text-white px-8 py-3 rounded-full hover:bg-[#052b31] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

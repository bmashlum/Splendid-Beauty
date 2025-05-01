'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts } from './data/posts'

export default function BlogPage() {
  const router = useRouter()
  const blogPosts = getAllBlogPosts()
  
  return (
    <div className="min-h-screen bg-white p-8 pt-24"> {/* Added pt-24 for navbar space */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Splendid Beauty Blog</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Discover the latest beauty trends, expert tips, and professional advice from the Splendid Beauty team.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-64 w-full">
                <Image 
                  src={post.coverImage} 
                  alt={post.title} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <span className="text-sm text-[#063f48]">{post.author}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-[#063f48] font-medium hover:underline inline-flex items-center"
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

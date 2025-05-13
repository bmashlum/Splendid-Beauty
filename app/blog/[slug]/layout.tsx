import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import BlogPostClientLayout from './client-layout'

export const metadata: Metadata = {
  title: 'Blog Post | Splendid Beauty',
  description: 'Detailed article from Splendid Beauty Blog.',
  openGraph: {
    title: 'Blog Post | Splendid Beauty',
    description: 'Detailed article from Splendid Beauty Blog.',
    url: 'https://splendidbeautybar.com/blog',
    siteName: 'Splendid Beauty Bar & Co.',
    images: [
      {
        url: '/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Splendid Beauty Blog',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[url('/images/elegant-gold-background.webp')] bg-cover bg-fixed bg-center relative">
      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/5"></div>
      <Navbar scrolled={true} />
      <main className="flex-grow overflow-y-auto overflow-x-hidden blog-post-container relative z-10">
        <BlogPostClientLayout>{children}</BlogPostClientLayout>
      </main>
    </div>
  )
}

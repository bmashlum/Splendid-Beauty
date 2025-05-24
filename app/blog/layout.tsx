import type { Metadata } from 'next'
import ClientLayout from './client-layout'
import './blog-typography.css'

export const metadata: Metadata = {
  title: 'Splendid Beauty Blog | Beauty Tips & Trends',
  description: 'Discover the latest beauty trends, skincare routines, and expert tips from Splendid Beauty Bar & Co. Stay updated on all things beauty.',
  keywords: 'beauty blog, skincare tips, beauty trends, hair care, makeup tutorials, Splendid Beauty Bar',
  openGraph: {
    title: 'Splendid Beauty Blog | Beauty Tips & Trends',
    description: 'Discover the latest beauty trends, skincare routines, and expert tips from Splendid Beauty Bar & Co.',
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
    type: 'website',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background image without fixed attachment for better performance */}
      <div className="absolute inset-0 bg-[url('/images/elegant-gold-background.webp')] bg-cover bg-center" />
      {/* Simplified overlay without backdrop blur */}
      <div className="absolute inset-0 bg-white/95"></div>
      <main className="flex-grow relative z-10">
        <ClientLayout>{children}</ClientLayout>
      </main>
    </div>
  )
}

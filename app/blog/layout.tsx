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
      
      {/* Multi-layer sophisticated overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9f7e8]/85 via-[#f9f7e8]/75 to-[#C09E6C]/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#063f48]/5 via-transparent to-transparent"></div>
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMC44IiBmaWxsPSIjQzA5RTZDIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIwLjYiIGZpbGw9IiMwNjNmNDgiIG9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] fixed" />
      </div>
      
      <main className="flex-grow relative z-10">
        <ClientLayout>{children}</ClientLayout>
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Navbar from '@/components/navbar' // Adjust path if needed

// Dynamically import components
const VideoModal = dynamic(() => import('@/app/components/VideoModal')) // Adjust path if needed
const GoogleMaps = dynamic(() => import('@/components/google-maps'), { // Adjust path if needed
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Loading Map...</div>,
})

// Define imageSections outside the component
const imageSections = [
  { id: 'top', src: '/images/home.png', alt: 'Splendid Beauty Bar & Co.', priority: true },
  { id: 'about', src: '/images/about.svg', alt: 'About Splendid Beauty Bar' },
  { id: 'about-award', src: '/images/about_companion_image_award.svg', alt: 'Splendid Beauty Bar Awards' },
  { id: 'about-award-2', src: '/images/about_companion_image_award_2.svg', alt: 'Splendid Beauty Bar Additional Awards' },
  { id: 'we-do-that', src: '/images/we_do_that.svg', alt: 'What We Do at Splendid Beauty Bar' },
  { id: 'book-now', src: '/images/Book Now.svg', alt: 'Book Your Appointment' },
  { id: 'true-beauty', src: '/images/true_beauty.svg', alt: 'True Beauty at Splendid Beauty Bar' },
  { id: 'portfolio', src: '/images/portfolio.svg', alt: 'Our Portfolio' },
  { id: 'shop', src: '/images/shop.svg', alt: 'Our Shop' },
  { id: 'hair-studio', src: '/images/Hair Studio.svg', alt: 'Hair Studio Services' },
  { id: 'academy', src: '/images/Academy.svg', alt: 'Beauty Academy' },
  { id: 'policies', src: '/images/Policies.svg', alt: 'Our Policies' },
  { id: 'connect', src: '/images/Connect.svg', alt: 'Connect With Us' },
  { id: 'blog', src: '/images/Blog.svg', alt: 'Our Blog' },
  { id: 'financing', src: '/images/Financing.svg', alt: 'Financing Options' },
  { id: 'perm-makeup', src: '/images/perm_makeup.svg', alt: 'Permanent Makeup Services' },
  { id: 'perm-medical', src: '/images/perm_medical.svg', alt: 'Permanent Medical Services' },
  { id: 'facial', src: '/images/facial.svg', alt: 'Facial Services' },
  { id: 'eyelash', src: '/images/eyelash.svg', alt: 'Eyelash Services' },
  { id: 'footer-policies', src: '/images/footer_policies.svg', alt: 'Footer Policies' }
]

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')
  const [isIframeOpen, setIsIframeOpen] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({})

  /* ---------- scroll detection ---------- */
  const [scrolled, setScrolled] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const main = mainRef.current
    if (!main) return

    const onScroll = () => {
      if (mainRef.current) {
        setScrolled(mainRef.current.scrollTop > 10)
      }
    }
    main.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      if (main) {
        main.removeEventListener('scroll', onScroll)
      }
    }
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px',
      }
    )

    const sections = document.querySelectorAll('section')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault()
    setIframeUrl(url)
    setIsIframeOpen(true)
  }

  // Callback function to mark an image as loaded
  const handleLoadingComplete = (sectionId: string) => {
    setLoadedImages(prev => ({ ...prev, [sectionId]: true }));
  }

  return (
    <>
      {/* Navbar component remains */}
      <Navbar scrolled={scrolled} />
      {/* Main scrolling container */}
      <main
        ref={mainRef}
        className="h-screen overflow-y-scroll overflow-x-hidden bg-[url('/images/elegant-gold-background.webp')] bg-cover pt-0"
      >
        {/* Map through image sections */}
        {imageSections.map((section, index) => {
          const isLoaded = !!loadedImages[section.id]
          const isVisible = !!visibleSections[section.id]
          const isPriority = index === 0

          // Determine animation based on scroll direction and section index
          const getAnimationClass = () => {
            if (!isVisible) return ''
            if (index % 3 === 0) return 'animate-fade-in-up'
            if (index % 3 === 1) return 'animate-fade-in-down'
            return 'animate-scale-in'
          }

          return (
            <section
              key={section.id}
              id={section.id}
              className={`relative ${section.id === 'top'
                  ? 'w-full -mt-4'
                  : 'w-[95%] mx-auto'
                } h-screen overflow-hidden my-4 sm:my-6`}
            >
              {/* Wrapper div for positioning placeholder and image */}
              <div
                className={`relative w-full h-full ${section.id === 'top'
                    ? ''
                    : 'rounded-lg'
                  } bg-white overflow-hidden ${getAnimationClass()}`}
              >
                {/* --- Animated Shimmer Placeholder --- */}
                <div
                  className={`
                    absolute inset-0 z-0
                    ${section.id === 'top' ? '' : 'rounded-lg'}
                    overflow-hidden
                    transition-opacity duration-700 ease-in-out
                    ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-shimmer'}
                  `}
                />
                {/* ------------------------------------ */}

                {/* Next.js Image Component */}
                <div className="relative w-full h-full">
                  <Image
                    src={section.src}
                    alt={section.alt}
                    fill
                    priority={isPriority}
                    className={`
                      relative z-10
                      transition-opacity duration-700 ease-in-out
                      ${isLoaded ? 'opacity-100' : 'opacity-0'}
                      ${section.id === 'top' ? 'object-cover' : 'object-contain sm:object-cover'}
                    `}
                    onLoadingComplete={() => handleLoadingComplete(section.id)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 90vw"
                    quality={75}
                    unoptimized={section.src.endsWith('.svg')}
                  />
                </div>

                {/* ---------- Content Overlays (ensure higher z-index) ---------- */}
                {section.id === 'connect' && (
                  <div className="absolute bottom-8 right-8 w-[385px] h-[284px] z-20">
                    {/* Google Maps Container */}
                    <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-2">
                      <GoogleMaps />
                    </div>

                    {/* Social Links Area */}
                    <div className="absolute -left-[315px] bottom-0 flex flex-col gap-6">
                      {/* Row of Icon Links */}
                      <div className="flex items-center gap-6">
                        {/* facebook */}
                        <a
                          href="https://www.facebook.com/splendidbeautybarandco"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e =>
                            handleSocialClick(
                              e,
                              'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsplendidbeautybarandco&tabs=timeline&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true'
                            )
                          }
                          className="group relative w-12 h-12 flex items-center justify-center bg-[#063f48] rounded-full hover:opacity-90 transition-all hover:scale-105"
                          aria-label="Visit our Facebook page"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333C14 5.378 14.192 5 15.115 5h2.885V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                          </svg>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#063f48] text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Facebook
                          </span>
                        </a>

                        {/* instagram */}
                        <a
                          href="https://www.instagram.com/splendidbeautybarandco/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e =>
                            handleSocialClick(e, 'https://www.instagram.com/splendidbeautybarandco/embed')
                          }
                          className="group relative w-12 h-12 flex items-center justify-center bg-[#063f48] rounded-full hover:opacity-90 transition-all hover:scale-105"
                          aria-label="Visit our Instagram profile"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072c-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0z" />
                            <circle cx="12" cy="12" r="3.5" />
                            <circle cx="18.406" cy="5.594" r="1.44" />
                          </svg>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#063f48] text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Instagram
                          </span>
                        </a>

                        {/* linktree */}
                        <a
                          href="https://linktr.ee/splendidbeautybarandco?utm_source=linktree_profile_share<sid=7c8995b9-b49c-44b1-973b-2fb0ff78377a"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative w-12 h-12 flex items-center justify-center bg-[#063f48] rounded-full hover:opacity-90 transition-all hover:scale-105"
                          aria-label="Visit our Linktree"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                          </svg>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#063f48] text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Linktree
                          </span>
                        </a>

                        {/* gift cards */}
                        <a
                          href="https://blvd.me/splendid-beauty-bar/gift-cards"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative w-12 h-12 flex items-center justify-center bg-[#063f48] rounded-full hover:opacity-90 transition-all hover:scale-105"
                          aria-label="Purchase gift cards"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                            />
                          </svg>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#063f48] text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Gift Cards
                          </span>
                        </a>
                      </div>

                      {/* Book Now Button */}
                      <a
                        href="https://dashboard.boulevard.io/booking/businesses/18e96cd8-7ca6-4e7e-8282-2055f45efbc4/widget#/visit-type"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center gap-2 bg-[#063f48] text-white px-8 py-4 rounded-full hover:opacity-90 transition-all hover:scale-105 self-start"
                      >
                        <span>BOOK NOW</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {/* Video trigger button */}
                {section.id === 'about-award' && (
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="absolute left-[20%] sm:left-[23%] top-[65%] sm:top-[67%] w-[30%] max-w-[250px] h-[15%] max-h-[120px] cursor-pointer rounded-lg hover:bg-black/10 transition-colors z-20"
                    aria-label="Watch announcement video"
                  />
                )}
                {/* ---------- End Content Overlays ---------- */}
              </div>
            </section>
          )
        })}

        {/* --- Modals --- */}
        {/* Video Modal Component (Dynamically Loaded) */}
        {isVideoModalOpen && (
          <VideoModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            videoId="DfVi23EdsxM"
          />
        )}

        {/* Iframe Modal Component */}
        {isIframeOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 sm:p-8">
            <div className="relative w-full max-w-6xl h-[90vh] sm:h-[80vh] bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col">
              {/* Modal Header */}
              <div className="flex-shrink-0 flex justify-end p-2 bg-gray-100 border-b border-border"> {/* Use CSS var */}
                <button
                  onClick={() => setIsIframeOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full z-10 transition-colors" /* Use CSS vars */
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Modal Content */}
              <div className="flex-grow overflow-hidden">
                <iframe
                  src={iframeUrl}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  allowFullScreen
                  title="Social Content"
                  loading="lazy"
                  scrolling="yes"
                />
              </div>
            </div>
          </div>
        )}
        {/* --- End Modals --- */}
      </main>
    </>
  )
}
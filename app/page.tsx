'use client'

import React, {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  useMemo,
  lazy
} from 'react'
import Image, { type StaticImageData } from 'next/image'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { getSectionConfig } from '@/lib/constants'

// --- Component Imports ---
import Navbar from '@/components/navbar'
import EventsSection from '@/components/EventsSection'
import AnimatedImage from '@/components/AnimatedImage'

// --- Schema Imports ---
const SEOSchema = dynamic(() => import('@/components/schema/SEOSchema'), { 
  ssr: false,
  loading: () => null 
})

// --- Types ---
type ButtonPosition = { x: number; y: number };
type SocialLink = { href: string; label: string; IconSvg: ReactNode };

// --- Modal Components ---
interface GenericIframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  iframeUrl: string;
  title?: string;
}

const GenericIframeModal = React.memo(({ isOpen, onClose, iframeUrl, title = 'Content' }: GenericIframeModalProps) => {
  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-4xl h-[85vh] transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
          <Dialog.Title as="h3" className="px-4 py-2 bg-[#063f48] text-white font-medium">
            {title}
          </Dialog.Title>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-white hover:text-gray-300 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            aria-label="Close iframe"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="h-[calc(100%-40px)]">
            <iframe
              src={iframeUrl}
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="border-0"
              title={title}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
});
GenericIframeModal.displayName = 'GenericIframeModal';


// --- Image Imports (ensure paths are correct) ---
const staticImageImports: Record<string, () => Promise<{ default: StaticImageData }>> = {
  'about': () => import('@/public/images/About Us.webp'),
  'award-1': () => import('@/public/images/3.webp'),
  'award-2': () => import('@/public/images/4.webp'),
  'we-do-that': () => import('@/public/images/We Do That.webp'),
  'book-now': () => import('@/public/images/Book Now.webp'),
  'true-beauty': () => import('@/public/images/7.webp'),
  'portfolio': () => import('@/public/images/Portfolio.webp'),
  'shop': () => import('@/public/images/Shop.webp'),
  'hair-studio': () => import('@/public/images/Hair Studio.webp'),
  'academy': () => import('@/public/images/Academy.webp'),
  'policies': () => import('@/public/images/Policies.webp'),
  'connect': () => import('@/public/images/Connect.webp'),
  'financing': () => import('@/public/images/Financing.webp'),
  'perm-makeup': () => import('@/public/images/perm_makeup.webp'),
  'perm-medical': () => import('@/public/images/perm_medical.webp'),
  'facial': () => import('@/public/images/facial.webp'),
  'eyelash': () => import('@/public/images/eyelash.webp')
};

// Add image quality configuration - lowered for better performance
const imageQualityConfig: Record<string, number> = {
  'hero': 85, 'about': 85, 'award-1': 85, 'award-2': 85, 'we-do-that': 85, 'book-now': 85,
  'true-beauty': 80, 'portfolio': 80, 'shop': 80, 'hair-studio': 80, 'academy': 80,
  'policies': 80, 'connect': 80, 'financing': 80, 'perm-makeup': 80,
  'perm-medical': 80, 'facial': 80, 'eyelash': 80
};

// Add priority configuration for above-the-fold images
const priorityImages = ['hero', 'about', 'award-1', 'award-2', 'we-do-that'];

// --- Configuration Constants ---
const FACEBOOK_PAGE_URL = "https://www.facebook.com/splendidbeautybarandco";
const INSTAGRAM_PAGE_URL = "https://www.instagramotion.com/splendidbeautybar/";
const BOOKING_URL = "https://dashboard.boulevard.io/booking/businesses/18e96cd8-7ca6-4e7e-8282-2055f45efbc4/widget#/visit-type";
const YOUTUBE_VIDEO_ID = "DfVi23EdsxM";

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-red-100 p-4 text-center">
          <div className="rounded-lg bg-white p-8 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-red-700">Oops! Something went wrong.</h2>
            <p className="mb-4 text-gray-700">Please try refreshing the page.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left text-sm">
                <summary className="cursor-pointer">Details</summary>
                <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 text-xs">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
              type="button"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Dynamic Imports with error handling ---
const VideoModal = dynamic(() => import('@/components/VideoModal'), {
  loading: () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 text-white backdrop-blur-sm">
      <div className="animate-pulse">Loading Video Player...</div>
    </div>
  ),
  ssr: false
});

const GoogleMaps = dynamic(() => import('@/components/google-maps'), {
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
      <div className="animate-pulse">Loading Map...</div>
    </div>
  ),
  ssr: false
});

// --- Helper Functions ---
const getAltText = (id: string): string => {
  const altTexts: Record<string, string> = {
    'hero': 'Splendid Beauty Bar & Co. - Luxury beauty salon in Atlanta showcasing premium beauty services',
    'about-us': 'About Splendid Beauty Bar & Co. - Our beauty salon story and mission',
    'award-1': 'Award-winning beauty services at Splendid Beauty Bar & Co.',
    'award-2': 'Recognition and excellence in beauty treatments at Splendid Beauty Bar',
    'we-do-that': 'Comprehensive beauty services offered at Splendid Beauty Bar & Co.',
    'book-now': 'Book your beauty appointment at Splendid Beauty Bar & Co. in Atlanta',
    'true-beauty': 'True beauty transformation services at Splendid Beauty Bar',
    'portfolio': 'Portfolio of beauty transformations and client results at Splendid Beauty',
    'shop': 'Premium beauty products available at Splendid Beauty Bar & Co.',
    'hair-studio': 'Professional hair studio services at Splendid Beauty Bar',
    'academy': 'Beauty education and training at Splendid Beauty Academy',
    'policies': 'Client policies and procedures at Splendid Beauty Bar & Co.',
    'connect': 'Connect with Splendid Beauty Bar - Contact information and location',
    'financing': 'Financing options available for beauty services at Splendid Beauty',
    'perm-makeup': 'Permanent makeup services including microblading at Splendid Beauty Bar',
    'perm-medical': 'Medical-grade permanent makeup treatments at Splendid Beauty Bar',
    'facial': 'Professional facial treatments and skin care at Splendid Beauty Bar',
    'eyelash': 'Eyelash extensions and enhancements at Splendid Beauty Bar & Co.'
  };

  return altTexts[id] || `${id} beauty service at Splendid Beauty Bar`;
};

// --- Data & Types ---
type SectionData = {
  id: string;
  overlay?: 'video' | 'connect' | 'linktree' | 'bookbutton';
  hasAnimatedText?: boolean;
  isSpacer?: boolean;
  heightClass?: string;
  content?: ReactNode;
  objectPosition?: string;
};

const sectionsData: SectionData[] = [
  // Adjusted connect objectPosition slightly for default/XL
  { id: 'hero', objectPosition: 'object-[center_top_15%] sm:object-center' }, // Shift image down 15% on mobile
  { id: 'events', content: <EventsSection /> },
  { id: 'about-us', objectPosition: 'object-center' },
  { id: 'award-1', objectPosition: 'object-center' },
  { id: 'award-2', objectPosition: 'object-center' },
  { id: 'we-do-that', objectPosition: 'object-center' },
  { id: 'book-now', objectPosition: 'object-center', overlay: 'bookbutton' },
  { id: 'true-beauty', objectPosition: 'object-center' },
  { id: 'portfolio', objectPosition: 'object-center' },
  { id: 'shop', overlay: 'linktree', objectPosition: 'object-center' },
  { id: 'hair-studio', objectPosition: 'object-center' },
  { id: 'academy', objectPosition: 'object-center' },
  { id: 'policies', objectPosition: 'object-center' },
  { id: 'connect', overlay: 'connect', objectPosition: 'object-bottom xl:object-center' }, // Default bottom, center on XL
  { id: 'financing', objectPosition: 'object-center' },
  { id: 'perm-makeup', objectPosition: 'object-center xl:object-contain' }, // Using contain on XL screens
  { id: 'perm-medical', objectPosition: 'object-center xl:object-contain' }, // Using contain on XL screens
  { id: 'facial', objectPosition: 'object-center xl:object-contain' }, // Using contain on XL screens
  { id: 'eyelash', objectPosition: 'object-center xl:object-contain' }, // Using contain on XL screens
];

// --- Animation Variants ---
const sectionVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.7, bounce: 0.2 } },
} as const;

const overlayVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.8, delay: 0.2, bounce: 0.1 } },
  exit: { opacity: 0, y: 15, transition: { duration: 0.3 } }
} as const;

const aboutTextVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut', delay: 0.1 } }
} as const;


// --- Section Component ---
interface SectionProps {
  section: SectionData & { priority?: boolean };
  onVideoClick: () => void;
  onSocialClick: (event: React.MouseEvent, url: string) => void;
  loadedImages: Record<string, StaticImageData | null>;
  onBookingClick: () => void;
  onGiftCardClick: () => void;
  onContactClick: () => void;
}

const Section: React.FC<SectionProps> = React.memo(({ section, onVideoClick, onSocialClick, loadedImages, onBookingClick, onGiftCardClick, onContactClick }) => {
  const { id, overlay, isSpacer, heightClass, content, objectPosition = 'object-center' } = section;
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInViewForAnimation = useInView(sectionRef, { once: true, amount: 0.05 });
  const isSectionInViewForPlayback = useInView(sectionRef, { amount: 0.1, once: false });
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isConnectFabExpanded, setIsConnectFabExpanded] = useState(false);

  // Check if this is one of the sections that needs mobile buttons
  const needsMobileButton = ['perm-makeup', 'perm-medical', 'facial', 'eyelash'].includes(id);

  // Button positions optimized for XL screens
  const buttonPositions = useMemo<Record<string, ButtonPosition>>(() => ({
    bookAppointment: { x: 647, y: 640 },
    chatProfessional: { x: 1003, y: 640 },
    giftCertificate: { x: 819, y: 790 }
  }), []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (id === 'shop' && sectionRef.current) {
      const videoElement = sectionRef.current.querySelector('video');
      if (!videoElement) return;

      const handleVideoEnd = () => setVideoCompleted(true);
      const handlePlay = () => setVideoCompleted(false);
      
      videoElement.addEventListener('ended', handleVideoEnd);
      videoElement.addEventListener('play', handlePlay);
      
      // Set initial state
      if (!videoElement.paused && !videoElement.ended) {
        setVideoCompleted(false);
      } else if (videoElement.ended) {
        setVideoCompleted(true);
      }
      
      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('play', handlePlay);
      };
    }
  }, [id, isSectionInViewForPlayback]);


  if (content) {
    return <section ref={sectionRef as React.RefObject<HTMLElement>} id={id} className="w-full my-4 sm:my-6 md:my-8">{content}</section>;
  }
  if (isSpacer) {
    return <div className={cn('w-full', heightClass || 'h-10 sm:h-16')} />;
  }

  const isHero = id === 'hero';
  const sectionConfig = getSectionConfig(id);
  const staticImageSrc = !sectionConfig ? loadedImages[id] : null;

  // Section container classes: Full width/aspect-video by default, constrained on XL+
  const sectionClasses = cn(
    'relative w-full overflow-hidden', // Common base classes
    isHero
      ? [
        'mt-28 sm:mt-20 md:mt-20 lg:mt-6', // Even more top margin on mobile
        'aspect-[16/10] sm:aspect-video md:h-[70vh] xl:h-screen xl:w-full', // Different aspect ratio on mobile
        'my-0 sm:my-0 md:my-0', // No additional vertical margins for hero
        'pt-12 sm:pt-0' // Additional padding at the top for mobile
      ]
      : [ // Other sections:
        'my-1 sm:my-4 lg:my-6', // Margins for non-hero sections
        'aspect-video xl:h-[95vh]', // Handles height across breakpoints
        'xl:w-[95%] xl:mx-auto xl:rounded-lg xl:shadow-lg' // XL specific width, centering, and styling
      ]
  );

  // Sizes prop: 100vw up to XL, then 80vw
  const imageSizes = isHero
    ? '100vw'
    : '(max-width: 1279px) 100vw, 80vw';

  // --- Connect Overlay ---
  if (overlay === 'connect') {
    return (
      <motion.section
        ref={sectionRef as React.RefObject<HTMLElement>}
        id={id}
        className={sectionClasses}
        variants={sectionVariants}
        initial="initial"
        animate={isSectionInViewForAnimation ? "animate" : "initial"}
      >
        <div className="relative w-full h-full">
          {sectionConfig ? (
            <AnimatedImage
              imagePath={`/images/${sectionConfig.imageName}${sectionConfig.imageName.endsWith('.webp') ? '' : '.png'}`}
              videoPath={`/images/${sectionConfig.videoName}.mp4`}
              alt={`${id} section background`}
              sizes={imageSizes}
              objectPosition={objectPosition}
              priority={isHero || section.priority || priorityImages.includes(id)}
              isInView={isHero ? true : isSectionInViewForPlayback}
              imageOnly={isHero}
            />
          ) : staticImageSrc ? (
            <Image
              src={staticImageSrc}
              alt={`${id} section background`}
              fill
              className={cn(
                "w-full h-full object-cover",
                objectPosition
              )}
              priority={isHero || priorityImages.includes(id)}
              sizes={imageSizes}
              quality={imageQualityConfig[id] || 100}
              loading={isHero || priorityImages.includes(id) ? 'eager' : 'lazy'}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4="
              style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center"><p>Loading content for {id}...</p></div>
          )}

          {/* Floating Action Button for mobile/tablet, only when in view */}
          {isSectionInViewForAnimation && (
            <button
              type="button"
              className="absolute bottom-4 right-4 xl:hidden flex items-center justify-center w-14 h-14 rounded-full bg-[#063f48] shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transform transition-transform hover:scale-105 active:scale-95"
              aria-label="Open contact and map"
              onClick={() => setIsConnectFabExpanded(true)}
            >
              {/* Map/Location Icon */}
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z" /></svg>
            </button>
          )}
          {/* Modal for mobile/tablet */}
          <Dialog open={isConnectFabExpanded} onClose={() => setIsConnectFabExpanded(false)} className="xl:hidden">
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
              <Dialog.Panel className="w-full max-w-md mx-auto bg-white rounded-t-2xl sm:rounded-2xl p-4 pb-6 shadow-2xl relative">
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full"
                  aria-label="Close contact and map"
                  onClick={() => setIsConnectFabExpanded(false)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex flex-col items-center gap-4">
                  {/* Socials */}
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#063f48] text-white"><svg viewBox="0 0 320 512" fill="currentColor" className="h-6 w-6"><path d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.5 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z" /></svg></a>
                    <a href={INSTAGRAM_PAGE_URL} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#063f48] text-white"><svg viewBox="0 0 448 512" fill="currentColor" className="h-6 w-6"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186c-39.5 0-71.5-32-71.5-71.5s32-71.5 71.5-71.5 71.5 32 71.5 71.5-32 71.5-71.5 71.5zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.1C385.6 9.9 354.2 1.7 318.9 0 278.4-1.7 169.6-1.7 129.1 0 93.8 1.7 62.4 9.9 37.1 35.2 9.9 62.4 1.7 93.8 0 129.1c-1.7 40.5-1.7 149.3 0 189.8 1.7 35.3 9.9 66.7 36.2 92.1 27.2 27.2 58.6 35.4 93.9 37.1 40.5 1.7 149.3 1.7 189.8 0 35.3-1.7 66.7-9.9 92.1-36.2 27.2-27.2 35.4-58.6 37.1-93.9 1.7-40.5 1.7-149.3 0-189.8z" /></svg></a>
                  </div>
                  <button
                    onClick={() => { onBookingClick(); setIsConnectFabExpanded(false); }}
                    className="w-full group flex items-center justify-center gap-2 rounded-full bg-[#063f48] px-6 py-3 text-white text-base font-medium transition-all hover:scale-105 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 mb-2"
                  >
                    <span>BOOK NOW</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" /></svg>
                  </button>
                  <div className="w-full h-[160px] sm:h-[200px] rounded-lg overflow-hidden bg-white/95 p-1.5 shadow-xl backdrop-blur-md border border-gray-200/50">
                    <Suspense fallback={<div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-500 text-sm">Loading Map...</div>}>
                      <GoogleMaps />
                    </Suspense>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
        {/* Desktop/XL version (unchanged) */}
        <motion.div
          className="hidden xl:flex absolute bottom-4 right-4 left-auto z-20 p-0"
          variants={overlayVariants}
          initial="initial"
          animate={isSectionInViewForAnimation ? "animate" : "initial"}
        >
          <div className="flex flex-col xl:flex-row items-center xl:items-end gap-3 xl:gap-4 bg-black/40 xl:bg-transparent p-3 xl:p-0 rounded-lg xl:rounded-none">
            {/* Map container: Move right on XL & responsive height */}
            <div className="w-full max-w-full md:max-w-[360px] xl:max-w-[320px] lg:max-w-[360px] xl:w-[385px] h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] xl:h-[284px] order-2 xl:order-2 xl:ml-auto">
              <div className="h-full w-full overflow-hidden rounded-lg bg-white/95 p-1.5 shadow-xl backdrop-blur-md border border-gray-200/50">
                <Suspense fallback={<div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-500 text-sm">Loading Map...</div>}>
                  <GoogleMaps />
                </Suspense>
              </div>
            </div>
            {/* Buttons/Social: Move left on XL */}
            <div className="flex flex-row flex-wrap justify-center xl:flex-col items-center xl:items-start gap-2 md:gap-3 order-1 xl:order-1 w-full xl:w-auto xl:mr-44 xl:-translate-y-8">
              <div className="flex items-center justify-center gap-3">
                {[
                  {
                    href: FACEBOOK_PAGE_URL, label: "Facebook", IconSvg: (
                      <svg viewBox="0 0 320 512" fill="currentColor" className="h-6 w-6 text-white mx-auto"><path d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.5 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z" /></svg>
                    )
                  },
                  {
                    href: INSTAGRAM_PAGE_URL, label: "Instagram", IconSvg: (
                      <svg viewBox="0 0 448 512" fill="currentColor" className="h-6 w-6 text-white mx-auto"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186c-39.5 0-71.5-32-71.5-71.5s32-71.5 71.5-71.5 71.5 32 71.5 71.5-32 71.5-71.5 71.5zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.1C385.6 9.9 354.2 1.7 318.9 0 278.4-1.7 169.6-1.7 129.1 0 93.8 1.7 62.4 9.9 37.1 35.2 9.9 62.4 1.7 93.8 0 129.1c-1.7 40.5-1.7 149.3 0 189.8 1.7 35.3 9.9 66.7 36.2 92.1 27.2 27.2 58.6 35.4 93.9 37.1 40.5 1.7 149.3 1.7 189.8 0 35.3-1.7 66.7-9.9 92.1-36.2 27.2-27.2 35.4-58.6 37.1-93.9 1.7-40.5 1.7-149.3 0-189.8z" /></svg>
                    )
                  }
                ].map(social => (
                  <a key={social.label} href={social.href} onClick={(e) => onSocialClick(e, social.href)} target="_blank" rel="noopener noreferrer" className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#063f48] transition-all hover:scale-105 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400" aria-label={social.label}>
                    {social.IconSvg}
                  </a>
                ))}
              </div>
              <button
                onClick={onBookingClick}
                className="w-full sm:w-auto group relative flex items-center justify-center gap-2 rounded-full bg-[#063f48] px-4 py-2 md:px-6 md:py-3 text-white text-xs sm:text-sm font-medium transition-all hover:scale-105 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
              >
                <span>BOOK NOW</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id={id}
      className={sectionClasses}
      variants={sectionVariants}
      initial="initial"
      animate={isSectionInViewForAnimation ? "animate" : "initial"}
    >
      <div className="relative w-full h-full">
        {sectionConfig ? (
          <AnimatedImage
            imagePath={`/images/${sectionConfig.imageName}${sectionConfig.imageName.endsWith('.webp') ? '' : '.png'}`}
            videoPath={`/images/${sectionConfig.videoName}.mp4`}
            alt={getAltText(id)}
            sizes={imageSizes}
            objectPosition={objectPosition}
            priority={isHero || section.priority || priorityImages.includes(id)}
            isInView={isHero ? true : isSectionInViewForPlayback}
            imageOnly={isHero}
          />
        ) : staticImageSrc ? (
          <Image
            src={staticImageSrc}
            alt={getAltText(id)}
            fill
            className={cn(
              "w-full h-full object-cover",
              objectPosition.includes("xl:object-contain") ? "xl-object-contain" : "",
              // Only use positioning part from objectPosition
              objectPosition.includes("object-center") ? "object-center" : "",
              objectPosition.includes("object-bottom") ? "object-bottom" : "",
              objectPosition.includes("object-top") ? "object-top" : "",
              objectPosition.includes("object-left") ? "object-left" : "",
              objectPosition.includes("object-right") ? "object-right" : "",
              objectPosition.includes("xl:object-center") ? "xl:object-center" : ""
            )}
            priority={isHero || section.priority || priorityImages.includes(id)}
            sizes={imageSizes}
            quality={imageQualityConfig[id] || 80}
            loading={isHero || section.priority || priorityImages.includes(id) ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: isHero ? 'transform' : 'auto'
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center"><p>Loading content for {id}...</p></div>
        )}

        {/* Mobile Button for special sections - Removed as requested */}
      </div>

      {/* Video Button Overlay */}
      {overlay === 'video' && (
        <motion.button
          onClick={onVideoClick}
          className="absolute left-[50%] top-[70%] transform -translate-x-1/2 -translate-y-1/2 h-[12%] w-[30%] max-h-[80px] max-w-[180px] sm:left-[15%] sm:top-[60%] sm:h-[18%] sm:w-[35%] sm:max-h-[130px] sm:max-w-[280px] cursor-pointer rounded-lg transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
          aria-label="Watch introduction video"
          variants={overlayVariants}
          initial="initial"
          animate={isSectionInViewForAnimation ? "animate" : "initial"}
        />
      )}

      {/* Linktree Button Overlay for Shop */}
      {overlay === 'linktree' && id === 'shop' && (
        <AnimatePresence>
          {videoCompleted && (
            <motion.div
              className="absolute inset-0 flex items-center justify-end pointer-events-none pr-4 sm:pr-8 md:pr-16 xl:pr-32" // Responsive padding
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <a
                href="https://linktr.ee/splendidbeautybarandco"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto inline-block px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-[#063f48] text-white text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-lg hover:bg-[#05535e] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48]"
              >
                Visit Our Linktree
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Bookbutton Overlay - Desktop and Mobile */}
      {overlay === 'bookbutton' && isClient && (
        <>
          {/* Desktop buttons with fixed positioning (original) */}
          <div className="absolute inset-0 z-50 pointer-events-auto xl:pointer-events-auto hidden xl:block"> {/* Hide below XL */}
            <div style={{ position: 'absolute', left: buttonPositions.bookAppointment.x, top: buttonPositions.bookAppointment.y, transform: 'translate(-50%, -50%)', zIndex: 100 }}>
              <button onClick={onBookingClick} className="px-8 py-2 bg-transparent text-transparent text-lg font-bold rounded border-transparent hover:bg-transparent/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48]" style={{ width: "292px", height: "57px", opacity: 0 }} aria-label="Book an appointment">
                Book Your Appointment
              </button>
            </div>
            <div style={{ position: 'absolute', left: buttonPositions.chatProfessional.x, top: buttonPositions.chatProfessional.y, transform: 'translate(-50%, -50%)', zIndex: 100 }}>
              <button onClick={onContactClick} className="px-8 py-2 bg-transparent text-transparent text-lg font-bold rounded border-transparent hover:bg-transparent/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48]" style={{ width: "292px", height: "57px", opacity: 0 }} aria-label="Contact us">
                Chat With A Professional
              </button>
            </div>
            <div style={{ position: 'absolute', left: buttonPositions.giftCertificate.x, top: buttonPositions.giftCertificate.y, transform: 'translate(-50%, -50%)', zIndex: 100 }}>
              <button onClick={onGiftCardClick} className="px-8 py-2 bg-transparent text-transparent text-lg font-bold rounded border-transparent hover:bg-transparent/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48]" style={{ width: "292px", height: "57px", opacity: 0 }} aria-label="Buy gift cards">
                Purchase A Gift Certificate
              </button>
            </div>
          </div>

          {/* Mobile buttons at same positions with responsive sizing */}
          <div className="absolute inset-0 z-50 pointer-events-auto xl:hidden">
            {/* Book Appointment Button - Responsive sizing based on viewport */}
            <div className="absolute left-1/4 top-[64%] transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto">
              <button
                onClick={onBookingClick}
                className="bg-transparent text-transparent rounded-full border-transparent hover:bg-transparent/20 active:bg-transparent/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] cursor-pointer"
                style={{
                  width: "calc(40vw)",
                  height: "calc(8vw)",
                  maxWidth: "292px",
                  maxHeight: "57px",
                  minWidth: "120px",
                  minHeight: "30px"
                }}
                aria-label="Book an appointment"
              >
                Book Appointment
              </button>
            </div>

            {/* Chat With A Professional Button - Responsive sizing based on viewport */}
            <div className="absolute left-3/4 top-[64%] transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto">
              <button
                onClick={onContactClick}
                className="bg-transparent text-transparent rounded-full border-transparent hover:bg-transparent/20 active:bg-transparent/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] cursor-pointer"
                style={{
                  width: "calc(40vw)",
                  height: "calc(8vw)",
                  maxWidth: "292px",
                  maxHeight: "57px",
                  minWidth: "120px",
                  minHeight: "30px"
                }}
                aria-label="Contact us"
              >
                Chat With Professional
              </button>
            </div>

            {/* Gift Certificate Button - Responsive sizing based on viewport */}
            <div className="absolute left-1/2 top-[79%] transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto">
              <button
                onClick={onGiftCardClick}
                className="bg-transparent text-transparent rounded-full border-transparent hover:bg-transparent/20 active:bg-transparent/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] cursor-pointer"
                style={{
                  width: "calc(40vw)",
                  height: "calc(8vw)",
                  maxWidth: "292px",
                  maxHeight: "57px",
                  minWidth: "120px",
                  minHeight: "30px"
                }}
                aria-label="Buy gift cards"
              >
                Gift Certificate
              </button>
            </div>
          </div>
        </>
      )}

      {/* Hair Studio Contact Button - Mobile and Desktop */}
      {id === 'hair-studio' && isClient && (
        <>
          {/* Desktop button (original) */}
          <button
            onClick={onContactClick}
            className="contact-btn hidden xl:block absolute left-[78%] top-[83%] transform -translate-y-1/2 z-50 px-10 py-10 bg-white/90 backdrop-blur-sm text-[#063f48] text-lg font-bold rounded-full shadow-xl hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] cursor-pointer opacity-0"
            aria-label="Contact us for hair studio"
          >
            Contact Us
          </button>

          {/* Mobile button at same position with responsive sizing */}
          <button
            onClick={onContactClick}
            className="xl:hidden absolute left-[78%] top-[83%] transform -translate-y-1/2 -translate-x-1/2 z-50 bg-transparent text-transparent rounded-full hover:bg-transparent/20 active:bg-transparent/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] cursor-pointer pointer-events-auto"
            aria-label="Contact us for hair studio"
            style={{
              width: "calc(40vw)",
              height: "calc(8vw)",
              maxWidth: "292px",
              maxHeight: "57px",
              minWidth: "120px",
              minHeight: "30px"
            }}
          >
            Contact Us
          </button>
        </>
      )}

      {/* Financing Button - Mobile and Desktop */}
      {id === 'financing' && isClient && (
        <>
          {/* Desktop button with fixed positioning (original) */}
          <div className="absolute inset-0 flex items-end justify-center pb-32 pointer-events-none hidden xl:flex">
            <button
              onClick={() => window.open('https://pay.withcherry.com/splendidbeautybar?utm_source=finder&m=8955', '_blank', 'noopener,noreferrer')}
              className="px-8 py-4 bg-transparent text-transparent text-lg font-semibold rounded-full hover:bg-transparent/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] pointer-events-auto translate-x-72 opacity-0"
              aria-label="Apply for Financing"
            >
              Apply for Financing
            </button>
          </div>

          {/* Mobile button positioned exactly like the desktop version for Financing - smaller and lower */}
          <div className="absolute inset-0 xl:hidden">
            <div className="absolute bottom-[17%] left-1/2 transform translate-x-[-50%] z-50">
              <button
                onClick={() => window.open('https://pay.withcherry.com/splendidbeautybar?utm_source=finder&m=8955', '_blank', 'noopener,noreferrer')}
                className="bg-transparent text-transparent hover:bg-transparent/20 active:bg-transparent/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] cursor-pointer"
                style={{
                  width: "calc(40vw)",
                  height: "calc(8vw)",
                  maxWidth: "250px",
                  maxHeight: "50px",
                  minWidth: "150px",
                  minHeight: "35px"
                }}
                aria-label="Apply for Financing"
              >
                Apply for Financing
              </button>
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
});
Section.displayName = 'Section';

// --- Home Component ---
export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [iframeOpen, setIframeOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeTitle, setIframeTitle] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, StaticImageData | null>>({});
  const [imagesLoading, setImagesLoading] = useState(true);

  const openBookingIframe = useCallback(() => {
    setIframeUrl(BOOKING_URL);
    setIframeTitle('Book an Appointment');
    setIframeOpen(true);
  }, []);

  const openGiftCardIframe = useCallback(() => {
    setIframeUrl('https://blvd.me/splendid-beauty-bar/gift-cards');
    setIframeTitle('Gift Cards');
    setIframeOpen(true);
  }, []);

  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById('connect');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const loadPriorityStaticImages = async () => {
      setImagesLoading(true);

      // First, load only priority images (hero + above fold)
      const priorityImportEntries = Object.entries(staticImageImports)
        .filter(([id]) => id === 'hero' || priorityImages.includes(id));

      const priorityImagePromises = priorityImportEntries.map(async ([id, importFn]) => {
        try {
          const module = await importFn();
          return { id, image: module.default };
        } catch (error) {
          console.error(`Failed to load priority image for section ${id}:`, error);
          return { id, image: null };
        }
      });

      // Load hero and priority images first
      const settledPriorityImages = await Promise.all(priorityImagePromises);
      const newLoadedImages: Record<string, StaticImageData | null> = {};
      settledPriorityImages.forEach(result => {
        if (result) {
          newLoadedImages[result.id] = result.image;
        }
      });

      // Update state with just priority images to start rendering quickly
      setLoadedImages(newLoadedImages);
      setImagesLoading(false);

      // Then load remaining images after a small delay
      setTimeout(() => {
        const remainingImportEntries = Object.entries(staticImageImports)
          .filter(([id]) => id !== 'hero' && !priorityImages.includes(id));

        const remainingImagePromises = remainingImportEntries.map(async ([id, importFn]) => {
          try {
            const module = await importFn();
            return { id, image: module.default };
          } catch (error) {
            console.error(`Failed to load image for section ${id}:`, error);
            return { id, image: null };
          }
        });

        // Process remaining images in batches to avoid blocking the main thread
        Promise.all(remainingImagePromises).then(settledImages => {
          setLoadedImages(prevImages => {
            const updatedImages = { ...prevImages };
            settledImages.forEach(result => {
              if (result) {
                updatedImages[result.id] = result.image;
              }
            });
            return updatedImages;
          });
        });
      }, 1000); // Delay non-priority images by 1 second
    };

    loadPriorityStaticImages();
  }, [priorityImages]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el || imagesLoading) return;

    const handleScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
    };
  }, [imagesLoading]);

  const handleVideoClick = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  const handleSocialClick = useCallback((_event: React.MouseEvent, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const closeIframe = useCallback(() => {
    setIframeOpen(false);
    setTimeout(() => {
      setIframeUrl('');
      setIframeTitle('');
    }, 300);
  }, []);

  const sectionsToRender = useMemo(() => sectionsData.filter(s => s.id !== 'hero'), []);
  const heroSectionData = useMemo(() => sectionsData.find(s => s.id === 'hero'), []);

  // Avoid loading fallback to improve FCP/LCP
  if (imagesLoading) {
    return (
      <div className="min-h-screen bg-[#f9f7e8]"
        style={{
          backgroundImage: "url('/images/elegant-gold-background.webp')",
          backgroundColor: "#f9f7e8",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <Navbar scrolled={false} />
        <main className="h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ opacity: { duration: 0.3 }, rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
            className="h-12 w-12 border-4 border-t-[#063f48] border-r-[#063f48]/30 border-b-[#063f48]/30 border-l-[#063f48]/30 rounded-full"
          />
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div className="flex h-screen w-full items-center justify-center bg-red-100 text-red-700 p-4 text-center">
        An error occurred. Please refresh the page.
      </div>
    }>
      {/* Add structured data for SEO */}
      <SEOSchema />
      {/* Add global CSS for xl-object-contain */}
      <Head>
        {/* Preload critical background and LCP hero image */}
        <link
          rel="preload"
          href="/images/elegant-gold-background.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/images/Home.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://boulevard.io" crossOrigin="" />
        <link rel="preconnect" href="https://dashboard.boulevard.io" crossOrigin="" />
        <link rel="preconnect" href="https://blvd.me" crossOrigin="" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />

        {/* XL object-contain style */}
        <style>{`
          @media (min-width: 1280px) {
            .xl-object-contain {
              object-fit: contain !important;
            }
          }
        `}</style>
      </Head>
      <div
        className="min-h-screen bg-[#f9f7e8]"
        style={{
          backgroundImage: "url('/images/elegant-gold-background.webp')",
          backgroundColor: "#f9f7e8", /* Fallback color */
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
          transform: "translateZ(0)"
        }}>
        <Navbar scrolled={scrolled} />
        <main
          ref={mainRef}
          id="main-content"
          className="h-screen overflow-y-auto overflow-x-hidden scroll-smooth focus:outline-none pt-6 sm:pt-4"
          tabIndex={-1}
        >
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-xl text-gray-700">Loading Sections...</div>}>
            {heroSectionData && (
              <Section
                key={heroSectionData.id}
                section={{ ...heroSectionData, priority: true }}
                onVideoClick={handleVideoClick}
                onSocialClick={handleSocialClick}
                loadedImages={loadedImages}
                onBookingClick={openBookingIframe}
                onGiftCardClick={openGiftCardIframe}
                onContactClick={scrollToContact}
              />
            )}
            {sectionsToRender.map((section) => (
              <Section
                key={section.id}
                section={section}
                onVideoClick={handleVideoClick}
                onSocialClick={handleSocialClick}
                loadedImages={loadedImages}
                onBookingClick={openBookingIframe}
                onGiftCardClick={openGiftCardIframe}
                onContactClick={scrollToContact}
              />
            ))}
          </Suspense>

          <AnimatePresence>
            {videoOpen && (
              <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 text-white">Loading Video...</div>}>
                <VideoModal isOpen={videoOpen} onClose={closeVideo} videoId={YOUTUBE_VIDEO_ID} />
              </Suspense>
            )}
            {iframeOpen && iframeUrl && (
              <GenericIframeModal isOpen={iframeOpen} onClose={closeIframe} iframeUrl={iframeUrl} title={iframeTitle} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
}
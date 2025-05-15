'use client'

import React, {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  useMemo
} from 'react'
import Image, { type StaticImageData } from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { getSectionConfig } from '@/lib/constants'

// --- Component Imports ---
import Navbar from '@/components/navbar'
import EventsSection from '@/components/EventsSection'
import AnimatedImage from '@/components/AnimatedImage'

// Create a new component for the iframe modal
const GenericIframeModal = ({ isOpen, onClose, iframeUrl, title = 'Content' }: { isOpen: boolean; onClose: () => void; iframeUrl: string; title?: string }) => {
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
};


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

// Add image quality configuration
const imageQualityConfig: Record<string, number> = {
  'about': 100, 'award-1': 100, 'award-2': 100, 'we-do-that': 100, 'book-now': 100,
  'true-beauty': 100, 'portfolio': 100, 'shop': 100, 'hair-studio': 100, 'academy': 100,
  'policies': 100, 'connect': 100, 'financing': 100, 'perm-makeup': 100,
  'perm-medical': 100, 'facial': 100, 'eyelash': 100
};

// Add priority configuration for above-the-fold images
const priorityImages = ['about', 'award-1', 'award-2', 'we-do-that', 'book-now'];

// --- Configuration Constants ---
const FACEBOOK_PAGE_URL = "https://www.facebook.com/splendidbeautybarandco";
const INSTAGRAM_PAGE_URL = "https://www.instagram.com/splendidbeautybar/";
const BOOKING_URL = "https://dashboard.boulevard.io/booking/businesses/18e96cd8-7ca6-4e7e-8282-2055f45efbc4/widget#/visit-type";
const YOUTUBE_VIDEO_ID = "DfVi23EdsxM";

// --- Error Boundary ---
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error('ErrorBoundary caught an error:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-red-100 p-4 text-center">
          <div className="rounded-lg bg-white p-8 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-red-700">Oops! Something went wrong.</h2>
            <p className="mb-4 text-gray-700">Please try refreshing the page.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left text-sm"><summary>Details</summary><pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 text-xs">{this.state.error.stack}</pre></details>
            )}
            <button onClick={() => window.location.reload()} className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Dynamic Imports ---
const VideoModal = dynamic(() => import('@/components/VideoModal'), {
  loading: () => <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 text-white backdrop-blur-sm">Loading Video Player...</div>,
});

const GoogleMaps = dynamic(() => import('@/components/google-maps'), {
  loading: () => <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">Loading Map...</div>,
});

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
  { id: 'hero', objectPosition: 'object-center' },
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
  { id: 'perm-makeup', objectPosition: 'object-center' },
  { id: 'perm-medical', objectPosition: 'object-center' },
  { id: 'facial', objectPosition: 'object-center' },
  { id: 'eyelash', objectPosition: 'object-center' },
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
  section: SectionData;
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

  // WARNING: These coordinates likely only work correctly on XL screens due to fixed height/width there.
  const [buttonPositions] = useState({
    bookAppointment: { x: 647, y: 619 },
    chatProfessional: { x: 1003, y: 621 },
    giftCertificate: { x: 819, y: 764 }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (id === 'shop' && sectionRef.current) {
      const videoElement = sectionRef.current.querySelector('video');
      if (videoElement) {
        const handleVideoEnd = () => setVideoCompleted(true);
        const handlePlay = () => setVideoCompleted(false);
        videoElement.addEventListener('ended', handleVideoEnd);
        videoElement.addEventListener('play', handlePlay);
        if (!videoElement.paused && !videoElement.ended) setVideoCompleted(false);
        else if (videoElement.ended) setVideoCompleted(true);
        return () => {
          videoElement.removeEventListener('ended', handleVideoEnd);
          videoElement.removeEventListener('play', handlePlay);
        }
      }
    }
  }, [id, isSectionInViewForPlayback]);


  if (content) {
    return <section ref={sectionRef} id={id} className="w-full my-4 sm:my-6 md:my-8">{content}</section>;
  }
  if (isSpacer) {
    return <div className={cn('w-full', heightClass || 'h-10 sm:h-16')} />;
  }

  const isHero = id === 'hero';
  const sectionConfig = getSectionConfig(id);
  const staticImageSrc = !sectionConfig ? loadedImages[id] : null;

  // Section container classes: Full width/aspect-video by default, constrained on XL+
  const sectionClasses = cn(
    'relative w-full overflow-hidden my-1 sm:my-4 lg:my-6', // Common margins
    isHero
      ? 'aspect-video md:h-[70vh] xl:h-screen xl:w-full' // Hero: aspect-video on small, 70vh on medium, full screen/width on xl
      : [ // Other sections:
        'aspect-video xl:h-[95vh]', // Handles height across breakpoints
        'xl:w-[95%] xl:mx-auto xl:rounded-lg xl:shadow-lg' // XL specific width, centering, and styling
      ]
  );

  // Sizes prop: 100vw up to XL, then 80vw
  const imageSizes = isHero
    ? '100vw'
    : '(max-width: 1279px) 100vw, 80vw';

  return (
    <motion.section
      ref={sectionRef}
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
            priority={isHero || priorityImages.includes(id)}
            isInView={isSectionInViewForPlayback}
          />
        ) : staticImageSrc ? (
          <Image
            src={staticImageSrc}
            alt={`${id} section background`}
            fill
            // Use object-cover by default (mobile, tablet), switch to contain only on XL screens
            className={cn(
              "w-full h-full object-cover", // Always object-cover
              objectPosition
            )}
            priority={isHero || priorityImages.includes(id)}
            sizes={imageSizes}
            quality={imageQualityConfig[id] || 100}
            loading={isHero || priorityImages.includes(id) ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
              `<svg width="${staticImageSrc.width}" height="${staticImageSrc.height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/></svg>`
            ).toString('base64')}`}
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center"><p>Loading content for {id}...</p></div>
        )}
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

      {/* Connect Overlay: Adjusted layout breakpoints to XL */}
      {overlay === 'connect' && (
        <motion.div
          // Position fixed bottom-right only on XL+
          className="absolute bottom-0 left-0 right-0 xl:bottom-4 xl:right-4 xl:left-auto z-20 p-2 xl:p-0"
          variants={overlayVariants}
          initial="initial"
          animate={isSectionInViewForAnimation ? "animate" : "initial"}
        >
          {/* Stack vertically by default, row layout only on XL+ */}
          <div className="flex flex-col xl:flex-row items-center xl:items-end gap-3 xl:gap-4 bg-black/40 xl:bg-transparent p-3 xl:p-0 rounded-lg xl:rounded-none">
            {/* Map container: Responsive width/height */}
            <div className="w-full max-w-full md:max-w-[360px] xl:max-w-[320px] lg:max-w-[360px] xl:w-[385px] h-[180px] md:h-[220px] xl:h-[240px] xl:h-[284px] order-2 xl:order-1">
              <div className="h-full w-full overflow-hidden rounded-lg bg-white/95 p-1.5 shadow-xl backdrop-blur-md border border-gray-200/50">
                <Suspense fallback={<div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-500 text-sm">Loading Map...</div>}>
                  <GoogleMaps />
                </Suspense>
              </div>
            </div>
            {/* Buttons/Social: Centered row by default, vertical column start-aligned on XL+ */}
            <div className="flex flex-row flex-wrap justify-center xl:flex-col items-center xl:items-start gap-2 md:gap-3 order-1 xl:order-2 w-full xl:w-auto">
              <div className="flex items-center justify-center gap-3">
                {[
                  { href: FACEBOOK_PAGE_URL, label: "Facebook", IconSvg: <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg> },
                  { href: INSTAGRAM_PAGE_URL, label: "Instagram", IconSvg: <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 6.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2Zm0 1.623c-2.403 0-2.729.01-3.686.053-.94.044-1.514.196-2.023.387-.597.217-1.03.494-1.462.926-.432.432-.71.865-.926 1.462-.191.51-.343 1.083-.387 2.023-.043.957-.053 1.283-.053 3.686s.01 2.729.053 3.686c.044.94.196 1.514.387 2.023.216.597.494 1.03.926 1.462.432.432.865.71 1.462.926.51.191 1.083.343 2.023.387.957.043 1.283.053 3.686.053s2.729-.01 3.686-.053c.94-.044 1.514-.196 2.023-.387.597-.216 1.03-.494 1.462-.926.432.432.71-.865.926-1.462.191-.51.343-1.083.387-2.023.043-.957.053-1.283.053-3.686s-.01-2.729-.053-3.686c-.044-.94-.196-1.514-.387-2.023-.216-.597-.494-1.03-.926-1.462-.432-.432-.865-.71-1.462-.926-.51-.191-1.083.343-2.023-.387-.957-.043-1.283-.053-3.686-.053Zm0 3.448a4.632 4.632 0 1 0 0 9.264 4.632 4.632 0 0 0 0-9.264Zm0 1.623a3.01 3.01 0 1 1 0 6.02 3.01 3.01 0 0 1 0-6.02Zm6.536-3.34a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" clipRule="evenodd" /></svg> }
                ].map(social => (
                  <a key={social.label} href={social.href} onClick={(e) => onSocialClick(e, social.href)} target="_blank" rel="noopener noreferrer" className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#063f48] transition-all hover:scale-105 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400" aria-label={social.label}>
                    {social.IconSvg}
                  </a>
                ))}
              </div>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto group relative flex items-center justify-center gap-2 rounded-full bg-[#063f48] px-4 py-2 md:px-6 md:py-3 text-white text-xs sm:text-sm font-medium transition-all hover:scale-105 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400">
                <span>BOOK NOW</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bookbutton Overlay - WARNING: Pixel coords only reliable on XL+ screens */}
      {overlay === 'bookbutton' && isClient && (
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
      )}

      {/* Hair Studio Contact Button - Removed fixed pixel positioning */}
      {id === 'hair-studio' && isClient && (
        <button
          onClick={onContactClick}
          className="contact-btn hidden xl:block absolute left-[78%] top-[83%] transform -translate-y-1/2 z-50 px-10 py-10 bg-white/90 backdrop-blur-sm text-[#063f48] text-lg font-bold rounded-full shadow-xl hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] cursor-pointer opacity-0"
          aria-label="Contact us for hair studio"
        >
          Contact Us
        </button>
      )}

      {/* Financing Button - Removed fixed pixel positioning */}
      {id === 'financing' && isClient && (
        <div className="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none hidden xl:flex"> {/* Show only on XL, example positioning */}
          <button
            onClick={() => window.open('https://pay.withcherry.com/splendidbeautybar?utm_source=finder&m=8955', '_blank')}
            className="px-8 py-4 bg-[#063f48] text-white text-lg font-semibold rounded-full shadow-lg hover:bg-[#05535e] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48] pointer-events-auto" // Example visible button style
            aria-label="Apply for Financing"
          >
            Apply for Financing
          </button>
        </div>
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
    const loadAllStaticImages = async () => {
      setImagesLoading(true);
      const imagePromises = Object.entries(staticImageImports).map(async ([id, importFn]) => {
        try {
          const module = await importFn();
          return { id, image: module.default };
        } catch (error) {
          console.error(`Failed to load image for section ${id}:`, error);
          return { id, image: null };
        }
      });
      const settledImages = await Promise.all(imagePromises);
      const newLoadedImages: Record<string, StaticImageData | null> = {};
      settledImages.forEach(result => {
        if (result) {
          newLoadedImages[result.id] = result.image;
        }
      });
      setLoadedImages(newLoadedImages);
      setImagesLoading(false);
    };
    loadAllStaticImages();
  }, []);

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

  if (imagesLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-t-[#063f48] border-r-[#063f48]/50 border-b-[#063f48]/50 border-l-[#063f48]/50 rounded-full"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div className="flex h-screen w-full items-center justify-center bg-red-100 text-red-700 p-4 text-center">
        An error occurred. Please refresh the page.
      </div>
    }>
      <div className="min-h-screen bg-[url('/images/elegant-gold-background.webp')] bg-cover bg-fixed bg-center">
        <Navbar scrolled={scrolled} />
        <main
          ref={mainRef}
          id="main-content"
          className="h-screen overflow-y-auto overflow-x-hidden scroll-smooth focus:outline-none"
          tabIndex={-1}
        >
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-xl text-gray-700">Loading Sections...</div>}>
            {heroSectionData && (
              <Section
                key={heroSectionData.id}
                section={heroSectionData}
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
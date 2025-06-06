import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard, { EventCardProps } from './EventCard';

interface EventCarouselProps {
  events: EventCardProps[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  onEventClick?: (event: EventCardProps) => void;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ 
  events,
  autoplay = true,
  autoplaySpeed = 7000, // Increased to 7 seconds for better readability
  onEventClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
      filter: 'blur(4px)'
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        x: { type: "spring", stiffness: 500, damping: 35 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
        rotateY: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
        filter: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      filter: 'blur(4px)',
      transition: {
        x: { type: "spring", stiffness: 500, damping: 35 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
        rotateY: { duration: 0.4 },
        filter: { duration: 0.2 }
      }
    })
  };

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  }, [events.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  }, [events.length]);

  useEffect(() => {
    if (!autoplay || isPaused) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, autoplaySpeed);
    
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, handleNext, isPaused]);
  
  // Handle window resize and initialize window width
  useEffect(() => {
    // Initialize window width for client-side rendering
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Get current visible event
  const currentEvent = events[currentIndex];

  const handleEventCardClick = () => {
    if (onEventClick && currentEvent) {
      onEventClick(currentEvent);
    }
  };

  return (
    <div 
      ref={carouselRef}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ perspective: '1200px' }}
    >
      {/* Premium background effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#063f48]/5 to-[#C09E6C]/5"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ backgroundSize: '200% 200%' }}
      />
      
      {/* Main carousel content */}
      <div className="w-full" style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentEvent.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
            onClick={handleEventCardClick}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <EventCard 
              {...currentEvent} 
              onClick={handleEventCardClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons */}
      <motion.button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#C09E6C]/90 hover:bg-[#C09E6C] transition-all z-10 shadow-lg backdrop-blur-sm"
        aria-label="Previous event"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 20px rgba(192, 158, 108, 0.5)',
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.svg 
          className="h-5 w-5 text-[#063f48]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          whileHover={{ x: -2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 19-7-7 7-7" />
        </motion.svg>
      </motion.button>
      <motion.button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#C09E6C]/90 hover:bg-[#C09E6C] transition-all z-10 shadow-lg backdrop-blur-sm"
        aria-label="Next event"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 20px rgba(192, 158, 108, 0.5)',
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.svg 
          className="h-5 w-5 text-[#063f48]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          whileHover={{ x: 2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
        </motion.svg>
      </motion.button>
      
      {/* Enhanced dot indicators */}
      <motion.div 
        className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {events.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#C09E6C]' 
                : 'bg-[#C09E6C]/50 hover:bg-[#C09E6C]/70'
            }`}
            aria-label={`Go to event ${index + 1}`}
            animate={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              scale: index === currentIndex ? 1 : 0.8,
            }}
            whileHover={{ 
              scale: index === currentIndex ? 1 : 1.2,
              boxShadow: '0 0 10px rgba(192, 158, 108, 0.5)',
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { delay: 0.5 + index * 0.1 },
              scale: { delay: 0.5 + index * 0.1 },
              width: { duration: 0.3 },
              height: { duration: 0.3 }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default EventCarousel;
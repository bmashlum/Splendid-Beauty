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
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
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
    >
      {/* Main carousel content */}
      <div className="w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentEvent.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
            onClick={handleEventCardClick}
          >
            <EventCard 
              {...currentEvent} 
              onClick={handleEventCardClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#C09E6C]/90 hover:bg-[#C09E6C] transition-colors z-10 shadow-lg"
        aria-label="Previous event"
      >
        <svg className="h-5 w-5 text-[#063f48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 19-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#C09E6C]/90 hover:bg-[#C09E6C] transition-colors z-10 shadow-lg"
        aria-label="Next event"
      >
        <svg className="h-5 w-5 text-[#063f48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
        </svg>
      </button>
      
      {/* Enhanced dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#C09E6C] w-6' 
                : 'bg-[#C09E6C]/50 hover:bg-[#C09E6C]/70'
            }`}
            aria-label={`Go to event ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;
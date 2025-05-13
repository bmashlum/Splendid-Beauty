import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  link: string;
  excerpt?: string; // Optional excerpt field for carousel display
  onClick?: () => void; // Handler for card clicks
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'; // Image positioning option
  objectFit?: 'cover' | 'contain'; // Object fit option
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  description,
  imageSrc,
  imageAlt,
  link,
  excerpt,
  onClick,
  imagePosition = 'center',
  objectFit = 'cover'
}) => {
  // Truncate description for carousel display
  const getExcerpt = () => {
    if (excerpt) return excerpt;
    return description.length > 140 
      ? description.slice(0, 140) + '…' 
      : description;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Get object position based on imagePosition prop
  const getObjectPosition = () => {
    switch (imagePosition) {
      case 'top': return 'top';
      case 'bottom': return 'bottom';
      case 'left': return 'left';
      case 'right': return 'right';
      case 'center':
      default: return 'center';
    }
  };

  return (
    <motion.div 
      onClick={handleClick}
      className="relative w-full cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Two-column layout for larger screens */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left column - Image (40% on desktop) */}
          <div className="relative w-full md:w-2/5 aspect-[4/3]">
            <Image 
              src={imageSrc} 
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
              style={{ 
                objectFit: objectFit,
                objectPosition: getObjectPosition()
              }}
            />
            
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/10"></div>
          </div>
          
          {/* Right column - Content (60% on desktop) */}
          <div className="w-full md:w-3/5 p-6 lg:p-10 flex flex-col justify-center bg-[#063f48]/95 backdrop-blur-sm">
            {/* Date pill */}
            <div className="mb-3">
              <span className="inline-block bg-[#C09E6C]/20 rounded-full px-3 py-1 text-sm font-medium text-[#C09E6C] uppercase tracking-wide">
                {date}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
              {title}
            </h3>
            
            {/* Excerpt with line clamp */}
            <p className="text-sm lg:text-base text-white/90 overflow-hidden text-ellipsis line-clamp-3 mb-6">
              {getExcerpt()}
            </p>
            
            {/* CTA Button */}
            <div>
              <motion.button
                className="inline-flex items-center bg-[#C09E6C] text-[#063f48] rounded-full px-6 py-3 text-sm font-medium hover:bg-[#C09E6C]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the card click handler
                  handleClick();
                }}
              >
                <span>Learn More</span>
                <svg className="h-4 w-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
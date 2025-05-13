import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Calendar, ExternalLink } from 'lucide-react';
import { EventCardProps } from '../EventCard';

interface EventDetailsModalProps {
  event: EventCardProps | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#063f48]/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl rounded-lg bg-white shadow-2xl border border-[#063f48]/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6 text-[#063f48]" />
              </button>
              
              {/* Modal content */}
              <div className="relative">
                {/* Image section */}
                <div className="relative h-64 lg:h-96 rounded-t-lg overflow-hidden">
                  <Image
                    src={event.imageSrc}
                    alt={event.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#063f48]/60" />
                </div>
                
                {/* Content section */}
                <div className="p-6 lg:p-10 bg-[#063f48]/95 backdrop-blur-sm">
                  {/* Date and title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-[#C09E6C]" />
                      <span className="text-[#C09E6C] font-medium">{event.date}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                      {event.title}
                    </h2>
                  </div>
                  
                  {/* Full description */}
                  <div className="space-y-4 mb-8">
                    {event.description.split('\r\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="text-base lg:text-lg text-white/90">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                  
                  {/* Link button */}
                  {event.link && event.link !== '#' && (
                    <motion.a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-[#C09E6C] text-[#063f48] rounded-full px-8 py-4 text-base font-medium hover:bg-[#C09E6C]/90 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View Event Details</span>
                      <ExternalLink className="h-5 w-5 ml-2" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;
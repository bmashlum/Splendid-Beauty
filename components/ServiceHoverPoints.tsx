'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { zIndex } from '@/lib/z-index';

interface HoverPoint {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  price?: string;
}

interface ServiceHoverPointsProps {
  serviceId: string;
  onBookingClick: () => void;
}

const serviceHoverPoints: Record<string, HoverPoint[]> = {
  'perm-makeup': [
    {
      id: 'microblading',
      x: 22,
      y: 6,
      title: 'Microblading',
      description: '• 1–3 years between touch-ups\n• Fluffy, hair-like strokes\n• Ideal for young, firm skin',
      price: ''
    },
    {
      id: 'nano-strokes',
      x: 48,
      y: 7,
      title: 'Nano Strokes',
      description: '• 2–5 years between touch-ups\n• Ultra-fine hair simulation\n• Great for dense, natural brows',
      price: ''
    },
    {
      id: 'powder-shading',
      x: 21,
      y: 44,
      title: 'Powder Brow Shading',
      description: '• 3–5 years between touch-ups\n• Soft-powder, defined finish\n• Covers old PMU & thin brows',
      price: ''
    },
    {
      id: 'combo-brows',
      x: 45,
      y: 67,
      title: 'Combo Brows',
      description: '• Microblade + powder mix\n• 1.5–3 years between touch-ups\n• Best of both worlds',
      price: ''
    },
    {
      id: 'lip-blush',
      x: 69,
      y: 6,
      title: 'Lip Blush',
      description: '• 3–5 years between touch-ups\n• Natural tint + line correction\n• Hyperpigmentation neutralized',
      price: ''
    },
    {
      id: 'lash-line',
      x: 69,
      y: 49,
      title: 'Lash Line Enhancement',
      description: '• 2–5 years between touch-ups\n• Eyeliner effect, no smudging\n• Complimentary eye colours',
      price: ''
    }
  ],
  'perm-medical': [
    {
      id: 'beauty-marks',
      x: 29,
      y: 12,
      title: 'Freckles & Beauty Marks',
      description: '• 1–3 years between touch-ups\n• Youthful "sun-kissed" spots\n• Subtle confidence boost',
      price: ''
    },
    {
      id: 'areola',
      x: 51,
      y: 4,
      title: 'Areola 3D Tattoo',
      description: '• 3–5 years between touch-ups\n• Post-surgery colour match\n• Restores natural contour',
      price: ''
    },
    {
      id: 'scar-revision',
      x: 74,
      y: 5,
      title: 'Inkless Scar Revision',
      description: '• 2–5 years between touch-ups\n• Vitamin-serum regeneration\n• Fades scars & stretch marks',
      price: ''
    },
    {
      id: 'scalp-micro',
      x: 69,
      y: 75,
      title: 'Scalp Micro-Pigmentation',
      description: '• 2–5 years between touch-ups\n• Simulates "buzzed" hair\n• Ideal for thinning areas',
      price: ''
    },
    {
      id: 'vitiligo',
      x: 94,
      y: 40,
      title: 'Vitiligo Repigmentation',
      description: '• 3–5 years between touch-ups\n• Blends lost pigment seamlessly\n• Restores natural skin tone',
      price: ''
    }
  ],
  'facial': [
    {
      id: 'signature-facial',
      x: 20,
      y: 5,
      title: 'Signature Facial',
      description: '• Personalized clinical-strength care\n• Deep cleanse & hydration\n• Ideal for first-timers',
      price: ''
    },
    {
      id: 'chemical-peels',
      x: 44,
      y: 57,
      title: 'Chemical Peels',
      description: '• Salicylic, lactic, glycolic & TCA\n• Targets acne, wrinkles & texture\n• 1–3 peels for lasting results',
      price: ''
    },
    {
      id: 'add-ons',
      x: 43,
      y: 5,
      title: 'Boost Your Facial',
      description: '• LED Light • Cryo • Microcurrent\n• Dermaplaning & High-Freq\n• Customize your glow',
      price: ''
    }
  ],
  'eyelash': [
    {
      id: 'lash-tint',
      x: 49,
      y: 10,
      title: 'Eyelash Lift & Tint',
      description: '• 6–10 weeks of lift + tint\n• Low-maintenance, mascara-free look\n• Safe perm + pigment',
      price: ''
    },
    {
      id: 'extensions',
      x: 70,
      y: 3,
      title: 'Light-Cured Lash Extensions',
      description: '• 3–5 weeks of length & volume\n• No daily mascara needed\n• Up to 50% longer hold',
      price: ''
    },
    {
      id: 'spray-tan',
      x: 97,
      y: 13,
      title: 'Norvell Hand Spray Tan',
      description: '• Flawless bronze, streak-free\n• Lasts 7–10 days\n• Custom shade to your skin',
      price: ''
    },
    {
      id: 'waxing',
      x: 71,
      y: 51,
      title: 'Full Body Waxing',
      description: '• 3–6 weeks hair-free skin\n• Fast, smooth results\n• Face, brows, legs & more',
      price: ''
    }
  ]
};

export default function ServiceHoverPoints({ serviceId, onBookingClick }: ServiceHoverPointsProps) {
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const points = serviceHoverPoints[serviceId] || [];

  const handleShowTooltip = (pointId: string) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setActivePoint(pointId);
  };

  const handleHideTooltip = () => {
    if (!isHoveringTooltip) {
      hideTimeoutRef.current = setTimeout(() => {
        setActivePoint(null);
      }, isTouchDevice ? 0 : 200); // Faster on touch devices
    }
  };

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {points.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute pointer-events-auto"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.5 + (index * 0.08),
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          <motion.button
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#063f48] touch-none"
            onMouseEnter={() => !isTouchDevice && handleShowTooltip(point.id)}
            onMouseLeave={() => !isTouchDevice && handleHideTooltip()}
            onClick={() => {
              if (isTouchDevice) {
                setActivePoint(activePoint === point.id ? null : point.id);
              } else {
                setActivePoint(activePoint === point.id ? null : point.id);
              }
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              setActivePoint(activePoint === point.id ? null : point.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#063f48] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#063f48]"></span>
            </span>
          </motion.button>

          <AnimatePresence>
            {activePoint === point.id && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                transition={{ 
                  duration: 0.15,
                  ease: "easeOut"
                }}
                className="absolute w-[calc(100vw-4rem)] max-w-[18rem] sm:w-72 pointer-events-auto"
                style={{
                  left: point.x > 50 ? 'auto' : '0',
                  right: point.x > 50 ? '0' : 'auto',
                  top: point.y > 50 ? 'auto' : '100%',
                  bottom: point.y > 50 ? '100%' : 'auto',
                  marginTop: point.y <= 50 ? '0.5rem' : 0,
                  marginBottom: point.y > 50 ? '0.5rem' : 0,
                  transform: point.x > 50 ? 'translateX(-100%)' : 'translateX(0)',
                  zIndex: zIndex.tooltip
                }}
                onMouseEnter={() => {
                  setIsHoveringTooltip(true);
                  if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current);
                    hideTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={() => {
                  setIsHoveringTooltip(false);
                  handleHideTooltip();
                }}
              >
                <div className="rounded-lg bg-white p-4 shadow-xl">
                  <h3 className="mb-3 text-lg font-bold text-[#063f48]">{point.title}</h3>
                  <div className="mb-4 text-sm text-gray-600 whitespace-pre-line">{point.description}</div>
                  <button
                    onClick={onBookingClick}
                    className="w-full flex items-center justify-center gap-1 rounded-full bg-[#063f48] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#05535e] focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
                  >
                    {point.id === 'add-ons' ? 'Select Add-ons' : 'Book Now'} <span className="text-base">→</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}
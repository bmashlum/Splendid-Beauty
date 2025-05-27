'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DraggablePoint {
  id: string;
  x: number;
  y: number;
  title: string;
}

interface DraggableHoverPointsProps {
  serviceId: string;
  imageUrl?: string;
}

const initialPoints: Record<string, DraggablePoint[]> = {
  'perm-makeup': [
    { id: 'microblading', x: 24, y: 6, title: 'Microblading' },
    { id: 'nano-strokes', x: 50, y: 7, title: 'Nano Strokes' },
    { id: 'powder-shading', x: 23, y: 44, title: 'Powder Brow Shading' },
    { id: 'combo-brows', x: 47, y: 67, title: 'Combo Brows' },
    { id: 'lip-blush', x: 71, y: 6, title: 'Lip Blush' },
    { id: 'lash-line', x: 71, y: 49, title: 'Lash Line Enhancement' }
  ],
  'perm-medical': [
    { id: 'beauty-marks', x: 31, y: 12, title: 'Freckles & Beauty Marks' },
    { id: 'areola', x: 53, y: 4, title: 'Areola 3D Tattoo' },
    { id: 'scar-revision', x: 76, y: 5, title: 'Inkless Scar Revision' },
    { id: 'scalp-micro', x: 71, y: 75, title: 'Scalp Micro-Pigmentation' },
    { id: 'vitiligo', x: 96, y: 40, title: 'Vitiligo Repigmentation' }
  ],
  'facial': [
    { id: 'signature-facial', x: 22, y: 5, title: 'Signature Facial' },
    { id: 'chemical-peels', x: 46, y: 57, title: 'Chemical Peels' },
    { id: 'add-ons', x: 45, y: 5, title: 'Boost Your Facial' }
  ],
  'eyelash': [
    { id: 'lash-tint', x: 51, y: 10, title: 'Eyelash Lift & Tint' },
    { id: 'extensions', x: 72, y: 3, title: 'Light-Cured Lash Extensions' },
    { id: 'spray-tan', x: 99, y: 13, title: 'Norvell Hand Spray Tan' },
    { id: 'waxing', x: 73, y: 51, title: 'Full Body Waxing' }
  ]
};

export default function DraggableHoverPoints({ serviceId, imageUrl }: DraggableHoverPointsProps) {
  const [points, setPoints] = useState<DraggablePoint[]>(initialPoints[serviceId] || []);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPoints(initialPoints[serviceId] || []);
  }, [serviceId]);

  useEffect(() => {
    // Generate output whenever points change
    const formattedPoints = points.map(p => 
      `{ id: '${p.id}', x: ${p.x.toFixed(0)}, y: ${p.y.toFixed(0)}, title: '${p.title}' }`
    ).join(',\n    ');
    
    setOutput(`'${serviceId}': [\n    ${formattedPoints}\n  ]`);
  }, [points, serviceId]);

  useEffect(() => {
    // Add global mouse event listeners
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!draggingId || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setPoints(prev => prev.map(p => 
        p.id === draggingId 
          ? { ...p, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
          : p
      ));
    };

    const handleGlobalMouseUp = () => {
      setDraggingId(null);
    };

    if (draggingId) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggingId]);

  const handleMouseDown = (e: React.MouseEvent, pointId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(pointId);
  };

  useEffect(() => {
    // Add global touch event listeners
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!draggingId || !containerRef.current) return;

      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;

      setPoints(prev => prev.map(p => 
        p.id === draggingId 
          ? { ...p, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
          : p
      ));
    };

    const handleGlobalTouchEnd = () => {
      setDraggingId(null);
    };

    if (draggingId) {
      document.addEventListener('touchmove', handleGlobalTouchMove);
      document.addEventListener('touchend', handleGlobalTouchEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [draggingId]);

  const handleTouchStart = (e: React.TouchEvent, pointId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(pointId);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Drag the points to position them for: {serviceId}</h2>
      
      <div 
        ref={containerRef}
        className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {points.map((point) => (
          <div
            key={point.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <motion.div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
                draggingId === point.id ? 'bg-blue-500' : 'bg-[#063f48]'
              } shadow-lg cursor-grab active:cursor-grabbing`}
              onMouseDown={(e) => handleMouseDown(e, point.id)}
              onTouchStart={(e) => handleTouchStart(e, point.id)}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: draggingId === point.id ? 1.2 : 1 }}
            >
              <span className="text-white text-xs font-bold select-none">{point.id.slice(0, 2).toUpperCase()}</span>
            </motion.div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              {point.title} ({point.x.toFixed(0)}%, {point.y.toFixed(0)}%)
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Copy this output:</h3>
        <pre className="bg-white p-3 rounded border border-gray-300 text-sm overflow-x-auto whitespace-pre select-all">
{output}
        </pre>
      </div>

      <div className="text-sm text-gray-600">
        <p>• Drag points to reposition them</p>
        <p>• Coordinates update in real-time</p>
        <p>• Copy the output and share the new positions</p>
      </div>
    </div>
  );
}
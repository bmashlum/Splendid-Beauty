'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const VideoModal = dynamic(() => import('@/components/VideoModal'), {
  loading: () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 text-white backdrop-blur-sm">
      <div className="animate-pulse">Loading Video Player...</div>
    </div>
  ),
  ssr: false
});

const YOUTUBE_VIDEO_ID = "DfVi23EdsxM";

export default function VideoTestPage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 15, y: 60 }); // percentage values
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setButtonPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Video Button Position Editor</h1>
        
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">
            Drag the video button to position it on the award image.
          </p>
          <p className="text-sm text-gray-500">
            Current position: X: {buttonPosition.x.toFixed(1)}%, Y: {buttonPosition.y.toFixed(1)}%
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div 
            ref={imageRef}
            className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-move"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Image
              src="/images/3.webp" // award-1 image
              alt="Award 1"
              fill
              className="object-cover"
              priority
            />
            
            {/* Video Button */}
            <motion.button
              onClick={() => !isDragging && setVideoOpen(true)}
              onMouseDown={handleMouseDown}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 h-[18%] w-[35%] max-h-[130px] max-w-[280px] ${
                isDragging ? 'cursor-grabbing' : 'cursor-pointer'
              } rounded-lg transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 border-2 border-dashed border-red-500 bg-red-500/20`}
              style={{
                left: `${buttonPosition.x}%`,
                top: `${buttonPosition.y}%`,
              }}
              aria-label="Watch announcement video"
              animate={{ scale: isDragging ? 0.95 : 1 }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <svg 
                  className="w-12 h-12 text-white mb-2" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span className="text-white font-semibold">Play Video</span>
              </div>
            </motion.button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">How to use:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click and drag the red video button to position it where you want</li>
            <li>The button position is shown as percentage values above</li>
            <li>Once you find the right position, update the code with these values</li>
            <li>Click the button (when not dragging) to test the video modal</li>
          </ol>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="font-semibold mb-2">Code to update in main page:</h3>
            <code className="block whitespace-pre text-sm">
{`onClick={onVideoClick}
className="absolute left-[${buttonPosition.x.toFixed(1)}%] top-[${buttonPosition.y.toFixed(1)}%] transform -translate-x-1/2 -translate-y-1/2 h-[18%] w-[35%] max-h-[130px] max-w-[280px] cursor-pointer rounded-lg transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"`}
            </code>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <VideoModal 
          isOpen={videoOpen} 
          onClose={() => setVideoOpen(false)} 
          videoId={YOUTUBE_VIDEO_ID} 
        />
      )}
    </div>
  );
}
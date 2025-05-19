import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// Remove unused Head import for better performance
import dynamic from 'next/dynamic';

interface AnimatedImageProps {
    imagePath: string;
    videoPath: string;
    alt: string;
    sizes?: string;
    objectPosition?: string;
    priority?: boolean;
    isInView?: boolean;
    imageOnly?: boolean; // Only load image, skip video for critical LCP elements
}

export default function AnimatedImage({
    imagePath,
    videoPath,
    alt,
    // Default sizes: 100vw up to 1279px, then 80vw for larger screens
    sizes = "(max-width: 1279px) 100vw, 80vw",
    objectPosition = 'object-center',
    priority = false,
    isInView = false,
    imageOnly = false,
}: AnimatedImageProps) {
    // Determine if we should use object-contain on XL screens
    const shouldUseContainXL = objectPosition.includes('xl:object-contain');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasVideoEnded, setHasVideoEnded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isVideoSupported, setIsVideoSupported] = useState(false);
    const [isVideoTagReady, setIsVideoTagReady] = useState(false);
    const [canVideoActuallyPlay, setCanVideoActuallyPlay] = useState(false);
    const [isVideoFading, setIsVideoFading] = useState(false);

    useEffect(() => {
        // Check if window exists (client-side only)
        if (typeof window !== 'undefined') {
            // Check if user prefers reduced motion
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (prefersReducedMotion) {
                // Skip video for users who prefer reduced motion
                setIsVideoSupported(false);
                return;
            }
            
            // Check device capabilities
            const video = document.createElement('video');
            const isVideoTypeSupported = !!(video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') || video.canPlayType('video/mp4'));
            
            // Check if device is iOS (iPhone, iPad)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            
            // Check if on mobile network
            const connection = (navigator as any).connection;
            const isSaveData = connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g');
            
            // Only support video on desktop and non-iOS devices that aren't in save-data mode
            setIsVideoSupported(isVideoTypeSupported && !isIOS && !isSaveData);
        }
    }, []);

    const attemptPlayVideo = useCallback(async () => {
        if (videoRef.current && !videoError) {
            try {
                videoRef.current.currentTime = 0;
                // Try to play and catch any autoplay restrictions
                const playPromise = videoRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Autoplay started successfully
                        setIsVideoLoaded(true);
                        setHasVideoEnded(false);
                        setIsVideoFading(false);
                    }).catch(error => {
                        // Autoplay was prevented
                        console.warn('Video autoplay prevented:', error);
                        
                        // On mobile, instead of marking as error, just consider it ended
                        // This will fall back to the static image without error state
                        setHasVideoEnded(true);
                        
                        // Don't set video error, which would prevent future attempts
                        // setVideoError(true);
                        // setCanVideoActuallyPlay(false);
                    });
                }
            } catch (error) {
                console.warn('Video play attempt failed:', error);
                // Same fallback as above
                setHasVideoEnded(true);
            }
        }
    }, [videoError]);

    useEffect(() => {
        if (isInView && isVideoTagReady && canVideoActuallyPlay && !hasVideoEnded && isVideoSupported && !videoError) {
            attemptPlayVideo();
        } else if (!isInView && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    }, [isInView, isVideoTagReady, canVideoActuallyPlay, hasVideoEnded, attemptPlayVideo, isVideoSupported, videoError]);

    const showVideoLayer = isVideoSupported && !videoError && canVideoActuallyPlay && !hasVideoEnded;
    const isFadingVideo = isVideoSupported && !videoError && isVideoFading;

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Remove inline styles from Head for better performance */}
            {/* Static Image Layer */}
            <div className="absolute inset-0">
                <Image
                    src={imagePath}
                    alt={alt}
                    className={cn(
                        "w-full h-full object-cover",
                        shouldUseContainXL ? "xl:object-contain" : "",
                        // Only use positioning part from objectPosition
                        objectPosition.includes("object-center") ? "object-center" : "",
                        objectPosition.includes("object-bottom") ? "object-bottom" : "",
                        objectPosition.includes("object-top") ? "object-top" : "",
                        objectPosition.includes("object-left") ? "object-left" : "",
                        objectPosition.includes("object-right") ? "object-right" : "",
                        objectPosition.includes("xl:object-center") ? "xl:object-center" : ""
                    )}
                    fill
                    priority={priority}
                    sizes={sizes}
                    quality={80}
                    loading={priority ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                        `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/></svg>`
                    ).toString('base64')}`}
                    style={{
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                    }}
                />
            </div>

            {/* Video Layer - Skip for image-only mode */}
            {isVideoSupported && !imageOnly && (
                <motion.video
                    ref={videoRef}
                    className={cn(
                        "absolute inset-0 h-full w-full object-cover",
                        shouldUseContainXL ? "xl:object-contain" : "",
                        // Only use positioning part from objectPosition
                        objectPosition.includes("object-center") ? "object-center" : "",
                        objectPosition.includes("object-bottom") ? "object-bottom" : "",
                        objectPosition.includes("object-top") ? "object-top" : "",
                        objectPosition.includes("object-left") ? "object-left" : "",
                        objectPosition.includes("object-right") ? "object-right" : "",
                        objectPosition.includes("xl:object-center") ? "xl:object-center" : ""
                    )}
                    playsInline
                    muted
                    autoPlay={false} /* Disable autoplay - we control this via isInView */
                    loop={false}
                    preload="metadata" /* Only preload metadata for better performance */
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (showVideoLayer || isFadingVideo) ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    onLoadedMetadata={() => { /* Use lighter onLoadedMetadata instead of onLoadedData */
                        setIsVideoTagReady(true);
                        if (videoRef.current?.play) {
                            setCanVideoActuallyPlay(true);
                        } else {
                            console.warn("Video element missing play function");
                            setCanVideoActuallyPlay(false);
                            setVideoError(true);
                        }
                    }}
                    onCanPlay={() => {
                        if (!canVideoActuallyPlay) {
                            setCanVideoActuallyPlay(true);
                        }
                    }}
                    onEnded={() => {
                        setHasVideoEnded(true);
                        setIsVideoFading(true);
                        setTimeout(() => {
                            setIsVideoFading(false);
                        }, 500);
                    }}
                    onError={(e) => {
                        console.error(`Video error: ${videoPath}`, e);
                        setVideoError(true);
                        setCanVideoActuallyPlay(false);
                        setIsVideoFading(false);
                    }}
                    src={isInView ? videoPath.replace('/images/', '/images/optimized/').replace('.mp4', '_optimized.mp4') : ''} /* Only set src when in view */
                    poster={imagePath} /* Use the static image as a fallback poster */
                >
                    Your browser does not support the video tag.
                </motion.video>
            )}
        </div>
    );
}
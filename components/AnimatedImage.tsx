import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Global Set to track which videos have already been played
const playedVideos = new Set<string>();

interface AnimatedImageProps {
    imagePath: string;
    videoPath: string;
    alt: string;
    sizes?: string;
    objectPosition?: string;
    priority?: boolean;
    isInView?: boolean;
    onVideoEnded?: () => void;
}

const AnimatedImage = memo(function AnimatedImage({
    imagePath,
    videoPath,
    alt,
    // Default sizes: 100vw up to 1279px, then 80vw for larger screens
    sizes = "(max-width: 1279px) 100vw, 80vw",
    objectPosition = 'object-center',
    priority = false,
    isInView = false,
    onVideoEnded,
}: AnimatedImageProps) {
    // Determine if we should use object-contain on XL screens
    const shouldUseContainXL = objectPosition.includes('xl:object-contain');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [, setIsVideoLoaded] = useState(false);
    const [hasVideoEnded, setHasVideoEnded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isVideoSupported, setIsVideoSupported] = useState(true);
    const [isVideoTagReady, setIsVideoTagReady] = useState(false);
    const [canVideoActuallyPlay, setCanVideoActuallyPlay] = useState(false);
    const [isVideoFading, setIsVideoFading] = useState(false);
    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const [hasVideoPlayedOnce, setHasVideoPlayedOnce] = useState(false);
    const playAttemptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const video = document.createElement('video');
            const isVideoTypeSupported = !!(video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') || video.canPlayType('video/mp4'));
            
            // Check for low power mode or reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Set support based on video type support and user preferences
            setIsVideoSupported(isVideoTypeSupported && !prefersReducedMotion);
            
            // Check if this video has already been played
            if (playedVideos.has(videoPath)) {
                setHasVideoPlayedOnce(true);
                setHasVideoEnded(true);
            }
        }
        
        // Cleanup timeout on unmount
        return () => {
            if (playAttemptTimeoutRef.current) {
                clearTimeout(playAttemptTimeoutRef.current);
            }
        };
    }, [videoPath]);

    const attemptPlayVideo = useCallback(async () => {
        // Debounce play attempts to prevent multiple simultaneous calls
        if (playAttemptTimeoutRef.current) {
            clearTimeout(playAttemptTimeoutRef.current);
        }
        
        playAttemptTimeoutRef.current = setTimeout(async () => {
            if (videoRef.current && !videoError && !hasVideoEnded && !hasVideoPlayedOnce) {
            try {
                // Only reset to beginning if video hasn't started playing yet or has ended
                if (videoRef.current.currentTime === 0 || videoRef.current.ended) {
                    videoRef.current.currentTime = 0;
                }
                
                // Try to play and catch any autoplay restrictions
                const playPromise = videoRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Autoplay started successfully
                        setIsVideoLoaded(true);
                        setHasVideoEnded(false);
                        setIsVideoFading(false);
                        setIsVideoPaused(false);
                    }).catch(error => {
                        // Autoplay was prevented
                        console.warn('Video autoplay prevented:', error);
                        
                        // On mobile, instead of marking as error, just consider it ended
                        // This will fall back to the static image without error state
                        setHasVideoEnded(true);
                        
                        // Also trigger the onVideoEnded callback for autoplay prevention
                        if (onVideoEnded) {
                            onVideoEnded();
                        }
                        
                        // Don't set video error, which would prevent future attempts
                        // setVideoError(true);
                        // setCanVideoActuallyPlay(false);
                    });
                }
            } catch (error) {
                console.warn('Video play attempt failed:', error);
                // Same fallback as above
                setHasVideoEnded(true);
                
                // Also trigger the onVideoEnded callback
                if (onVideoEnded) {
                    onVideoEnded();
                }
            }
        }
        }, 50); // Small debounce delay
    }, [videoError, hasVideoEnded, hasVideoPlayedOnce, onVideoEnded]);

    useEffect(() => {
        if (isInView && isVideoTagReady && canVideoActuallyPlay && !hasVideoEnded && isVideoSupported && !videoError && !hasVideoPlayedOnce) {
            // Resume if paused, otherwise attempt to play
            if (isVideoPaused && videoRef.current) {
                videoRef.current.play().then(() => {
                    setIsVideoPaused(false);
                }).catch(() => {
                    // If resume fails, try from the beginning
                    attemptPlayVideo();
                });
            } else {
                attemptPlayVideo();
            }
        } else if (!isInView && videoRef.current && !videoRef.current.paused && !hasVideoEnded) {
            // Only pause if video is still playing and hasn't ended
            videoRef.current.pause();
            setIsVideoPaused(true);
        }
    }, [isInView, isVideoTagReady, canVideoActuallyPlay, hasVideoEnded, attemptPlayVideo, isVideoSupported, videoError, isVideoPaused, hasVideoPlayedOnce]);

    const showVideoLayer = isVideoSupported && !videoError && canVideoActuallyPlay && !hasVideoEnded;
    const isFadingVideo = isVideoSupported && !videoError && isVideoFading;

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Note: xl-object-contain class is defined in global styles */}
            {/* Static Image Layer */}
            <div className="absolute inset-0">
                <Image
                    src={imagePath}
                    alt={alt}
                    className={cn(
                        "w-full h-full object-cover",
                        shouldUseContainXL ? "xl-object-contain" : "",
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
                    quality={95}
                    loading={priority ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4="
                    style={{
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                    }}
                />
            </div>

            {/* Video Layer */}
            {isVideoSupported && (
                <motion.video
                    ref={videoRef}
                    className={cn(
                        "absolute inset-0 h-full w-full object-cover",
                        shouldUseContainXL ? "xl-object-contain" : "",
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
                    autoPlay
                    loop={false}
                    preload="auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (showVideoLayer || isFadingVideo) ? 1 : 0 }}
                    transition={{ 
                        duration: 0.3,
                        ease: "easeInOut"
                    }}
                    onLoadedData={() => {
                        setIsVideoTagReady(true);
                        if (videoRef.current?.play) {
                            setCanVideoActuallyPlay(true);
                        } else {
                            console.warn("Video element missing play function onLoadedData");
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
                        setHasVideoPlayedOnce(true);
                        
                        // Add this video to the global played videos set
                        playedVideos.add(videoPath);
                        
                        setTimeout(() => {
                            setIsVideoFading(false);
                        }, 300);
                        // Call the callback if provided
                        if (onVideoEnded) {
                            onVideoEnded();
                        }
                    }}
                    onError={(e) => {
                        console.error(`Video error: ${videoPath}`, e);
                        setVideoError(true);
                        setCanVideoActuallyPlay(false);
                        setIsVideoFading(false);
                    }}
                    onStalled={() => {
                        console.warn(`Video stalled: ${videoPath}`);
                        // Don't immediately fail, browser might recover
                    }}
                    onWaiting={() => {
                        console.warn(`Video buffering: ${videoPath}`);
                        // Video is buffering, this is normal
                    }}
                    src={videoPath.replace('/images/', '/images/optimized/').replace('.mp4', '_optimized.mp4')}
                    crossOrigin="anonymous"
                    poster={imagePath} // Use the static image as a fallback poster
                >
                    Your browser does not support the video tag.
                </motion.video>
            )}
        </div>
    );
});

AnimatedImage.displayName = 'AnimatedImage';

export default AnimatedImage;
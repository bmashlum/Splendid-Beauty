import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    const [isBuffering, setIsBuffering] = useState(false);
    const bufferCheckInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const video = document.createElement('video');
            const isVideoTypeSupported = !!(video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') || video.canPlayType('video/mp4'));
            
            // Check for low power mode or reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Check connection speed
            const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
            const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
            
            // Set support based on video type support, user preferences, and connection
            setIsVideoSupported(isVideoTypeSupported && !prefersReducedMotion && !isSlowConnection);
        }
    }, []);

    // Monitor buffering state
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isVideoSupported) return;

        const checkBuffering = () => {
            if (video.readyState < 3) {
                setIsBuffering(true);
            } else {
                setIsBuffering(false);
            }
        };

        const handleWaiting = () => setIsBuffering(true);
        const handlePlaying = () => setIsBuffering(false);
        const handleCanPlay = () => setIsBuffering(false);

        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('canplay', handleCanPlay);

        // Check buffering state periodically
        bufferCheckInterval.current = setInterval(checkBuffering, 500);

        return () => {
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('canplay', handleCanPlay);
            if (bufferCheckInterval.current) {
                clearInterval(bufferCheckInterval.current);
            }
        };
    }, [isVideoSupported, isVideoTagReady]);

    const attemptPlayVideo = useCallback(async () => {
        if (videoRef.current && !videoError && !isBuffering) {
            try {
                // Ensure video is ready to play
                if (videoRef.current.readyState >= 3) {
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
                            
                            // Also trigger the onVideoEnded callback for autoplay prevention
                            if (onVideoEnded) {
                                onVideoEnded();
                            }
                        });
                    }
                } else {
                    // Video not ready, retry after a short delay
                    setTimeout(() => attemptPlayVideo(), 100);
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
    }, [videoError, isBuffering, onVideoEnded]);

    useEffect(() => {
        if (isInView && isVideoTagReady && canVideoActuallyPlay && !hasVideoEnded && isVideoSupported && !videoError && !isBuffering) {
            attemptPlayVideo();
        } else if (!isInView && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    }, [isInView, isVideoTagReady, canVideoActuallyPlay, hasVideoEnded, attemptPlayVideo, isVideoSupported, videoError, isBuffering]);

    const showVideoLayer = isVideoSupported && !videoError && canVideoActuallyPlay && !hasVideoEnded && !isBuffering;
    const isFadingVideo = isVideoSupported && !videoError && isVideoFading;

    // Preload strategy based on priority and viewport
    const getPreloadStrategy = () => {
        if (priority) return "auto";
        if (isInView) return "metadata";
        return "none";
    };

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
                    autoPlay={false} // Disable autoplay attribute, handle manually
                    loop={false}
                    preload={getPreloadStrategy()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (showVideoLayer || isFadingVideo) ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    onLoadedMetadata={() => {
                        setIsVideoTagReady(true);
                        if (videoRef.current?.play) {
                            setCanVideoActuallyPlay(true);
                        } else {
                            console.warn("Video element missing play function onLoadedMetadata");
                            setCanVideoActuallyPlay(false);
                            setVideoError(true);
                        }
                    }}
                    onCanPlayThrough={() => {
                        if (!canVideoActuallyPlay) {
                            setCanVideoActuallyPlay(true);
                        }
                        setIsBuffering(false);
                    }}
                    onEnded={() => {
                        setHasVideoEnded(true);
                        setIsVideoFading(true);
                        setTimeout(() => {
                            setIsVideoFading(false);
                        }, 500);
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
                        setIsBuffering(true);
                    }}
                    crossOrigin="anonymous"
                    poster={imagePath} // Use the static image as a fallback poster
                >
                    {/* Provide multiple sources for better browser support */}
                    <source 
                        src={videoPath.replace('/images/', '/images/optimized/').replace('.mp4', '_optimized.webm')} 
                        type="video/webm"
                    />
                    <source 
                        src={videoPath.replace('/images/', '/images/optimized/').replace('.mp4', '_optimized.mp4')} 
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </motion.video>
            )}

            {/* Buffering indicator (optional - can be styled/positioned as needed) */}
            {isBuffering && isVideoSupported && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
});

AnimatedImage.displayName = 'AnimatedImage';

export default AnimatedImage;
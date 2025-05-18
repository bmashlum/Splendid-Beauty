import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Head from 'next/head';

interface AnimatedImageProps {
    imagePath: string;
    videoPath: string;
    alt: string;
    sizes?: string;
    objectPosition?: string;
    priority?: boolean;
    isInView?: boolean;
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
}: AnimatedImageProps) {
    // Determine if we should use object-contain on XL screens
    const shouldUseContainXL = objectPosition.includes('xl:object-contain');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasVideoEnded, setHasVideoEnded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isVideoSupported, setIsVideoSupported] = useState(true);
    const [isVideoTagReady, setIsVideoTagReady] = useState(false);
    const [canVideoActuallyPlay, setCanVideoActuallyPlay] = useState(false);
    const [isVideoFading, setIsVideoFading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const video = document.createElement('video');
            setIsVideoSupported(!!(video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') || video.canPlayType('video/mp4')));
        }
    }, []);

    const attemptPlayVideo = useCallback(async () => {
        if (videoRef.current && !videoError) {
            try {
                videoRef.current.currentTime = 0;
                await videoRef.current.play();
                setIsVideoLoaded(true);
                setHasVideoEnded(false);
                setIsVideoFading(false);
            } catch (error) {
                console.warn('Video autoplay/play failed:', error);
                setVideoError(true);
                setCanVideoActuallyPlay(false);
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
            {shouldUseContainXL && (
                <Head>
                    <style>{`
                        @media (min-width: 1280px) {
                            .xl-object-contain {
                                object-fit: contain !important;
                            }
                        }
                    `}</style>
                </Head>
            )}
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
                    quality={100}
                    unoptimized={true}
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
                    loop={false}
                    preload="auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (showVideoLayer || isFadingVideo) ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
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
                    src={videoPath.replace('/images/', '/images/optimized/').replace('.mp4', '_optimized.mp4')}
                >
                    Your browser does not support the video tag.
                </motion.video>
            )}
        </div>
    );
}
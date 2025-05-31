import { useEffect, useRef } from 'react';

interface VideoPreloaderProps {
    videoPaths: string[];
    priority?: 'high' | 'low' | 'auto';
}

export function VideoPreloader({ videoPaths, priority = 'auto' }: VideoPreloaderProps) {
    const preloadedVideos = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if user has data saver enabled or slow connection
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
            return;
        }

        const preloadVideo = (src: string) => {
            if (preloadedVideos.current.has(src)) return;

            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = src;
            
            // Set fetch priority based on prop
            if (priority !== 'auto' && 'fetchPriority' in link) {
                (link as any).fetchPriority = priority;
            }

            document.head.appendChild(link);
            preloadedVideos.current.add(src);

            // Also create a video element to start buffering
            const video = document.createElement('video');
            video.src = src;
            video.preload = 'metadata';
            video.muted = true;
            
            // Start loading the video
            video.load();
            
            // Clean up after a timeout to prevent memory leaks
            setTimeout(() => {
                video.src = '';
                video.load();
            }, 30000); // 30 seconds
        };

        // Preload videos with staggered timing to avoid bandwidth congestion
        videoPaths.forEach((path, index) => {
            setTimeout(() => {
                preloadVideo(path);
            }, index * 1000); // 1 second delay between each video
        });

        return () => {
            // Cleanup is handled by the browser
        };
    }, [videoPaths, priority]);

    return null;
}

// Hook to preload videos for the next section
export function useVideoPreloader() {
    const preload = (videoPaths: string[], priority?: 'high' | 'low' | 'auto') => {
        if (typeof window === 'undefined') return;

        videoPaths.forEach(path => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = path;
            
            if (priority && priority !== 'auto' && 'fetchPriority' in link) {
                (link as any).fetchPriority = priority;
            }

            document.head.appendChild(link);
        });
    };

    return { preload };
}
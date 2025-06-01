import { useEffect, useRef } from 'react';

export const useSmoothScroll = () => {
  const scrollVelocity = useRef(0);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const rafId = useRef<number>(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    // Only apply smooth scrolling for non-touch devices
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch) return;

    // Constants for smooth scrolling
    const SMOOTHING_FACTOR = 0.12; // Lower = smoother, higher = more responsive
    const MIN_DELTA = 0.5; // Minimum scroll delta to continue animation

    const smoothScroll = () => {
      const delta = targetScroll.current - currentScroll.current;
      
      if (Math.abs(delta) > MIN_DELTA) {
        currentScroll.current += delta * SMOOTHING_FACTOR;
        window.scrollTo(0, currentScroll.current);
        rafId.current = requestAnimationFrame(smoothScroll);
      } else {
        currentScroll.current = targetScroll.current;
        window.scrollTo(0, targetScroll.current);
        isScrolling.current = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Calculate scroll amount with acceleration
      const scrollAmount = e.deltaY * 0.8; // Adjust multiplier for sensitivity
      
      targetScroll.current = Math.max(
        0,
        Math.min(
          targetScroll.current + scrollAmount,
          document.documentElement.scrollHeight - window.innerHeight
        )
      );

      if (!isScrolling.current) {
        isScrolling.current = true;
        currentScroll.current = window.scrollY;
        rafId.current = requestAnimationFrame(smoothScroll);
      }
    };

    // Add passive: false to prevent default behavior
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);
};
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    // Function to scroll to hash
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1); // Remove the #
        const element = document.getElementById(id);
        if (element) {
          // Wait a bit for the page to fully render
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    // Check on initial load
    scrollToHash();

    // Also check when hash changes
    const handleHashChange = () => {
      scrollToHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  return null;
}
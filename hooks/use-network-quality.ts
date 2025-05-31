import { useEffect, useState } from 'react';

type NetworkQuality = 'high' | 'medium' | 'low' | 'unknown';

export function useNetworkQuality(): NetworkQuality {
  const [quality, setQuality] = useState<NetworkQuality>('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (!connection) {
      setQuality('high'); // Assume high quality if API not available
      return;
    }

    const updateNetworkQuality = () => {
      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;
      const saveData = connection.saveData;

      if (saveData) {
        setQuality('low');
      } else if (effectiveType === '4g' && downlink > 10) {
        setQuality('high');
      } else if (effectiveType === '4g' || effectiveType === '3g') {
        setQuality('medium');
      } else {
        setQuality('low');
      }
    };

    updateNetworkQuality();
    connection.addEventListener('change', updateNetworkQuality);

    return () => {
      connection.removeEventListener('change', updateNetworkQuality);
    };
  }, []);

  return quality;
}
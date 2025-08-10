'use client';

import { useState, useEffect } from 'react';

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set hydrated immediately after mount
    setIsHydrated(true);
    
    // Fallback timeout in case something goes wrong
    const timeout = setTimeout(() => {
      setIsHydrated(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return isHydrated;
} 
'use client';

import { useState, useEffect } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkSize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
        setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  const getFontSize = (mobileSize: number, desktopSize: number) => {
    return isMobile ? mobileSize : desktopSize;
  };

  const getRotation = (mobileRotation: number, desktopRotation: number) => {
    return isMobile ? mobileRotation : desktopRotation;
  };

  return {
    isMobile,
    isTablet,
    getFontSize,
    getRotation
  };
}
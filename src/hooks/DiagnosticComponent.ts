'use client'
import { useEffect } from 'react';

const DiagnosticComponent = () => {
  useEffect(() => {
    console.log('Diagnostic Information:');
    console.log('User Agent:', navigator.userAgent);
    console.log('localStorage:', { ...localStorage });
    console.log('sessionStorage:', { ...sessionStorage });
    console.log('Cookies:', document.cookie);
    console.log('Current URL:', window.location.href);
    console.log('Referrer:', document.referrer);
    console.log('Screen Size:', `${window.screen.width}x${window.screen.height}`);
    console.log('Color Depth:', window.screen.colorDepth);
    console.log('Device Pixel Ratio:', window.devicePixelRatio);
    console.log('Hardware Concurrency:', navigator.hardwareConcurrency);
    const connection = (navigator as Navigator & { connection?: { effectiveType: string } }).connection;
    console.log('Network Type:', connection ? connection.effectiveType : 'Unknown');
  }, []);

  return null; // This component doesn't render anything
};

export default DiagnosticComponent;
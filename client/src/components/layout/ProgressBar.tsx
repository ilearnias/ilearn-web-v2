import { useState, useEffect } from 'react';
import { calculateScrollPercent } from '@/lib/utils';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setProgress(calculateScrollPercent());
    };
    
    // Initial calculation
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div 
      className="h-1 bg-primary-red fixed top-0 left-0 z-[9999] transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

export default ProgressBar;

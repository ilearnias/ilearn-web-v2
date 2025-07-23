import { useState, useEffect } from 'react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onPrev, 
  onNext 
}: LightboxProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  // Handle image loading
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white text-3xl hover:text-primary-red transition-colors"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        &times;
      </button>
      
      <button 
        className="absolute left-4 text-white text-4xl hover:text-primary-red transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
      >
        <i className="ri-arrow-left-s-line"></i>
      </button>
      
      <button 
        className="absolute right-4 text-white text-4xl hover:text-primary-red transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
      >
        <i className="ri-arrow-right-s-line"></i>
      </button>
      
      <div 
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img 
          src={images[currentIndex]} 
          alt="Full size view"
          className="max-w-[90%] max-h-[90vh] mx-auto"
          onLoad={() => setIsLoading(false)}
        />
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;

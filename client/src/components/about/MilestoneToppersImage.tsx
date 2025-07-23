import React from 'react';

// Import the image directly - this is the key to making it work with Vite
import toppersImage from '../../assets/toppers.jpg';

const MilestoneToppersImage: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Image Container */}
      <div className="w-full h-full">
        <img 
          src={toppersImage} 
          alt="iLearn Kerala Rank Holders" 
          className="w-full h-full object-contain"
          // Debug borders to check if image is loading but not displaying
          style={{ border: '2px solid red' }}
        />
      </div>
      
      {/* Overlay Title */}
      <div className="absolute top-0 left-0 right-0 bg-primary-red/90 text-white py-2 px-3 text-center font-medium">
        Kerala Top Rank Holders - UPSC CSE 2024
      </div>
    </div>
  );
};

export default MilestoneToppersImage;
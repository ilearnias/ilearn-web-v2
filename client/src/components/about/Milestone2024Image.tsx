import React from 'react';

// Import the 2023 results image for 2024 milestone
import resultsImage from '@assets/Screenshot_20250521_115928_Drive.jpg';

const Milestone2024Image: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Image Container */}
      <div className="w-full h-full">
        <img 
          src={resultsImage} 
          alt="Civil Services Examination 2023 Results - 12 from PCM Program" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Overlay Title */}
      <div className="absolute top-0 left-0 right-0 bg-primary-red/90 text-white py-2 px-3 text-center font-medium">
        Civil Services Examination 2023 Results - 12 Selections from PCM Program
      </div>
    </div>
  );
};

export default Milestone2024Image;
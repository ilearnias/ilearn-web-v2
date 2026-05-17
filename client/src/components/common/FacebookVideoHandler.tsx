import React from 'react';
import { ExternalLink, Play, Facebook } from 'lucide-react';

interface FacebookVideoHandlerProps {
  url: string;
  title?: string;
  className?: string;
  openInNewTab?: boolean;
}

const FacebookVideoHandler: React.FC<FacebookVideoHandlerProps> = ({
  url,
  title = "Facebook Video",
  className = "",
  openInNewTab = false
}) => {
  const handleOpenFacebook = () => {
    if (openInNewTab) {
      // Open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Redirect in same tab
      window.location.href = url;
    }
  };

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg ${className}`} style={{ minHeight: '300px' }}>
      <div className="text-center p-8 max-w-md">
        {/* Facebook Icon */}
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Facebook className="w-10 h-10 text-white" />
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
          This content is hosted on Facebook. Click below to view it on Facebook.
        </p>
        
        {/* Action Button */}
        <button
          onClick={handleOpenFacebook}
          className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Play className="w-6 h-6" />
          <span>{openInNewTab ? 'Open on Facebook' : 'Go to Facebook'}</span>
          <ExternalLink className="w-5 h-5" />
        </button>
        
        {/* Additional Info */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> {openInNewTab ? 'This will open Facebook in a new tab.' : 'You\'ll be redirected to Facebook to view this content.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacebookVideoHandler; 
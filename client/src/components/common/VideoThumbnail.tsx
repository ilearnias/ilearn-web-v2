import React from 'react';

interface VideoThumbnailProps {
  url: string;
  alt?: string;
  className?: string;
  fallbackImage?: string;
}

interface VideoPlatform {
  name: string;
  pattern: RegExp;
  thumbnailUrl: (url: string) => string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ 
  url, 
  alt = "Video thumbnail", 
  className = "",
  fallbackImage = "/assets/default-video-thumbnail.jpg"
}) => {
  // Define supported video platforms with thumbnail generation
  const platforms: VideoPlatform[] = [
    // YouTube
    {
      name: 'YouTube',
      pattern: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      thumbnailUrl: (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        const videoId = match?.[1];
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : fallbackImage;
      }
    },
    // Vimeo
    {
      name: 'Vimeo',
      pattern: /vimeo\.com\/(\d+)/i,
      thumbnailUrl: (url: string) => {
        const match = url.match(/vimeo\.com\/(\d+)/i);
        const videoId = match?.[1];
        return videoId ? `https://vumbnail.com/${videoId}.jpg` : fallbackImage;
      }
    },
    // Facebook (limited thumbnail support)
    {
      name: 'Facebook',
      pattern: /facebook\.com\/(?:[^\/]+\/videos\/|video\.php\?v=|.*\/videos\/|share\/r\/|share\/v\/)([^\/\?]+)/i,
      thumbnailUrl: () => fallbackImage // Facebook doesn't provide direct thumbnail URLs
    },
    // Instagram (limited thumbnail support)
    {
      name: 'Instagram',
      pattern: /instagram\.com\/(?:p|reel|tv)\/([^\/\?]+)/i,
      thumbnailUrl: () => fallbackImage // Instagram doesn't provide direct thumbnail URLs
    },
    // Dailymotion
    {
      name: 'Dailymotion',
      pattern: /dailymotion\.com\/video\/([^\/\?]+)/i,
      thumbnailUrl: (url: string) => {
        const match = url.match(/dailymotion\.com\/video\/([^\/\?]+)/i);
        const videoId = match?.[1];
        return videoId ? `https://www.dailymotion.com/thumbnail/video/${videoId}` : fallbackImage;
      }
    }
  ];

  // Detect platform and get thumbnail URL
  const getThumbnailUrl = (url: string): string => {
    // Check if it's a direct video file
    if (/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url)) {
      return fallbackImage; // Direct video files don't have thumbnails
    }

    // Check for platform-specific thumbnails
    for (const platform of platforms) {
      if (platform.pattern.test(url)) {
        return platform.thumbnailUrl(url);
      }
    }
    
    // If no platform detected, return fallback
    return fallbackImage;
  };

  const thumbnailUrl = getThumbnailUrl(url);

  return (
    <img
      src={thumbnailUrl}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to default image if thumbnail fails to load
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackImage) {
          target.src = fallbackImage;
        }
      }}
    />
  );
};

export default VideoThumbnail; 
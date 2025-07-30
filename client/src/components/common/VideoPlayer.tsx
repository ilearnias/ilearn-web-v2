import React from 'react';
import FacebookVideoHandler from './FacebookVideoHandler';

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
  allowFullScreen?: boolean;
  facebookOpenInNewTab?: boolean;
}

interface VideoPlatform {
  name: string;
  pattern: RegExp;
  embedUrl: (url: string) => string;
  thumbnailUrl?: (url: string) => string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  title = "Video", 
  className = "",
  allowFullScreen = true,
  facebookOpenInNewTab = false
}) => {
  // Define supported video platforms
  const platforms: VideoPlatform[] = [
    // YouTube
    {
      name: 'YouTube',
      pattern: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      embedUrl: (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        const videoId = match?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : url;
      },
      thumbnailUrl: (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        const videoId = match?.[1];
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
      }
    },
    // Facebook
    {
      name: 'Facebook',
      pattern: /facebook\.com\/(?:[^\/]+\/videos\/|video\.php\?v=|.*\/videos\/|share\/r\/|share\/v\/)([^\/\?]+)/i,
      embedUrl: (url: string) => {
        // Facebook videos require authentication and app setup
        // Return a fallback URL that will show an error message
        return 'data:text/html;charset=utf-8,<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:Arial,sans-serif;background:#f0f2f5;"><div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);"><h3 style="color:#1877f2;margin-bottom:1rem;">Facebook Video</h3><p style="color:#65676b;margin-bottom:1rem;">This video requires Facebook authentication to play.</p><a href="' + url + '" target="_blank" style="background:#1877f2;color:white;padding:0.5rem 1rem;text-decoration:none;border-radius:6px;display:inline-block;">Open on Facebook</a></div></body></html>';
      }
    },
    // Instagram
    {
      name: 'Instagram',
      pattern: /instagram\.com\/(?:p|reel|tv)\/([^\/\?]+)/i,
      embedUrl: (url: string) => {
        const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^\/\?]+)/i);
        const postId = match?.[1];
        return postId ? `https://www.instagram.com/p/${postId}/embed/` : url;
      }
    },
    // Vimeo
    {
      name: 'Vimeo',
      pattern: /vimeo\.com\/(\d+)/i,
      embedUrl: (url: string) => {
        const match = url.match(/vimeo\.com\/(\d+)/i);
        const videoId = match?.[1];
        return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0` : url;
      },
      thumbnailUrl: (url: string) => {
        const match = url.match(/vimeo\.com\/(\d+)/i);
        const videoId = match?.[1];
        return videoId ? `https://vumbnail.com/${videoId}.jpg` : '';
      }
    },
    // Dailymotion
    {
      name: 'Dailymotion',
      pattern: /dailymotion\.com\/video\/([^\/\?]+)/i,
      embedUrl: (url: string) => {
        const match = url.match(/dailymotion\.com\/video\/([^\/\?]+)/i);
        const videoId = match?.[1];
        return videoId ? `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1` : url;
      }
    },
    // TikTok
    {
      name: 'TikTok',
      pattern: /tiktok\.com\/@[^\/]+\/video\/(\d+)/i,
      embedUrl: (url: string) => {
        const match = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/i);
        const videoId = match?.[1];
        return videoId ? `https://www.tiktok.com/embed/${videoId}` : url;
      }
    },
    // Twitch
    {
      name: 'Twitch',
      pattern: /twitch\.tv\/videos\/(\d+)/i,
      embedUrl: (url: string) => {
        const match = url.match(/twitch\.tv\/videos\/(\d+)/i);
        const videoId = match?.[1];
        return videoId ? `https://player.twitch.tv/?video=v${videoId}&parent=localhost` : url;
      }
    }
  ];

  // Detect platform and get embed URL
  const detectPlatform = (url: string): { platform: VideoPlatform | null; embedUrl: string; thumbnailUrl?: string } => {
    for (const platform of platforms) {
      if (platform.pattern.test(url)) {
        return {
          platform,
          embedUrl: platform.embedUrl(url),
          thumbnailUrl: platform.thumbnailUrl?.(url)
        };
      }
    }
    
    // If no platform detected, return the original URL
    return {
      platform: null,
      embedUrl: url
    };
  };

  const { platform, embedUrl, thumbnailUrl } = detectPlatform(url);

  // Handle Facebook videos with special handler
  if (platform?.name === 'Facebook') {
    return (
      <FacebookVideoHandler
        url={url}
        title={title}
        className={className}
        openInNewTab={facebookOpenInNewTab}
      />
    );
  }

  // Handle direct video files
  const isDirectVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);

  if (isDirectVideo) {
  return (
      <video
        className={`w-full h-full object-cover ${className}`}
        controls
        autoPlay
        muted
        loop
        title={title}
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/webm" />
        <source src={url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Handle embedded videos
  return (
    <iframe
      src={embedUrl}
      title={title}
      className={`w-full h-full border-0 ${className}`}
      frameBorder="0"
      allow={allowFullScreen ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
      allowFullScreen={allowFullScreen}
      loading="lazy"
    />
  );
};

export default VideoPlayer;
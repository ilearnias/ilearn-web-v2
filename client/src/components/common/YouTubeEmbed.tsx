import { extractYoutubeVideoId } from '@/lib/utils';

interface YouTubeEmbedProps {
  url: string;
  className?: string;
  title?: string;
  allowFullScreen?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

/**
 * YouTube Embed Component
 * Renders a YouTube video embed with proper aspect ratio support
 * Handles both standard videos and YouTube Shorts
 */
const YouTubeEmbed = ({
  url,
  className = '',
  title = 'YouTube video player',
  allowFullScreen = true,
  autoplay = true,
  loop = true,
}: YouTubeEmbedProps) => {
  const videoId = extractYoutubeVideoId(url);
  
  if (!videoId) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    );
  }

  // Determine if it's a YouTube Short
  const isShort = url.includes('shorts/');
  
  // Build parameters for the embed URL
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    autoplay: autoplay ? '1' : '0',
    loop: loop ? '1' : '0',
    playsinline: '1',
    controls: '1',
  });
  
  if (loop) {
    params.append('playlist', videoId);
  }
  
  // Create the full embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  
  return (
    <div 
      className={`relative overflow-hidden ${className} ${isShort ? 'youtube-shorts-container' : 'youtube-standard-container'}`} 
      style={{ 
        aspectRatio: isShort ? '9/16' : '16/9',
        maxWidth: isShort ? '360px' : '100%',
        margin: isShort ? '0 auto' : '0'
      }}
    >
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={allowFullScreen}
        className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
      />
    </div>
  );
};

export default YouTubeEmbed;
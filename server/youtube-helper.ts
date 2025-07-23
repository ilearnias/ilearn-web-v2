/**
 * Extracts the video ID from a YouTube URL
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Regular YouTube watch URL (https://www.youtube.com/watch?v=VIDEO_ID)
  if (url.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch (e) {
      return null;
    }
  }
  
  // Short YouTube URL (https://youtu.be/VIDEO_ID)
  if (url.includes('youtu.be/')) {
    try {
      const parts = url.split('youtu.be/');
      if (parts.length < 2) return null;
      
      // Remove any query parameters
      return parts[1].split('?')[0].split('#')[0];
    } catch (e) {
      return null;
    }
  }
  
  // YouTube Shorts (https://www.youtube.com/shorts/VIDEO_ID)
  if (url.includes('youtube.com/shorts/')) {
    try {
      const parts = url.split('youtube.com/shorts/');
      if (parts.length < 2) return null;
      
      // Remove any query parameters
      return parts[1].split('?')[0].split('#')[0];
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

/**
 * Gets the thumbnail URL for a YouTube video
 */
export function getYoutubeThumbnailUrl(url: string, quality: string = 'hqdefault'): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  // Use maxresdefault for Shorts to get higher quality thumbnails
  if (url.includes('youtube.com/shorts/')) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Converts a YouTube URL to its embed version
 * This is useful for embedding the video in an iframe
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  // For YouTube Shorts, add special parameters to handle vertical video better
  if (url.includes('youtube.com/shorts/')) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&fs=1&playsinline=0&enablejsapi=1`;
  }
  
  // For regular YouTube videos, add parameters for fullscreen, autoplay, etc.
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&fs=1&playsinline=0&enablejsapi=1`;
}

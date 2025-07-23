/**
 * Formats file size from bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Extracts the video ID from a YouTube URL
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  
  let videoId = null;
  
  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch')) {
    try {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v');
    } catch (e) {
      console.error('Invalid URL', e);
      return null;
    }
  } 
  // Format: https://youtu.be/VIDEO_ID
  else if (url.includes('youtu.be')) {
    try {
      videoId = url.split('/').pop();
      // Remove any query parameters
      videoId = videoId?.split('?')[0] || null;
    } catch (e) {
      console.error('Error parsing youtu.be URL', e);
      return null;
    }
  }
  // Format: https://www.youtube.com/shorts/VIDEO_ID
  else if (url.includes('youtube.com/shorts/')) {
    try {
      const shortsPath = url.split('/shorts/');
      if (shortsPath.length > 1) {
        videoId = shortsPath[1].split('?')[0]; // Remove query parameters
      }
    } catch (e) {
      console.error('Error parsing YouTube shorts URL', e);
      return null;
    }
  }
  // Format: https://www.youtube.com/embed/VIDEO_ID
  else if (url.includes('youtube.com/embed/')) {
    try {
      const embedPath = url.split('/embed/');
      if (embedPath.length > 1) {
        videoId = embedPath[1].split('?')[0]; // Remove query parameters
      }
    } catch (e) {
      console.error('Error parsing YouTube embed URL', e);
      return null;
    }
  }
  
  return videoId;
}

/**
 * Gets the thumbnail URL for a YouTube video
 */
export function getYoutubeThumbnailUrl(url: string, quality: string = 'hqdefault'): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  // Available qualities: default, hqdefault, mqdefault, sddefault, maxresdefault
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Gets the embed URL for a YouTube video
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
}

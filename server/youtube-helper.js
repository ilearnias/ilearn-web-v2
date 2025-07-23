/**
 * Extracts the video ID from a YouTube URL
 * @param {string} url - The YouTube URL
 * @returns {string|null} - The video ID or null if not found
 */
function extractYoutubeVideoId(url) {
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
 * @param {string} url - The YouTube URL
 * @param {string} quality - The thumbnail quality (default: 'hqdefault')
 * @returns {string|null} - The thumbnail URL or null if not found
 */
function getYoutubeThumbnailUrl(url, quality = 'hqdefault') {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

module.exports = {
  extractYoutubeVideoId,
  getYoutubeThumbnailUrl
};

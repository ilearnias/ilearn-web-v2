/**
 * Extracts the video ID from a YouTube URL
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Regular YouTube watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/e\/|youtube\.com\/\?v=)([^&?\n]+)/);
  if (match && match[1]) {
    return match[1];
  }
  
  // YouTube shorts: https://www.youtube.com/shorts/VIDEO_ID
  match = url.match(/youtube\.com\/shorts\/([^&?\n]+)/);
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

/**
 * Gets the thumbnail URL for a YouTube video
 */
export function getYoutubeThumbnailUrl(url: string, quality: string = 'hqdefault'): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  // Available quality options: default, hqdefault, mqdefault, sddefault, maxresdefault
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
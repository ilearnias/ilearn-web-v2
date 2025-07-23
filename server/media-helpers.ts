// Import YouTube helper functions
import { 
  extractYoutubeVideoId as ytExtractId, 
  getYoutubeThumbnailUrl as ytGetThumbnail,
  getYoutubeEmbedUrl as ytGetEmbedUrl 
} from './youtube-helper';

/**
 * Extracts the video ID from a YouTube URL
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  // Delegate to the YouTube helper
  return ytExtractId(url);
}

/**
 * Gets the thumbnail URL for a YouTube video
 */
export function getYoutubeThumbnailUrl(url: string, quality: string = 'hqdefault'): string | null {
  return ytGetThumbnail(url, quality);
}

/**
 * Gets the embed URL for a YouTube video
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  return ytGetEmbedUrl(url);
}

/**
 * Detects the type of media from the URL
 * @returns 'video' or 'image'
 */
export function detectMediaType(url: string): 'video' | 'image' {
  if (!url) return 'image';
  
  // YouTube videos
  if (url.includes('youtube.com/watch') || 
      url.includes('youtu.be/') || 
      url.includes('youtube.com/shorts/')) {
    return 'video';
  }
  
  // Instagram videos
  if (url.includes('instagram.com/reel/') || 
      url.includes('instagram.com/p/') && url.includes('video')) {
    return 'video';
  }
  
  // Facebook videos
  if (url.includes('facebook.com/share/v/') || 
      url.includes('facebook.com/plugins/video') ||
      url.includes('fb.watch/')) {
    return 'video';
  }
  
  // Check for common image extensions
  if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) {
    return 'image';
  }
  
  // Default to image if we can't determine
  return 'image';
}

/**
 * Detects the aspect ratio from a URL or hints
 * @returns 'landscape', 'portrait', or 'square'
 */
export function detectAspectRatio(url: string, mediaType: 'video' | 'image'): 'landscape' | 'portrait' | 'square' {
  if (!url) return 'landscape';
  
  // YouTube shorts are portrait
  if (url.includes('youtube.com/shorts/')) {
    return 'portrait';
  }
  
  // Regular YouTube videos are landscape
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    return 'landscape';
  }
  
  // Instagram reels are portrait
  if (url.includes('instagram.com/reel/')) {
    return 'portrait';
  }
  
  // Facebook videos are typically landscape
  if (url.includes('facebook.com/share/v/') || 
      url.includes('facebook.com/plugins/video') || 
      url.includes('fb.watch/')) {
    return 'landscape';
  }
  
  // Default based on media type
  return mediaType === 'video' ? 'landscape' : 'square';
}

/**
 * Generates a thumbnail URL based on the media type and URL
 */
export function generateThumbnail(url: string, mediaType: 'video' | 'image'): string | null {
  if (!url) return null;
  
  // For YouTube videos, use YouTube thumbnail API
  if (mediaType === 'video' && (url.includes('youtube.com') || url.includes('youtu.be'))) {
    return getYoutubeThumbnailUrl(url);
  }
  
  // For Instagram reels, use placeholder for now
  // In a production app, you'd want to use Instagram's API or a proxy service
  if (mediaType === 'video' && url.includes('instagram.com/reel/')) {
    const parts = url.split('instagram.com/reel/');
    if (parts.length > 1) {
      const reelId = parts[1].split('/')[0].split('?')[0];
      return `https://placehold.co/480x600/e4405f/ffffff?text=Instagram+${reelId.substring(0, 8)}`;
    }
  }
  
  // For Facebook videos, use the provided thumbnail or a default one
  if (mediaType === 'video' && (url.includes('facebook.com/share/v/') || 
      url.includes('facebook.com/plugins/video') || 
      url.includes('fb.watch/'))) {
    // First try to extract video ID from the URL
    let videoId = '';
    if (url.includes('facebook.com/share/v/')) {
      const parts = url.split('facebook.com/share/v/');
      if (parts.length > 1) {
        videoId = parts[1].split('/')[0].split('?')[0];
      }
    }
    
    // Return a Facebook branded placeholder with the video ID if available
    if (videoId) {
      return `https://scontent.fixm4-1.fna.fbcdn.net/v/t15.5256-10/c/300x100/407087034_923107089498761_1675166092764546376_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=af9016&_nc_ohc=DeMF7FwOcTUAX9B8Zr2&_nc_ht=scontent.fixm4-1.fna`;
    } else {
      // Generic Facebook video thumbnail
      return `https://scontent.fixm4-1.fna.fbcdn.net/v/t15.5256-10/c/300x100/407087034_923107089498761_1675166092764546376_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=af9016&_nc_ohc=DeMF7FwOcTUAX9B8Zr2&_nc_ht=scontent.fixm4-1.fna`;
    }
  }
  
  // For images, use the image itself as the thumbnail
  if (mediaType === 'image') {
    return url;
  }
  
  return null;
}

/**
 * Process media item to ensure it has all the necessary fields
 */
export function processMediaItem(mediaData: any): any {
  const processedData = { ...mediaData };
  
  // Auto-detect media type if not provided
  if (!processedData.type) {
    processedData.type = detectMediaType(processedData.mediaUrl);
  }
  
  // Auto-detect aspect ratio if not provided
  if (!processedData.aspectRatio) {
    processedData.aspectRatio = detectAspectRatio(processedData.mediaUrl, processedData.type);
  }
  
  // Auto-generate thumbnail if not provided
  if (!processedData.thumbnailUrl) {
    const thumbnail = generateThumbnail(processedData.mediaUrl, processedData.type);
    if (thumbnail) {
      processedData.thumbnailUrl = thumbnail;
    }
  }
  
  // For YouTube videos, generate embed URL if not already set
  if (processedData.type === 'video' && 
      !processedData.embedUrl && 
      (processedData.mediaUrl.includes('youtube.com') || processedData.mediaUrl.includes('youtu.be'))) {
    const embedUrl = getYoutubeEmbedUrl(processedData.mediaUrl);
    if (embedUrl) {
      processedData.embedUrl = embedUrl;
    }
  }
  
  // For Facebook videos, validate/update the embed URL
  if (processedData.type === 'video' && 
      processedData.mediaUrl.includes('facebook.com/share/v/') && 
      !processedData.embedUrl) {
    const videoId = processedData.mediaUrl.split('facebook.com/share/v/')[1]?.split('/')[0]?.split('?')[0];
    if (videoId) {
      processedData.embedUrl = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F${videoId}%2F&show_text=0&width=560&height=315&appId`;
    }
  }
  
  return processedData;
}
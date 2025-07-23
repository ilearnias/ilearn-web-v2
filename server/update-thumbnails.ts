import { pool } from './db';

/**
 * Extracts the video ID from a YouTube URL
 */
function extractYoutubeVideoId(url: string): string | null {
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
function getYoutubeThumbnailUrl(url: string, quality: string = 'hqdefault'): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Updates thumbnails for YouTube videos in the database
 */
async function updateYoutubeThumbnails() {
  try {
    // Get all YouTube video entries without thumbnails
    const { rows } = await pool.query(
      "SELECT id, media_url FROM media WHERE type = 'video' AND (thumbnail_url IS NULL OR thumbnail_url = '')"
    );
    
    console.log(`Found ${rows.length} videos without thumbnails`);
    
    // Process each video
    for (const row of rows) {
      const { id, media_url } = row;
      
      // Skip non-YouTube URLs
      if (!media_url || (!media_url.includes('youtube.com') && !media_url.includes('youtu.be'))) {
        continue;
      }
      
      // Generate thumbnail URL
      const thumbnailUrl = getYoutubeThumbnailUrl(media_url);
      
      if (thumbnailUrl) {
        // Update the database
        await pool.query(
          'UPDATE media SET thumbnail_url = $1 WHERE id = $2',
          [thumbnailUrl, id]
        );
        
        console.log(`Updated thumbnail for video ID ${id}: ${thumbnailUrl}`);
      } else {
        console.log(`Could not generate thumbnail for video ID ${id}`);
      }
    }
    
    console.log('Thumbnail update complete');
  } catch (error) {
    console.error('Error updating thumbnails:', error);
  }
}

// Run this function to update thumbnails
updateYoutubeThumbnails().catch(console.error);

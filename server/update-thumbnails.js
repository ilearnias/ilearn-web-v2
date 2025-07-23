const { Pool } = require('pg');
const { extractYoutubeVideoId, getYoutubeThumbnailUrl } = require('./youtube-helper');

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

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
      if (!media_url.includes('youtube.com') && !media_url.includes('youtu.be')) {
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
  } finally {
    pool.end(); // Close the connection pool
  }
}

// Run the update function
updateYoutubeThumbnails();

// Media routes for reference
const handlePostMedia = async (req, res) => {
  try {
    const mediaData = insertMediaSchema.parse(req.body);
    
    // Auto-detect media type and aspect ratio if not provided
    if (!mediaData.type || !mediaData.aspectRatio) {
      // YouTube video detection
      if (mediaData.mediaUrl.includes('youtube.com/watch') || 
          mediaData.mediaUrl.includes('youtu.be') || 
          mediaData.mediaUrl.includes('youtube.com/shorts')) {
        
        // Set media type to video
        mediaData.type = 'video';
        
        // YouTube shorts have vertical/portrait aspect ratio
        if (mediaData.mediaUrl.includes('youtube.com/shorts')) {
          mediaData.aspectRatio = 'portrait';
        } else {
          // Regular YouTube videos are landscape by default
          mediaData.aspectRatio = mediaData.aspectRatio || 'landscape';
        }
      }
      // Image detection (if URL ends with image extension)
      else if (/\.(jpeg|jpg|gif|png|webp)$/i.test(mediaData.mediaUrl)) {
        mediaData.type = 'image';
        mediaData.aspectRatio = mediaData.aspectRatio || 'landscape';
      }
      // Default fallback
      else {
        mediaData.type = mediaData.type || 'image';
        mediaData.aspectRatio = mediaData.aspectRatio || 'landscape';
      }
    }
    
    // Auto-generate thumbnail if not provided
    if (!mediaData.thumbnailUrl && mediaData.mediaUrl) {
      // YouTube video
      if (mediaData.type === 'video' && 
          (mediaData.mediaUrl.includes('youtube.com/watch') || 
           mediaData.mediaUrl.includes('youtu.be') || 
           mediaData.mediaUrl.includes('youtube.com/shorts'))) {
        
        let videoId = '';
        
        if (mediaData.mediaUrl.includes('youtube.com/watch')) {
          // Format: https://www.youtube.com/watch?v=VIDEO_ID
          const urlParams = new URL(mediaData.mediaUrl).searchParams;
          videoId = urlParams.get('v') || '';
        } else if (mediaData.mediaUrl.includes('youtu.be')) {
          // Format: https://youtu.be/VIDEO_ID
          videoId = mediaData.mediaUrl.split('/').pop() || '';
          // Remove any query parameters
          videoId = videoId?.split('?')[0] || '';
        } else if (mediaData.mediaUrl.includes('youtube.com/shorts')) {
          // Format: https://www.youtube.com/shorts/VIDEO_ID
          const shortsPath = mediaData.mediaUrl.split('/shorts/');
          if (shortsPath.length > 1) {
            videoId = shortsPath[1].split('?')[0]; // Remove query parameters
          }
        }
        
        // Set thumbnail URL for YouTube video
        if (videoId) {
          mediaData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
      // Image - use the same URL for thumbnail
      else if (mediaData.type === 'image' && /\.(jpeg|jpg|gif|png|webp)$/i.test(mediaData.mediaUrl)) {
        mediaData.thumbnailUrl = mediaData.mediaUrl;
      }
    }
    
    const newMedia = await storage.createMedia(mediaData);
    res.status(201).json(newMedia);
  } catch (err) {
    handleValidationError(err, res);
  }
};

const handlePutMedia = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const mediaData = insertMediaSchema.partial().parse(req.body);
    
    // Get existing media to check if we need to update thumbnail
    const existingMedia = await storage.getMediaById(id);
    if (!existingMedia) {
      return res.status(404).json({ message: "Media item not found" });
    }
    
    // If mediaUrl or type/aspectRatio is updated and no new thumbnail is provided
    if ((mediaData.mediaUrl || mediaData.type || mediaData.aspectRatio) && !mediaData.thumbnailUrl) {
      const updatedUrl = mediaData.mediaUrl || existingMedia.mediaUrl;
      const updatedType = mediaData.type || existingMedia.type;
      
      // YouTube video
      if (updatedType === 'video' && 
          (updatedUrl.includes('youtube.com/watch') || 
           updatedUrl.includes('youtu.be') || 
           updatedUrl.includes('youtube.com/shorts'))) {
        
        let videoId = '';
        
        if (updatedUrl.includes('youtube.com/watch')) {
          // Format: https://www.youtube.com/watch?v=VIDEO_ID
          const urlParams = new URL(updatedUrl).searchParams;
          videoId = urlParams.get('v') || '';
        } else if (updatedUrl.includes('youtu.be')) {
          // Format: https://youtu.be/VIDEO_ID
          videoId = updatedUrl.split('/').pop() || '';
          // Remove any query parameters
          videoId = videoId?.split('?')[0] || '';
        } else if (updatedUrl.includes('youtube.com/shorts')) {
          // Format: https://www.youtube.com/shorts/VIDEO_ID
          const shortsPath = updatedUrl.split('/shorts/');
          if (shortsPath.length > 1) {
            videoId = shortsPath[1].split('?')[0]; // Remove query parameters
          }
        }
        
        // Set thumbnail URL for YouTube video
        if (videoId) {
          mediaData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
      // Image - use the same URL for thumbnail
      else if (updatedType === 'image' && /\.(jpeg|jpg|gif|png|webp)$/i.test(updatedUrl)) {
        mediaData.thumbnailUrl = updatedUrl;
      }
    }
    
    const updatedMedia = await storage.updateMedia(id, mediaData);
    res.json(updatedMedia);
  } catch (err) {
    handleValidationError(err, res);
  }
};

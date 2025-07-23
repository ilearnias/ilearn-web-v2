import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';
import { getYoutubeEmbedUrl } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const AboutMediaCarousel = () => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);

  // Fetch media data with optimized cache settings
  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['/api/media'],
    queryFn: () => apiRequest<MediaItem[]>('/api/media'),
    refetchInterval: 2000,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Process and filter media items when the data changes
  useEffect(() => {
    if (mediaItems && mediaItems.length > 0) {
      console.log("About Media Carousel - All media items:", mediaItems.map(item => `${item.id}-${item.title}-${item.displayOrder}`));
      
      // Make sure media item with ID 53 (VM4v8Yk7nN0) is included
      console.log("Looking for video ID 53:", mediaItems.find(item => item.id === 53));
      
      const filtered = [...mediaItems]
        .filter((item, index, self) => {
          // Remove duplicates 
          const isUnique = index === self.findIndex(t => t.id === item.id);
          
          // Filter out specific slides (ID 50 - "iLearn UPSC Facebook Live Session")
          const isNotExcluded = item.id !== 50;
          
          return isUnique && isNotExcluded;
        })
        .sort((a, b) => {
          // First sort by displayOrder if both items have it
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            // If display orders are the same, prioritize newer items (higher IDs)
            if (a.displayOrder === b.displayOrder) {
              return b.id - a.id; // Higher ID (newer) first
            }
            return a.displayOrder - b.displayOrder;
          }
          // If only one has displayOrder, prioritize it
          if (a.displayOrder !== undefined) return -1;
          if (b.displayOrder !== undefined) return 1;
          // Fall back to creation date
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        });
      
      console.log("About Media Carousel - Filtered items:", filtered.map(item => `${item.id}-${item.title}-${item.displayOrder}`));
      
      // Log the first 5 videos that will appear in the carousel
      console.log("About Media Carousel - First 5 videos:", filtered.slice(0, 5).map(item => 
        `${item.id}-${item.title}-${item.displayOrder}-${item.mediaUrl?.includes('VM4v8Yk7nN0') ? 'NEW VIDEO!' : ''}`
      ));
      
      setFilteredItems(filtered);
    }
  }, [mediaItems]);

  // Open video dialog
  const openVideoDialog = (item: MediaItem) => {
    setSelectedVideo(item);
    setIsVideoDialogOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close video dialog
  const closeVideoDialog = () => {
    setIsVideoDialogOpen(false);
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  // Helper to determine aspect ratio
  const getActualAspectRatio = (item: MediaItem): 'portrait' | 'landscape' | 'square' => {
    // First check explicit aspect ratio property if available
    if (item.aspectRatio === 'portrait' || item.aspectRatio === 'landscape' || item.aspectRatio === 'square') {
      return item.aspectRatio as 'portrait' | 'landscape' | 'square';
    }
    
    // Default to landscape if aspectRatio is missing
    return 'landscape';
  };
  
  // Helper to determine if item is a video or image
  const getMediaType = (item: MediaItem): 'video' | 'image' => {
    // First check explicit type property if available
    if (item.type === 'video' || item.type === 'image') {
      return item.type;
    }
    
    // Then check other type values for backward compatibility
    if ((item.type as string) === 'portrait-video' || 
        (item.type as string) === 'landscape-video' || 
        (item.type as string) === 'reel') {
      return 'video';
    }
    
    if ((item.type as string) === 'photo') {
      return 'image';
    }
    
    // Check URL for video platforms
    const url = item.mediaUrl || item.url;
    if (url && (url.includes('youtube.com') || 
               url.includes('youtu.be') || 
               url.includes('instagram.com/reel') ||
               url.includes('facebook.com/share/v/') ||
               url.includes('facebook.com/plugins/video') ||
               url.includes('fb.watch/'))) {
      return 'video';
    }
    
    // Default to image
    return 'image';
  };

  // Render media card
  const renderMediaCard = (item: MediaItem) => {
    const aspectRatio = getActualAspectRatio(item);
    
    const elevationClass = "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md";
    const transitionClass = "transition-all duration-300 hover:-translate-y-1 group relative cursor-pointer";
    
    const STANDARD_CARD_HEIGHT = 320;
    const STANDARD_IMAGE_HEIGHT = 224;
    
    const getWidthForAspectRatio = () => {
      switch (aspectRatio) {
        case 'portrait':
          return Math.round(STANDARD_IMAGE_HEIGHT * (9/16)); 
        case 'landscape':
          return Math.round(STANDARD_IMAGE_HEIGHT * (16/9)); 
        case 'square':
          return STANDARD_IMAGE_HEIGHT; 
        default:
          return Math.round(STANDARD_IMAGE_HEIGHT * (16/9));
      }
    };
    
    const width = getWidthForAspectRatio();
    
    // Determine if we should show the play button
    const shouldShowPlayButton = getMediaType(item) === 'video';
    
    return (
      <div
        className={`flex-shrink-0 ${elevationClass} ${transitionClass}`}
        style={{ 
          width: `${width}px`,
          height: `${STANDARD_CARD_HEIGHT}px`,
          overflow: 'hidden' 
        }}
        onClick={() => {
          if (shouldShowPlayButton) {
            openVideoDialog(item);
          }
        }}
      >
        {/* Play button overlay - only for videos */}
        {shouldShowPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#20468D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        )}
        
        {/* Media thumbnail */}
        <div 
          className="relative overflow-hidden flex items-center justify-center"
          style={{ height: `${STANDARD_IMAGE_HEIGHT}px` }}
        >
          <img
            src={item.thumbnailUrl || item.url || item.mediaUrl} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10"></div>
        </div>
        
        {/* Info section */}
        <div className="p-5 bg-white flex flex-col justify-center" style={{ height: '96px' }}>
          <h3 className="font-semibold text-base text-neutral-800 line-clamp-2">{item.title}</h3>
        </div>
      </div>
    );
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue via-primary-blue to-primary-red">iLearn in Media</span>
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
          </h2>
          <p className="text-neutral-600 mt-3">Our presence across media platforms</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex overflow-x-auto pb-4 hide-scrollbar">
              {/* Render all media items in a single row with proper ordering */}
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`mx-2 flex justify-center items-center ${
                    getActualAspectRatio(item) === 'portrait' ? 'flex-col' : ''
                  } relative`}
                >  
                  {renderMediaCard(item)}
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 hover:bg-white hover:-translate-x-0.5"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <button 
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 hover:bg-white hover:translate-x-0.5"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Video dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-black border-0">
          {selectedVideo && (
            <div className="relative w-full h-0 pb-[56.25%] overflow-hidden">
              <iframe
                src={selectedVideo.embedUrl || getYoutubeEmbedUrl(selectedVideo.mediaUrl || selectedVideo.url || '') || ''}
                title={selectedVideo.title}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AboutMediaCarousel;
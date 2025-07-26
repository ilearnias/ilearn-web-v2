import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { extractYoutubeVideoId, getYoutubeThumbnailUrl, getYoutubeEmbedUrl } from '@/lib/media-helpers';
import apiClient from '@/config/apiClient';
import QUERY_KEY from '@/config/queryKeys';
import { API } from '@/config/api';

interface ApiTestimonial {
  id: string;
  description: string;
  video: string;
  isActive: boolean;
  isTestimonial: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  thumbnail?: string; // Added thumbnail to the interface
}

interface Testimonial {
  id: string;
  name: string;
  program?: string;
  quote?: string;
  year?: number;
  image?: string;
  video: string;
  type: 'portrait-video' | 'landscape-video';
  displayOrder?: number;
  description: string;
  details?: string;
  createdAt?: string; // Added to fix type error
}

const VideoTestimonials = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  // Fetch testimonials from API
  const { data: apiData, isLoading } = useQuery({
    queryKey: [QUERY_KEY?.MEDIA],
    queryFn: async () => {
      const response = await apiClient.get(API?.MEDIA + "?isActive=true");
      return response.data;
    },
  });

  // Transform API data to Testimonial format
  const testimonials: Testimonial[] = React.useMemo(() => {
    if (!apiData?.data) return [];

    return apiData.data
      .filter((item: ApiTestimonial) => item.isActive && item.isTestimonial)
      .map((item: ApiTestimonial): Testimonial => {
        const videoId = extractYoutubeVideoId(item.video);
        const fallbackThumbnail = videoId ? getYoutubeThumbnailUrl(item.video, 'maxresdefault') : undefined;
        const thumbnailUrl = item.thumbnail ? item.thumbnail : fallbackThumbnail;
        
        return {
          id: item.id,
          name: item.description, // Using description as name as specified
          video: item.video,
          type: 'landscape-video', // Default to landscape
          displayOrder: item.order,
          description: item.description,
          image: thumbnailUrl || undefined, // Use API thumbnail if present, else fallback
          details: item.description,
          program: 'UPSC CSE', // Default program
          createdAt: item.createdAt // Add createdAt for sorting
        };
      })
      .sort((a: Testimonial, b: Testimonial) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [apiData]);
  
  // Show the final testimonials for debugging
  React.useEffect(() => {
    if (testimonials.length > 0) {
      // Log the testimonials list after sorting
      const sortedTestimonials = [...testimonials]
        .sort((a, b) => {
          const orderA = a.displayOrder !== null && a.displayOrder !== undefined ? Number(a.displayOrder) : Number.MAX_SAFE_INTEGER;
          const orderB = b.displayOrder !== null && b.displayOrder !== undefined ? Number(b.displayOrder) : Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        });
      
      console.log("Testimonials after sorting:", 
        sortedTestimonials.map(t => `${t.id}-${t.name}-${t.displayOrder}`)
      );
      
      // All testimonials are now static video testimonials
      console.log("Total testimonials loaded:", sortedTestimonials.length);
    }
  }, [testimonials]);

  // Open video dialog with proper aspect ratio handling
  const openVideoDialog = (videoUrl: string, video: Testimonial) => {
    console.log('Opening video dialog with:', { videoUrl, videoType: video.type });
    
    // Make sure video type is correctly set based on the filename or url pattern
    // This ensures YouTube shorts (vertical videos) are displayed in portrait mode
    // and standard YouTube videos in landscape mode
    let updatedVideo = {...video};
    
    // Check if the video is a YouTube Short (portrait video)
    if (videoUrl.includes('shorts') || 
        videoUrl.includes('vertical') || 
        video.type === 'portrait-video') {
      updatedVideo.type = 'portrait-video';
    } else {
      updatedVideo.type = 'landscape-video';
    }
    
    setSelectedVideo(videoUrl);
    setSelectedTestimonial(updatedVideo);
    setIsVideoDialogOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close video dialog
  const closeVideoDialog = () => {
    setIsVideoDialogOpen(false);
    setSelectedVideo(null);
    setSelectedTestimonial(null);
    document.body.style.overflow = 'auto';
  };

  // For scrolling controls
  const scrollLeft = () => {
    const container = document.getElementById('video-testimonials-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('video-testimonials-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Auto-scroll to Devika's video after component mount
  React.useEffect(() => {
    // Timeout to ensure component has rendered
    const timeout = setTimeout(() => {
      // Find the carousel container
      const container = document.getElementById('video-testimonials-container');
      if (container) {
        // Calculate approximate position (each card is around 400px wide including gap)
        // Devika is 4th card (index 3), so scroll to around 1200-1300px
        const scrollPosition = 1300;
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        console.log("Auto-scrolling to Devika's card at position:", scrollPosition);
      }
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [testimonials.length]); // Re-run when testimonials change
  
  // Render video card with consistent styling matching MediaShoutouts
  const renderVideoCard = (video: Testimonial) => {
    console.log("Render card - start:", video.id, video.name, video.type);
    
    // Special handling for Devika's video
    const isDevika = video.id === "16"; // Assuming "16" is the ID for Devika
    
    // Determine if the video is portrait or landscape
    const isPortrait = video.type === 'portrait-video';
    const aspectRatio = isPortrait ? 'portrait' : 'landscape';
    console.log("Video details:", {
      id: video.id,
      name: video.name,
      type: video.type,
      videoUrl: video.video,
      imageUrl: video.image,
      aspectRatio,
      isDevika
    });
    
    // Generate the YouTube thumbnail URL from the video URL
    const videoUrl = video.video || '';
    const embedUrl = getYoutubeEmbedUrl(videoUrl) || videoUrl;
    const thumbnailUrl = video.image || '';
    console.log("URLs generated:", { videoUrl, embedUrl, thumbnailUrl });
    
    // Material Design 3 elevation and surface styling
    const elevationClass = "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md";
    const transitionClass = "transition-all duration-300 hover:-translate-y-1 group relative cursor-pointer";
    
    // Standardized dimensions to match MediaShoutouts
    const STANDARD_CARD_HEIGHT = 320; // Total card height including image and info
    const STANDARD_IMAGE_HEIGHT = 224; // Standard image height (h-56) for all cards
    const INFO_HEIGHT = 96; // Height of the info section below the image
    
    // Calculate width based on aspect ratio while maintaining consistent height
    const getWidthForAspectRatio = () => {
      if (aspectRatio === 'portrait') {
        // For portrait videos (9:16 ratio), width is height * (9/16)
        return Math.round(STANDARD_IMAGE_HEIGHT * (9/16)); 
      } else {
        // For landscape videos (16:9 ratio), width is height * (16/9)
        return Math.round(STANDARD_IMAGE_HEIGHT * (16/9)); 
      }
    };
    
    const width = getWidthForAspectRatio();
    
    // Get color based on video type
    const getPlayButtonColor = () => {
      return aspectRatio === 'portrait' ? '#E21A24' : '#20468D';
    };
    
    return (
      <div
        className={`flex-shrink-0 ${elevationClass} ${transitionClass}`}
        style={{ 
          width: `${width}px`,
          height: `${STANDARD_CARD_HEIGHT}px`,
          overflow: 'hidden',
        }}
        onClick={() => openVideoDialog(embedUrl, video)}
      >
        {/* Play button overlay (Material Design 3 style) */}
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={getPlayButtonColor()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        
        {/* Media thumbnail with fixed height and correct aspect ratio */}
        <div 
          className="relative overflow-hidden flex items-center justify-center"
          style={{ height: `${STANDARD_IMAGE_HEIGHT}px` }}
        >
          {aspectRatio === 'portrait' ? (
            <div 
              className="w-full h-full relative overflow-hidden flex justify-center items-center bg-black"
              style={{ aspectRatio: '9/16' }}  /* YouTube Shorts aspect ratio */
            >
              <img
                src={thumbnailUrl} 
                alt={`${video.name}'s testimonial thumbnail`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10"></div>
            </div>
          ) : (
            <>
              <img
                src={thumbnailUrl} 
                alt={`${video.name}'s testimonial thumbnail`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10"></div>
            </>
          )}
        </div>
        
        {/* Info section with fixed height - Material Design 3 styled */}
        <div 
          className="p-5 bg-white flex flex-col justify-center"
          style={{ height: `${INFO_HEIGHT}px` }}
        >
          {/* The original code had a rank display, but the new API data doesn't include it.
              Keeping the structure but removing the rank display as it's not available. */}
          <h3 className="font-semibold text-base text-neutral-800 line-clamp-2">{video.name}</h3>
        </div>
      </div>
    );
  };

  return (
    <section className="py-14 bg-[#f8f9fe]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue via-primary-blue to-primary-red">Student Testimonials</span>
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
          </h2>
          <p className="text-neutral-600 mt-3">Hear success stories from our students</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation buttons - Material Design 3 style */}
            <button 
              onClick={scrollLeft}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 hover:bg-white hover:-translate-x-0.5"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-red">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <div 
              id="video-testimonials-container"
              className="flex overflow-x-auto hide-scrollbar gap-6 py-4 px-6 md:px-8 snap-x snap-mandatory"
            >
              {testimonials.length > 0 ? (
                (() => {
                  console.log("Before filtering:", testimonials.map(t => `${t.id}-${t.name}`));
                  
                  // Remove duplicates and filter out specific IDs
                  const uniqueItems = testimonials.filter((item, index, self) => 
                    index === self.findIndex(t => t.id === item.id) && 
                    // Filter out Dias testimonials - IDs 10, 11, 12
                    // Also filter out Lincoln testimonial - ID 7
                    // Also filter out Thumpassery Joseph Abraham (AIR Fir 6739) - ID 15
                    !["10", "11", "12", "7", "15"].includes(item.id)
                  );
                  console.log("After removing duplicates:", uniqueItems.map(t => `${t.id}-${t.name}`));
                  
                  // Custom order for specific testimonials in the requested sequence
                  // Using explicit ordering numbers 1-4 to ensure desired sequence
                  const customOrder: Record<string, number> = {
                    "8": 1,    // Reenu Anna Mathew - First position
                    "16": 2,   // Devika Priyadersini - Second position
                    "998": 3,  // Malavika G Nair - Third position
                    "999": 4   // Rajath R - Fourth position
                  };
                  
                  // Sort items with custom order
                  const sortedItems = [...uniqueItems].sort((a: Testimonial, b: Testimonial) => {
                    // First check if either item has a custom order
                    const orderA = customOrder[a.id];
                    const orderB = customOrder[b.id];
                    
                    // If both have custom order, sort by that
                    if (orderA && orderB) {
                      return orderA - orderB;
                    }
                    
                    // If only one has custom order, prioritize it
                    if (orderA) return -1;
                    if (orderB) return 1;
                    
                    // Otherwise fall back to the original sorting logic
                    const displayOrderA = a.displayOrder !== null && a.displayOrder !== undefined ? Number(a.displayOrder) : Number.MAX_SAFE_INTEGER;
                    const displayOrderB = b.displayOrder !== null && b.displayOrder !== undefined ? Number(b.displayOrder) : Number.MAX_SAFE_INTEGER;
                    
                    // Sort by display order (lower numbers first)
                    if (displayOrderA !== displayOrderB) {
                      return displayOrderA - displayOrderB;
                    }
                    
                    // If same display order or both null/undefined, fall back to creation date
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA; // Newer items first as fallback
                  });
                  console.log("After sorting:", sortedItems.map(t => `${t.id}-${t.name}-${t.displayOrder}`));
                  
                  // Map to components
                  return sortedItems.map((video) => {
                    console.log("Rendering video card for:", video.id, video.name);
                    const card = renderVideoCard(video);
                    return React.cloneElement(card, { key: video.id });
                  });
                })()
                ) : (
                  <div className="text-center w-full py-4">No video testimonials available</div>
                )}
            </div>
            
            <button 
              onClick={scrollRight}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 hover:bg-white hover:translate-x-0.5"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-red">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Video Dialog - Styled to match MediaShoutouts */}
      <Dialog open={isVideoDialogOpen} onOpenChange={(open) => !open && closeVideoDialog()}>
        <DialogContent className="max-w-5xl p-0 bg-black border-0 rounded-xl overflow-hidden">
          <DialogTitle className="sr-only">Video Testimonial</DialogTitle>
          {selectedVideo && selectedTestimonial && (
            <div 
              className={selectedTestimonial.type === 'portrait-video' 
                ? "aspect-[9/16] max-w-md mx-auto" 
                : "aspect-video w-full"}
              data-video-type={selectedTestimonial.type} 
              style={{
                // Set container size based on video type
                // Portrait videos get height constraint but auto width
                // Landscape videos get full width and auto height
                ...(selectedTestimonial.type === 'portrait-video' 
                  ? {height: '75vh', maxWidth: '45vh'} // 9:16 aspect ratio for portrait
                  : {width: '100%', maxHeight: '75vh'}) // 16:9 aspect ratio for landscape
              }}>
              <iframe
                src={selectedVideo}
                title="Video testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
              {/* Close button */}
              <button
                onClick={closeVideoDialog}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-300"
                aria-label="Close video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoTestimonials;
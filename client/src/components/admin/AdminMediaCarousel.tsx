import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Media = {
  id: number;
  title: string;
  description?: string;
  type: 'image' | 'video';
  aspectRatio: 'landscape' | 'portrait' | 'square';
  mediaUrl: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  displayOrder?: number;
  createdAt: string;
};

export default function AdminMediaCarousel() {
  const queryClient = useQueryClient();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Media[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  // Query to fetch media items with optimized cache settings
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => apiRequest<Media[]>({ url: "media" }),
    refetchInterval: 2000, // More frequent refetching to quickly reflect changes
    staleTime: 0, // Consider data stale immediately
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Update state when data is loaded
  useEffect(() => {
    if (mediaItems) {
      // Sort by displayOrder first, then by creation date
      const sortedItems = [...mediaItems].sort((a, b) => {
        // First sort by displayOrder if both items have it
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        // If only one has displayOrder, prioritize it
        if (a.displayOrder !== undefined) return -1;
        if (b.displayOrder !== undefined) return 1;
        // Fall back to creation date
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setItems(sortedItems);
    }
  }, [mediaItems]);

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, displayOrder }: { id: number; displayOrder: number }) => {
      return apiRequest({
        url: `media/${id}`,
        method: "PATCH",
        data: { displayOrder },
      });
    },
    onSuccess: () => {
      // Force an immediate refetch of media data to ensure all components see the changes
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.refetchQueries({ queryKey: ["media"] });
      toast({
        title: "Order updated",
        description: "Media items have been reordered successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to update media order:", error);
      toast({
        title: "Error",
        description: "Failed to update media order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Function to handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    
    // Update the display order for each item
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      displayOrder: index
    }));
    
    setItems(updatedItems);
    
    // Update ALL items with their new positions
    // We'll use Promise.all to update all items in parallel
    Promise.all(
      updatedItems.map((item, index) => 
        apiRequest({
          url: `media/${item.id}`,
          method: "PATCH",
          data: { displayOrder: index },
        })
      )
    ).then(() => {
      // Force an immediate refetch of media data
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.refetchQueries({ queryKey: ["media"] });
      toast({
        title: "Order updated",
        description: "All media items have been reordered successfully.",
      });
    }).catch(error => {
      console.error("Failed to update media order:", error);
      toast({
        title: "Error",
        description: "Failed to update media order. Please try again.",
        variant: "destructive",
      });
    });
  };

  // Handle opening the media dialog
  const handleOpenDialog = (media: Media) => {
    setSelectedMedia(media);
    setDialogOpen(true);
  };

  // Scroll carousel left/right
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Determine appropriate width based on aspect ratio
  const getItemWidth = (aspectRatio: string): string => {
    switch (aspectRatio) {
      case 'portrait': return '180px'; // narrower for portrait
      case 'square': return '240px'; // medium for square
      case 'landscape': 
      default: return '320px'; // wider for landscape
    }
  };

  // Render video play icon overlay
  const renderVideoOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-primary-red/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return <div className="py-8 text-center">Loading media items...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Carousel</CardTitle>
          <CardDescription>
            Preview and arrange media items for the carousel display
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-8 mt-4">
            <h3 className="text-base font-medium mb-4">Carousel Preview</h3>
            <div className="relative">
              {/* Carousel Navigation Buttons */}
              <button 
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 z-10 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 hover:bg-white transition-all"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <button 
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 z-10 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 hover:bg-white transition-all"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              
              {/* Carousel Container */}
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto pb-4 hide-scrollbar space-x-4 p-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex-shrink-0 relative cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ 
                      width: getItemWidth(item.aspectRatio), 
                      height: '240px' // Fixed height for all items
                    }}
                    onClick={() => handleOpenDialog(item)}
                  >
                    <img 
                      src={item.thumbnailUrl || item.mediaUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.type === 'video' && renderVideoOverlay()}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white font-medium text-sm truncate">{item.title}</p>
                      <p className="text-white/70 text-xs">{item.aspectRatio} {item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <h3 className="text-base font-medium mb-4">Drag and Drop to Reorder</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="media-items" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-wrap gap-4"
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative rounded-md overflow-hidden border border-gray-200 shadow-sm"
                          style={{
                            width: '120px',
                            height: '90px',
                            ...provided.draggableProps.style
                          }}
                        >
                          <img 
                            src={item.thumbnailUrl || item.mediaUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                            <span className="bg-white/90 text-black text-xs py-1 px-2 rounded-full">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 text-sm text-gray-600 px-6 py-3">
          <p>Drag and drop items above to change their display order in the carousel.</p>
        </CardFooter>
      </Card>

      {/* Media Preview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col items-center">
            {selectedMedia?.type === 'video' && selectedMedia?.embedUrl ? (
              <div className="w-full aspect-video overflow-hidden rounded-md">
                <iframe
                  src={selectedMedia.embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            ) : (
              <div className="max-w-full overflow-hidden rounded-md">
                <img 
                  src={selectedMedia?.mediaUrl} 
                  alt={selectedMedia?.title || 'Media preview'}
                  className="max-h-[60vh] object-contain"
                />
              </div>
            )}
            {selectedMedia?.description && (
              <p className="mt-4 text-gray-600">{selectedMedia.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

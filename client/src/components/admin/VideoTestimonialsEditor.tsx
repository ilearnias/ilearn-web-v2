import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { extractYoutubeVideoId, getYoutubeThumbnailUrl } from "@/lib/media-helpers";

// Type definition for Testimonial
type Testimonial = {
  id: number;
  name: string;
  rank: string;
  program: string;
  quote: string;
  year: number;
  video: string;
  type: string;
  displayOrder?: number;
  createdAt: string;
};

// Type definition for form values
type TestimonialFormValues = {
  name: string;
  rank: string;
  video: string;
  image?: string;
  program?: string;
  quote?: string;
  year?: number;
  type?: string;
  displayOrder?: number;
};

// Zod schema for form validation
const testimonialFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  rank: z.string().min(1, { message: "AIR Rank is required" }),
  video: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine(
      (url) => url.includes("youtube.com") || url.includes("youtu.be"),
      { message: "URL must be a YouTube video" }
    ),
});

export default function VideoTestimonialsEditor() {
  const queryClient = useQueryClient();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const [editTestimonialId, setEditTestimonialId] = useState<number | null>(null);
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  
  // Query to fetch video testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials", "video"],
    queryFn: () => apiRequest<Testimonial[]>({ 
      url: "/api/testimonials?type=video"
    }),
  });

  // Update state when data is loaded
  useEffect(() => {
    if (testimonials) {
      // Sort by displayOrder first, with explicit null/undefined check
      const sortedItems = [...testimonials].sort((a, b) => {
        // Force displayOrder to be a number for comparison, with NaN converted to a large number
        const orderA = a.displayOrder !== null && a.displayOrder !== undefined ? Number(a.displayOrder) : Number.MAX_SAFE_INTEGER;
        const orderB = b.displayOrder !== null && b.displayOrder !== undefined ? Number(b.displayOrder) : Number.MAX_SAFE_INTEGER;
        
        // Sort by display order (lower numbers first)
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // If same display order or both null/undefined, fall back to creation date
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newer items first as fallback
      });
      setItems(sortedItems);
    }
  }, [testimonials]);

  // Setup form with default values
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      rank: "",
      video: "",
    },
  });

  // Reset form when dialog opens/closes
  const onDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditTestimonialId(null);
      setPreviewVideoId(null);
      setPreviewThumbnail(null);
    }
  };

  // Function to handle editing a testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setEditTestimonialId(testimonial.id);
    form.reset({
      name: testimonial.name,
      rank: testimonial.rank,
      video: testimonial.video,
    });
    
    // Set preview data
    const videoId = extractYoutubeVideoId(testimonial.video);
    if (videoId) {
      setPreviewVideoId(videoId);
      setPreviewThumbnail(getYoutubeThumbnailUrl(testimonial.video));
    }
    
    setOpen(true);
  };

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: (data: TestimonialFormValues & { type: string }) => {
      return apiRequest({
        url: "/api/testimonials",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials", "video"] });
      toast({
        title: "Video testimonial added",
        description: "The video testimonial has been added successfully.",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to add video testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to add video testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TestimonialFormValues> }) => {
      return apiRequest({
        url: `/api/testimonials/${id}`,
        method: "PUT",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials", "video"] });
      toast({
        title: "Video testimonial updated",
        description: "The video testimonial has been updated successfully.",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update video testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to update video testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest({
        url: `/api/testimonials/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials", "video"] });
      toast({
        title: "Video testimonial deleted",
        description: "The video testimonial has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete video testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to delete video testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: TestimonialFormValues) => {
    if (editTestimonialId !== null) {
      const thumbnailUrl = previewThumbnail || getYoutubeThumbnailUrl(data.video, 'hqdefault') || '';
      // Determine if the video is a YouTube Short (portrait) or regular video (landscape)
      const isPortrait = data.video.includes('youtube.com/shorts/');
      const videoType = isPortrait ? "portrait-video" : "landscape-video";
      
      updateTestimonialMutation.mutate({ 
        id: editTestimonialId, 
        data: { ...data, image: thumbnailUrl, type: videoType }
      });
    } else {
      const thumbnailUrl = previewThumbnail || getYoutubeThumbnailUrl(data.video, 'hqdefault') || '';
      // Determine if the video is a YouTube Short (portrait) or regular video (landscape)
      const isPortrait = data.video.includes('youtube.com/shorts/');
      const videoType = isPortrait ? "portrait-video" : "landscape-video";
      
      createTestimonialMutation.mutate({ 
        ...data, 
        type: videoType, // Set the correct video type based on URL
        program: "UPSC CSE", // Default values
        quote: "",
        year: new Date().getFullYear(),
        image: thumbnailUrl, // Set the YouTube thumbnail as the image
      });
    }
  };

  // Handle delete confirmation
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this video testimonial? This action cannot be undone.")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

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
    
    // Update all items with their new positions in parallel
    Promise.all(
      updatedItems.map((item, index) => 
        apiRequest({
          url: `/api/testimonials/${item.id}`,
          method: "PUT",
          data: { 
            displayOrder: index,
            type: item.type || "video" // Ensure type is included
          },
        })
      )
    ).then(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials", "video"] });
      toast({
        title: "Order updated",
        description: "The display order has been updated successfully.",
      });
    }).catch(error => {
      console.error("Failed to update display order:", error);
      toast({
        title: "Error",
        description: "Failed to update display order. Please try again.",
        variant: "destructive",
      });
    });
  };

  // Function to handle YouTube URL change for preview
  const handleVideoUrlChange = (url: string) => {
    const videoId = extractYoutubeVideoId(url);
    if (videoId) {
      setPreviewVideoId(videoId);
      const thumbnailUrl = getYoutubeThumbnailUrl(url) || '';
      setPreviewThumbnail(thumbnailUrl);
    } else {
      setPreviewVideoId(null);
      setPreviewThumbnail('');
    }
  };

  // Scroll carousel left/right
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="py-8 text-center">Loading video testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <CardTitle>Video Testimonials</CardTitle>
              <CardDescription>
                Manage video testimonials from successful students
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={onDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Add New Video Testimonial</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editTestimonialId ? "Edit Video Testimonial" : "Add New Video Testimonial"}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the video testimonial.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Student's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AIR Rank</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., AIR 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="video"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Video URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://youtube.com/watch?v=..." 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleVideoUrlChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a YouTube video URL (standard watch URL or short URL)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Video Preview */}
                    {previewVideoId && previewThumbnail && (
                      <div className="border rounded-md p-2 mt-2">
                        <p className="text-sm font-medium mb-2">Video Preview:</p>
                        <div className="h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center relative group cursor-pointer">
                          <img 
                            src={previewThumbnail} 
                            alt="Video Thumbnail" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-100 group-hover:opacity-80 transition-opacity">
                            <div className="bg-red-600 rounded-full p-3 shadow-lg">
                              <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5.14v14l11-7-11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    

                    
                    <DialogFooter className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                      >
                        {createTestimonialMutation.isPending || updateTestimonialMutation.isPending
                          ? "Saving..."
                          : "Save Testimonial"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Requirements Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <InfoCircledIcon className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">YouTube Video Requirements</AlertTitle>
            <AlertDescription className="text-blue-700">
              For optimal display in the video testimonials carousel:
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Use high-quality, well-lit videos with clear audio</li>
                <li>Keep videos between 1-3 minutes for best engagement</li>
                <li>Standard YouTube videos (16:9) work best for desktop viewing</li>
                <li>YouTube Shorts (9:16) are optimized for mobile viewing</li>
                <li>Make sure videos are set to public or unlisted (not private)</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Carousel Preview */}
          <div className="mt-6">
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
                {items.map((testimonial) => {
                  const videoId = extractYoutubeVideoId(testimonial.video);
                  const thumbnailUrl = videoId ? getYoutubeThumbnailUrl(testimonial.video) : '';
                  
                  return (
                    <div 
                      key={testimonial.id} 
                      className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <div className="h-36 overflow-hidden bg-gray-100 relative group">
                        {thumbnailUrl && (
                          <>
                            <img 
                              src={thumbnailUrl} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-100 group-hover:opacity-80 transition-opacity">
                              <div className="bg-red-600 rounded-full p-2 shadow-lg">
                                <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5.14v14l11-7-11-7z" />
                                </svg>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-semibold truncate">{testimonial.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">{testimonial.rank}</span>
                          <span className="text-xs text-gray-500">{testimonial.year}</span>
                        </div>
                        {testimonial.quote && <p className="text-xs text-gray-600 mt-2 line-clamp-2">{testimonial.quote}</p>}
                      </div>
                    </div>
                  );
                })}
                
                {items.length === 0 && (
                  <div className="flex-1 py-10 text-center text-gray-500">
                    No video testimonials found. Add one to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reordering Interface */}
          <div className="mt-8">
            <h3 className="text-base font-medium mb-4">Drag and Drop to Reorder</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="testimonials" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-4"
                  >
                    {items.map((testimonial, index) => {
                      const videoId = extractYoutubeVideoId(testimonial.video);
                      const thumbnailUrl = videoId ? getYoutubeThumbnailUrl(testimonial.video) : '';
                      
                      return (
                        <Draggable key={testimonial.id} draggableId={testimonial.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm group"
                              style={{
                                width: '120px',
                                height: '100px',
                                ...provided.draggableProps.style
                              }}
                            >
                              {thumbnailUrl && (
                                <img 
                                  src={thumbnailUrl} 
                                  alt={testimonial.name}
                                  className="w-full h-3/5 object-cover"
                                />
                              )}
                              <div className="p-1 text-center overflow-hidden h-2/5">
                                <p className="text-xs font-medium truncate">{testimonial.name}</p>
                                <p className="text-xs text-gray-600 truncate">{testimonial.rank}</p>
                              </div>
                              
                              {/* Action overlay */}
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 space-y-1">
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  className="w-full h-7 text-xs py-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(testimonial);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  className="w-full h-7 text-xs py-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(testimonial.id);
                                  }}
                                  disabled={deleteTestimonialMutation.isPending}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No video testimonials found. Add one to get started.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 text-sm text-gray-600 px-6 py-3">
          <p>Drag and drop items to change their display order in the carousel.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

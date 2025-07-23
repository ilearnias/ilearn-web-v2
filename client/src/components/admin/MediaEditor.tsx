import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getYoutubeEmbedUrl } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type Media = {
  id: number;
  title: string;
  description?: string;
  type?: 'image' | 'video';
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  mediaUrl: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  createdAt: string;
};

const mediaFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  mediaUrl: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional(),
  embedUrl: z.string().url("Must be a valid URL").optional(),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

// Helper function to detect media type and generate thumbnail URL from video URL
const detectMediaInfo = (url: string): { type: string, thumbnail: string } => {
  try {
    // YouTube video
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
      let videoId = '';
      let type = 'youtube';
      
      if (url.includes('youtube.com/watch')) {
        // Format: https://www.youtube.com/watch?v=VIDEO_ID
        const urlParams = new URL(url).searchParams;
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be')) {
        // Format: https://youtu.be/VIDEO_ID
        videoId = url.split('/').pop() || '';
        // Remove any query parameters
        videoId = videoId.split('?')[0];
      }
      
      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
      return { type, thumbnail };
    }
    
    // Instagram post - treat as portrait video
    if (url.includes('instagram.com/p/')) {
      const type = 'instagram-portrait';
      let postId = '';
      
      // Try to extract the post ID
      const matches = url.match(/\/p\/(([\w-]+)\/?)/);
      if (matches && matches[1]) {
        postId = matches[1].replace(/\/$/, ''); // Remove trailing slash if present
      }
      
      // If we have a post ID, construct a URL for an image proxy service
      if (postId) {
        // For Instagram thumbnails, we'd need to use a proxy service
        // For now, use a placeholder with branding colors
        const thumbnail = `https://placehold.co/480x600/e4405f/ffffff?text=Instagram+${postId.substring(0, 8)}`; // 4:5 aspect ratio
        return { type, thumbnail };
      }
    }
    
    // Instagram reel - always portrait format
    if (url.includes('instagram.com/reel/')) {
      const type = 'instagram-portrait';
      let postId = '';
      
      // Try to extract the reel ID
      const matches = url.match(/\/reel\/(([\w-]+)\/?)/);
      if (matches && matches[1]) {
        postId = matches[1].replace(/\/$/, ''); // Remove trailing slash if present
      }
      
      if (postId) {
        // For Instagram thumbnails, we'd need to use a proxy service
        // For now, use a placeholder with branding colors
        const thumbnail = `https://placehold.co/480x600/e4405f/ffffff?text=Instagram+Reel+${postId.substring(0, 8)}`; // 4:5 aspect ratio
        return { type, thumbnail };
      }
    }
    
    // Image URL detection (if URL ends with image extension)
    if (/\.(jpeg|jpg|gif|png|webp)$/i.test(url)) {
      return { type: 'image', thumbnail: url };
    }
    
    // Default case - unrecognized URL
    return { type: 'unknown', thumbnail: '' };
  } catch (error) {
    console.error('Error detecting media info:', error);
    return { type: 'unknown', thumbnail: '' };
  }
};

export default function MediaEditor() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editMediaId, setEditMediaId] = useState<number | null>(null);
  const [items, setItems] = useState<Media[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [mediaFilter, setMediaFilter] = useState<string>("all");
  
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["/api/media"],
    queryFn: () => apiRequest<Media[]>({ url: "/api/media" }),
    refetchInterval: 2000, // More frequent refetching to quickly reflect changes
    staleTime: 0, // Consider data stale immediately
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
  
  // Update items when data is loaded
  useEffect(() => {
    if (mediaItems) {
      setItems(mediaItems);
      // Extract unique media types
      const types = new Set<string>();
      mediaItems.forEach(item => {
        // Detect type from URL
        const { type } = detectMediaInfo(item.mediaUrl);
        types.add(type);
      });
      setMediaTypes(Array.from(types));
    }
  }, [mediaItems]);

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      mediaUrl: "",
      thumbnailUrl: "",
      embedUrl: ""
    },
  });

  const createMediaMutation = useMutation({
    mutationFn: (data: MediaFormValues) => {
      return apiRequest({
        url: "/api/media",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Media created",
        description: "Media item has been created successfully.",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create media:", error);
      toast({
        title: "Error",
        description: "Failed to create media. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MediaFormValues> }) => {
      return apiRequest({
        url: `/api/media/${id}`,
        method: "PUT",
        data,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      queryClient.invalidateQueries({ queryKey: [`/api/media/${variables.id}`] });
      toast({
        title: "Media updated",
        description: "Media item has been updated successfully.",
      });
      form.reset();
      setEditMediaId(null);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update media:", error);
      toast({
        title: "Error",
        description: "Failed to update media. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest({
        url: `/api/media/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Media deleted",
        description: "Media item has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete media:", error);
      toast({
        title: "Error",
        description: "Failed to delete media. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (media: Media) => {
    setEditMediaId(media.id);
    form.reset({
      title: media.title,
      description: media.description || "",
      mediaUrl: media.mediaUrl,
      thumbnailUrl: media.thumbnailUrl || "",
      embedUrl: media.embedUrl || ""
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      deleteMediaMutation.mutate(id);
    }
  };

  const onSubmit = (values: MediaFormValues) => {
    // Auto-detect media type and generate thumbnail if not provided
    if (!values.thumbnailUrl && values.mediaUrl) {
      const { thumbnail } = detectMediaInfo(values.mediaUrl);
      if (thumbnail) {
        values.thumbnailUrl = thumbnail;
      }
    }
    
    // For YouTube videos, generate the embed URL if not provided
    if ((!values.embedUrl || values.embedUrl === '') && values.mediaUrl && 
        (values.mediaUrl.includes('youtube.com') || values.mediaUrl.includes('youtu.be'))) {
      try {
        // Use our shared utility function for consistency
        const embedUrl = getYoutubeEmbedUrl(values.mediaUrl);
        if (embedUrl) {
          values.embedUrl = embedUrl;
        }
      } catch (error) {
        console.error('Error extracting YouTube video ID:', error);
        // Let the backend handle it if there's an error
      }
    }
    
    if (editMediaId) {
      updateMediaMutation.mutate({ id: editMediaId, data: values });
    } else {
      createMediaMutation.mutate(values);
    }
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setEditMediaId(null);
    }
    setOpen(open);
  };

  // Function to handle reordering of media items
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
    
    // Update ALL items with their new positions to ensure consistency
    // We'll use Promise.all to update all items in parallel
    Promise.all(
      updatedItems.map((item, index) => 
        apiRequest({
          url: `/api/media/${item.id}`,
          method: "PUT",
          data: { displayOrder: index },
        })
      )
    ).then(() => {
      // Force an immediate refetch of media data
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      queryClient.refetchQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Order updated",
        description: "All media items have been reordered. This will be reflected in the carousel display.",
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

  const getFilteredItems = () => {
    if (mediaFilter === "all") return items;
    
    // Filter based on detected type
    return items.filter(item => {
      const { type } = detectMediaInfo(item.mediaUrl);
      return type === mediaFilter;
    });
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading media items...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Manage media items including videos, reels, and images
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={onDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Add New Media</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95vw]">
                <DialogHeader>
                  <DialogTitle className="text-xl">{editMediaId ? "Edit Media" : "Add New Media"}</DialogTitle>
                  <DialogDescription className="text-sm">
                    Fill in the details for the media item. Media type will be automatically detected from the URL.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 sm:pr-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <textarea 
                              placeholder="Enter description (optional)" 
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mediaUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://..." 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                // Auto-detect thumbnail from URL
                                const url = e.target.value;
                                if (url) {
                                  const { thumbnail } = detectMediaInfo(url);
                                  if (thumbnail) {
                                    form.setValue('thumbnailUrl', thumbnail);
                                  }
                                  
                                  // For YouTube videos, try to generate embed URL on the frontend
                                  if (url.includes('youtube.com') || url.includes('youtu.be')) {
                                    // Use our shared utility function
                                    const embedUrl = getYoutubeEmbedUrl(url);
                                    if (embedUrl) {
                                      form.setValue('embedUrl', embedUrl);
                                    } else {
                                      // If we couldn't extract the video ID, clear the field
                                      form.setValue('embedUrl', '');
                                    }
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Supported formats: YouTube videos, Instagram posts, Instagram reels, and direct image URLs
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Automatically generated from media URL (you can override if needed)
                          </FormDescription>
                          {field.value && (
                            <img 
                              src={field.value} 
                              alt="Thumbnail preview" 
                              className="mt-2 h-20 object-cover rounded"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Embed URL field - automatically generated for YouTube videos */}
                    <FormField
                      control={form.control}
                      name="embedUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Embed URL (for videos)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>
                            For YouTube videos, this will be automatically generated. For custom embeds, you can enter the iframe src URL.
                          </FormDescription>
                          {field.value && (
                            <div className="mt-2 rounded overflow-hidden border border-gray-200">
                              <iframe 
                                src={field.value} 
                                width="100%" 
                                height="169" 
                                title="Video preview" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createMediaMutation.isPending || updateMediaMutation.isPending}>
                        {createMediaMutation.isPending || updateMediaMutation.isPending
                          ? "Saving..."
                          : "Save Media"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">Filter by Type:</label>
            <Select onValueChange={setMediaFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {mediaTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="media-items">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {getFilteredItems().map((media, index) => {
                      const { type } = detectMediaInfo(media.mediaUrl);
                      return (
                        <Draggable key={media.id} draggableId={media.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex flex-col sm:flex-row gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded overflow-hidden">
                                  <img 
                                    src={media.thumbnailUrl} 
                                    alt={media.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{media.title}</h4>
                                  {media.description && (
                                    <p className="text-sm text-gray-600 truncate mt-0.5">{media.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                      {type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end sm:justify-start mt-2 sm:mt-0 border-t sm:border-t-0 pt-2 sm:pt-0 space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEdit(media)}
                                  className="flex-1 sm:flex-none"
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex-1 sm:flex-none text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDelete(media.id)}
                                  disabled={deleteMediaMutation.isPending}
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
                    {getFilteredItems().length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No media items found. Add one to get started.
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 text-sm text-gray-600 px-6 py-3">
          <p>Drag and drop items to change their display order in carousels and galleries.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
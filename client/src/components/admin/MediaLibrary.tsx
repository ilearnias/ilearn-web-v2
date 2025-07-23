import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AdminMediaCarousel from "./AdminMediaCarousel";

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

const mediaFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  mediaUrl: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  embedUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  type: z.enum(['image', 'video']).optional(),
  aspectRatio: z.enum(['landscape', 'portrait', 'square']).optional(),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

// Helper function to detect media type and generate thumbnail URL from video URL
const detectMediaInfo = (url: string): { type: 'image' | 'video', thumbnail: string, aspectRatio: 'landscape' | 'portrait' | 'square', embedUrl?: string } => {
  try {
    // YouTube video
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
      let videoId = '';
      
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
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      return { type: 'video', thumbnail, aspectRatio: 'landscape', embedUrl };
    }
    
    // YouTube Shorts - always portrait format with 9:16 aspect ratio
    if (url.includes('youtube.com/shorts/')) {
      let videoId = '';
      
      // Try to extract the shorts ID
      const matches = url.match(/\/shorts\/([\w-]+)/);
      if (matches && matches[1]) {
        videoId = matches[1];
      }
      
      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      return { type: 'video', thumbnail, aspectRatio: 'portrait', embedUrl };
    }
    
    // Instagram post/reel - treat as portrait video with 9:16 ratio for mobile optimization
    if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
      const type = 'video';
      let postId = '';
      
      // Try to extract the post/reel ID
      const regex = url.includes('/reel/') ? /\/reel\/([\w-]+)/ : /\/p\/([\w-]+)/;
      const matches = url.match(regex);
      if (matches && matches[1]) {
        postId = matches[1].replace(/\/$/, ''); // Remove trailing slash if present
      }
      
      // For Instagram, we'd typically need to use their API for proper thumbnails
      // For now, we'll use the URL itself but in a real app, consider using a proper API
      return { type, thumbnail: url, aspectRatio: 'portrait' };
    }
    
    // Image URL detection (if URL ends with image extension)
    if (/\.(jpeg|jpg|gif|png|webp)$/i.test(url)) {
      // Try to detect aspect ratio from the URL itself or use a default
      let aspectRatio: 'landscape' | 'portrait' | 'square' = 'landscape';
      
      // If URL contains specific keywords
      if (url.includes('portrait') || url.includes('vertical')) {
        aspectRatio = 'portrait'; // 9:16 ratio for portrait images
      } else if (url.includes('square')) {
        aspectRatio = 'square';   // 1:1 ratio for square images
      } else {
        aspectRatio = 'landscape'; // 16:9 ratio for landscape images (default)
      }
      
      return { type: 'image', thumbnail: url, aspectRatio };
    }
    
    // Default case - unrecognized URL
    return { type: 'image', thumbnail: '', aspectRatio: 'landscape' };
  } catch (error) {
    console.error('Error detecting media info:', error);
    return { type: 'image', thumbnail: '', aspectRatio: 'landscape' };
  }
};

export default function MediaLibrary() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editMediaId, setEditMediaId] = useState<number | null>(null);
  const [items, setItems] = useState<Media[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [mediaFilter, setMediaFilter] = useState<string>("all");
  
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["/api/media"],
    queryFn: () => apiRequest<Media[]>({ url: "/api/media" }),
  });
  
  // Update items when data is loaded
  useEffect(() => {
    if (mediaItems) {
      setItems(mediaItems);
      // Extract unique media types
      const types = new Set<string>();
      mediaItems.forEach(item => {
        types.add(item.type);
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
      embedUrl: "",
      type: "image",
      aspectRatio: "landscape"
    },
  });

  const createMediaMutation = useMutation({
    mutationFn: (data: MediaFormValues) => {
      // Process the media data before sending to API
      const processedData = { ...data };
      
      // Auto-detect type and aspect ratio if not explicitly set
      if (!processedData.type || !processedData.aspectRatio) {
        const { type, aspectRatio } = detectMediaInfo(processedData.mediaUrl);
        if (!processedData.type) processedData.type = type;
        if (!processedData.aspectRatio) processedData.aspectRatio = aspectRatio;
      }
      
      // Generate thumbnail if not provided
      if (!processedData.thumbnailUrl) {
        const { thumbnail } = detectMediaInfo(processedData.mediaUrl);
        if (thumbnail) processedData.thumbnailUrl = thumbnail;
      }
      
      // Generate embed URL for videos if not provided
      if (processedData.type === 'video' && !processedData.embedUrl && 
          (processedData.mediaUrl.includes('youtube.com') || processedData.mediaUrl.includes('youtu.be'))) {
        const { embedUrl } = detectMediaInfo(processedData.mediaUrl);
        if (embedUrl) processedData.embedUrl = embedUrl;
      }
      
      return apiRequest({
        url: "/api/media",
        method: "POST",
        data: processedData,
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
      // Process the media data before sending to API
      const processedData = { ...data };
      
      // Auto-detect type and aspect ratio if changing URL
      if (processedData.mediaUrl) {
        const { type, aspectRatio } = detectMediaInfo(processedData.mediaUrl);
        // Only update if not explicitly set by user
        if (!processedData.type) processedData.type = type;
        if (!processedData.aspectRatio) processedData.aspectRatio = aspectRatio;
        
        // Generate thumbnail if URL changed and thumbnail not provided
        if (!processedData.thumbnailUrl) {
          const { thumbnail } = detectMediaInfo(processedData.mediaUrl);
          if (thumbnail) processedData.thumbnailUrl = thumbnail;
        }
        
        // Generate embed URL for videos if URL changed and embed not provided
        if ((processedData.type === 'video' || type === 'video') && !processedData.embedUrl && 
            (processedData.mediaUrl.includes('youtube.com') || processedData.mediaUrl.includes('youtu.be'))) {
          const { embedUrl } = detectMediaInfo(processedData.mediaUrl);
          if (embedUrl) processedData.embedUrl = embedUrl;
        }
      }
      
      return apiRequest({
        url: `/api/media/${id}`,
        method: "PUT",
        data: processedData,
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
    onSuccess: () => {
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
      embedUrl: media.embedUrl || "",
      type: media.type,
      aspectRatio: media.aspectRatio
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
    
    // Auto-detect media type and aspect ratio if not explicitly set
    if ((!values.type || !values.aspectRatio) && values.mediaUrl) {
      const { type, aspectRatio } = detectMediaInfo(values.mediaUrl);
      if (!values.type) values.type = type;
      if (!values.aspectRatio) values.aspectRatio = aspectRatio;
    }
    
    // For YouTube videos, generate the embed URL if not provided
    if ((!values.embedUrl || values.embedUrl === '') && values.mediaUrl && 
        (values.mediaUrl.includes('youtube.com') || values.mediaUrl.includes('youtu.be'))) {
      const { embedUrl } = detectMediaInfo(values.mediaUrl);
      if (embedUrl) values.embedUrl = embedUrl;
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

  const getFilteredItems = () => {
    if (mediaFilter === "all") return items;
    return items.filter(item => item.type === mediaFilter);
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading media items...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="carousel" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="carousel">Carousel</TabsTrigger>
          <TabsTrigger value="library">Media Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="carousel" className="space-y-6">
          <AdminMediaCarousel />
        </TabsContent>
        
        <TabsContent value="library" className="space-y-6">
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
                        <div className="mt-2 p-2 bg-blue-50 rounded-md text-blue-800 text-xs">
                          <strong>Note:</strong> For hero videos, use portrait (9:16) for best mobile experience.
                          The video player uses a 4:5 container but accommodates all aspect ratios.
                          Optimal resolutions: Portrait (1080×1920), Landscape (1920×1080), Square (1080×1080)
                        </div>
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
                                    // Auto-detect media info from URL
                                    const url = e.target.value;
                                    if (url) {
                                      const { thumbnail, type, aspectRatio, embedUrl } = detectMediaInfo(url);
                                      if (thumbnail) {
                                        form.setValue('thumbnailUrl', thumbnail);
                                      }
                                      if (type) {
                                        form.setValue('type', type);
                                      }
                                      if (aspectRatio) {
                                        form.setValue('aspectRatio', aspectRatio);
                                      }
                                      if (embedUrl) {
                                        form.setValue('embedUrl', embedUrl);
                                      }
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a direct image URL or video link (YouTube, Instagram)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Media Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="aspectRatio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Aspect Ratio</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select aspect ratio" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                                    <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                                    <SelectItem value="square">Square (1:1)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  For hero videos, use portrait (9:16) for mobile optimization
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thumbnail URL (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://..." 
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Leave empty to auto-generate from media URL
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {form.watch('type') === 'video' && (
                          <FormField
                            control={form.control}
                            name="embedUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Embed URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="https://..." 
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Leave empty to auto-generate for YouTube videos
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <DialogFooter className="mt-6">
                          <Button type="submit">{editMediaId ? "Update Media" : "Add Media"}</Button>
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
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-6">
                {getFilteredItems().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No media items found. Add one to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredItems().map((media) => {
                      return (
                        <div
                          key={media.id}
                          className="relative rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-48">
                            <img 
                              src={media.thumbnailUrl || media.mediaUrl} 
                              alt={media.title}
                              className="w-full h-full object-cover"
                            />
                            {media.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-primary-red/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5.14v14l11-7-11-7z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <Button 
                                variant="secondary" 
                                size="icon" 
                                className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                                onClick={() => handleEdit(media)}
                              >
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="icon" 
                                className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-red-500"
                                onClick={() => handleDelete(media.id)}
                              >
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium text-base line-clamp-1">{media.title}</h3>
                            <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                              <span>{media.type} · {media.aspectRatio}</span>
                              <span>ID: {media.id}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

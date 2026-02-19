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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon, UploadIcon, VideoIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/media-helpers";
import { API } from "@/config/api";

// Type definition for form values
type HeroFormValues = {
  mediaUrl: string;
  title?: string;
  description?: string;
};

// Zod schema for form validation
const heroFormSchema = z.object({
  mediaUrl: z
    .string()
    .optional()
    .refine(
      (url) => !url || url === "" || url.startsWith("/uploads/") || url.includes("youtube.com") || url.includes("youtu.be") || /\.(mp4|webm|ogg|mov)$/i.test(url), 
      {
        message: "URL must be a YouTube video, uploaded file, or a direct video file (mp4, webm, ogg, mov)",
      }),
  title: z.string().optional(),
  description: z.string().optional(),
});

// Type for upload progress state
type FileUploadState = {
  uploading: boolean;
  progress: number;
  file: File | null;
  error: string | null;
  url: string | null;
};

export default function HeroSectionEditor() {
  const queryClient = useQueryClient();
  const [playerWidth, setPlayerWidth] = useState<number>(0);
  const [playerHeight, setPlayerHeight] = useState<number>(0);
  const [uploadState, setUploadState] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    file: null,
    error: null,
    url: null,
  });
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        setUploadState({
          ...uploadState,
          error: 'Please select a video file (MP4, WebM, or MOV)',
          file: null,
        });
        return;
      }

      // Check file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setUploadState({
          ...uploadState,
          error: 'File is too large. Maximum size is 50MB',
          file: null,
        });
        return;
      }

      setUploadState({
        ...uploadState,
        file,
        error: null,
      });
    }
  };

  // Reset file input
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadState({
      uploading: false,
      progress: 0,
      file: null,
      error: null,
      url: null,
    });
  };

  // Upload file mutation
  const uploadVideoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('video', file);

      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadState(prev => ({ ...prev, progress }));
          }
        });

        // Handle response
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        // Handle errors
        xhr.onerror = () => {
          reject(new Error('Upload failed due to network error'));
        };

        // Open and send request
        xhr.open('POST', API.BASEURL + 'upload/video', true);
        const token = localStorage.getItem('adminToken');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    onMutate: () => {
      setUploadState(prev => ({ ...prev, uploading: true, progress: 0 }));
    },
    onSuccess: (url) => {
      form.setValue('mediaUrl', url);
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        url, 
        progress: 100 
      }));
      toast({
        title: 'Video uploaded successfully',
        description: 'The video has been uploaded and added to the form.',
      });
      setActiveTab('url'); // Switch to URL tab to show the preview
    },
    onError: (error) => {
      console.error('Failed to upload video:', error);
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        error: 'Failed to upload video. Please try again.'
      }));
      toast({
        title: 'Upload failed',
        description: 'Failed to upload video. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Responsive sizing for preview player
  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = 16 / 9;
      const maxWidth = Math.min(window.innerWidth - 80, 800);
      setPlayerWidth(maxWidth);
      setPlayerHeight(maxWidth / aspectRatio);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Query to get current hero video settings
  const { data: heroVideoUrl, isLoading: isLoadingVideo } = useQuery({
    queryKey: ["site-settings/hero_video_url"],
    queryFn: () => apiRequest({ url: "site-settings/hero_video_url" })
  });

  const { data: heroVideoPoster, isLoading: isLoadingPoster } = useQuery({
    queryKey: ["site-settings/hero_video_poster"],
    queryFn: () => apiRequest({ url: "site-settings/hero_video_poster" })
  });

  const { data: heroTitle, isLoading: isLoadingTitle } = useQuery({
    queryKey: ["site-settings/hero_title"],
    queryFn: () => apiRequest({ url: "site-settings/hero_title" })
  });

  const { data: heroDescription, isLoading: isLoadingDescription } = useQuery({
    queryKey: ["site-settings/hero_description"],
    queryFn: () => apiRequest({ url: "site-settings/hero_description" })
  });
  
  // Determine if all data is loading
  const isLoading = isLoadingVideo || isLoadingPoster || isLoadingTitle || isLoadingDescription;

  // Setup form with existing data
  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      mediaUrl: "",
      title: "",
      description: "",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (!isLoading && heroVideoUrl && heroTitle && heroDescription) {
      form.reset({
        mediaUrl: heroVideoUrl.value || "",
        title: heroTitle.value || "",
        description: heroDescription.value || "",
      });
    }
  }, [heroVideoUrl, heroTitle, heroDescription, isLoading, form]);

  // Mutation to update hero settings
  const updateHeroMutation = useMutation({
    mutationFn: async (data: HeroFormValues) => {
      const results = await Promise.all([
        // Update video URL
        apiRequest({
          url: "site-settings/hero_video_url",
          method: "PATCH",
          data: { value: data.mediaUrl },
        }),
        // Update title
        apiRequest({
          url: "site-settings/hero_title",
          method: "PATCH",
          data: { value: data.title },
        }),
        // Update description
        apiRequest({
          url: "site-settings/hero_description",
          method: "PATCH",
          data: { value: data.description },
        }),
      ]);
      return results;
    },
    onSuccess: () => {
      // Invalidate all hero settings queries
      queryClient.invalidateQueries({ queryKey: ["site-settings/hero_video_url"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings/hero_video_poster"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings/hero_title"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings/hero_description"] });
      
      toast({
        title: "Hero section updated",
        description: "The hero section has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to update hero section:", error);
      toast({
        title: "Error",
        description: "Failed to update hero section. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: HeroFormValues) => {
    updateHeroMutation.mutate(data);
  };

  // Get resolution info for video
  const getResolutionInfo = () => {
    const mediaUrl = form.watch("mediaUrl");
    
    if (!mediaUrl) return "";
    
    if (mediaUrl.includes("youtube.com/shorts")) {
      return "YouTube Shorts are displayed in portrait mode (9:16 ratio) within a 4:5 container. For optimal quality, use high-resolution Shorts.";
    } else if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
      return "YouTube videos are displayed in a 4:5 container that adapts to different aspect ratios. For optimal quality in landscape mode, use videos with 1080p (1920×1080) resolution.";
    }
    
    return "Videos are displayed in a 4:5 container that adapts to different aspect ratios. For optimal quality, use portrait videos (9:16) with 1080×1920 resolution or landscape videos (16:9) with 1920×1080 resolution.";
  };

  // Extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    
    let videoId = "";
    
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("/").pop() || "";
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url; // Return original URL if not YouTube
  };

  // Loading state
  if (isLoading) {
    return <div className="py-8 text-center">Loading hero settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Video</CardTitle>
          <CardDescription>
            Manage the main video displayed in the hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Preview */}
          {form.watch("mediaUrl") && (
            <div className="space-y-4">
              <h3 className="text-base font-medium">Preview</h3>
              <div className="rounded-lg overflow-hidden border shadow-sm mx-auto" style={{ maxWidth: "100%" }}>
                {form.watch("mediaUrl").includes("youtube") ? (
                  <iframe
                    width={playerWidth}
                    height={playerHeight}
                    src={getEmbedUrl(form.watch("mediaUrl"))}
                    title="Hero Video Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="mx-auto"
                  ></iframe>
                ) : (
                  <video
                    width={playerWidth}
                    height={playerHeight}
                    controls
                    className="mx-auto"
                  >
                    <source src={form.watch("mediaUrl")} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Resolution Info Card */}
          <Alert className="bg-blue-50 border-blue-200">
            <InfoCircledIcon className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Video Requirements</AlertTitle>
            <AlertDescription className="text-blue-700">
              {getResolutionInfo()}
              <ul className="list-disc list-inside mt-2 text-sm">
                <li><strong>Portrait mode videos</strong> are recommended for mobile-first design (9:16 ratio, optimal: 1080×1920)</li>
                <li>Video player uses a 4:5 container that adapts to different aspect ratios</li>
                <li>Landscape videos (16:9, optimal: 1920×1080) and square videos (1:1, optimal: 1080×1080) are also supported</li>
                <li>For YouTube videos, use standard watch URLs, short URLs, or YouTube Shorts</li>
                <li>For direct video files, ensure they are in MP4, WebM, or MOV format</li>
                <li>Compress your video for faster loading times (max size: 50MB)</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Edit Form */}
          <div className="mt-6">
            <h3 className="text-base font-medium mb-4">Edit Hero Video</h3>
            
            {/* Tabs for URL / Upload options */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "url" | "upload")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Enter URL</TabsTrigger>
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
              </TabsList>
              
              {/* URL Input Tab */}
              <TabsContent value="url" className="pt-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mediaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a YouTube URL or direct link to a video file (MP4, WebM, MOV)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* File Upload Tab */}
              <TabsContent value="upload" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary/60 transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="video/*"
                      className="hidden"
                      disabled={uploadState.uploading}
                    />
                    
                    {!uploadState.file ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center py-4">
                        <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-base font-medium">Click to select a video file</p>
                        <p className="text-sm text-gray-500">or drag and drop a file here</p>
                        <p className="text-xs text-gray-400 mt-2">MP4, WebM, or MOV format (max 50MB)</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <VideoIcon className="h-6 w-6 text-primary mr-2" />
                            <div className="text-left">
                              <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-sm">{uploadState.file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(uploadState.file.size)}</p>
                            </div>
                          </div>
                          
                          {!uploadState.uploading && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={resetFileInput}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        
                        {uploadState.uploading && (
                          <div className="space-y-2">
                            <Progress value={uploadState.progress} className="h-2" />
                            <p className="text-xs text-gray-500 text-right">{uploadState.progress}% uploaded</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {uploadState.error && (
                    <p className="text-sm text-red-500">{uploadState.error}</p>
                  )}
                  
                  <Button 
                    type="button" 
                    className="w-full"
                    disabled={!uploadState.file || uploadState.uploading}
                    onClick={() => uploadState.file && uploadVideoMutation.mutate(uploadState.file)}
                  >
                    {uploadState.uploading ? "Uploading..." : "Upload Video"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Title and Description Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="hidden">
                  <FormField
                    control={form.control}
                    name="mediaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Hero title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A title to display with the hero video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a description for the hero section" 
                          className="resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description to display with the hero video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto"
                    disabled={updateHeroMutation.isPending}
                  >
                    {updateHeroMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 text-sm text-gray-600 px-6 py-3">
          <p>Changes will be immediately visible on the homepage.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

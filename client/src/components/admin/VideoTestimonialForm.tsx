import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { extractYoutubeVideoId, getYoutubeThumbnailUrl } from "@/lib/media-helpers";

// Type definition for form values
type TestimonialFormValues = {
  name: string;
  rank: string;
  video: string;
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

interface VideoTestimonialFormProps {
  onSuccess: () => void;
  programName?: string; // Optional program name to pre-fill
  programId?: number; // Optional program ID to associate this testimonial with
}

export default function VideoTestimonialForm({ onSuccess, programName = "UPSC CSE", programId }: VideoTestimonialFormProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

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
      setPreviewVideoId(null);
      setPreviewThumbnail(null);
    }
  };

  // Watch the video field for preview
  const videoUrl = form.watch("video");
  
  // Update preview whenever video URL changes
  const handleVideoPreview = () => {
    const videoUrl = form.getValues("video");
    if (!videoUrl) return;
    
    const videoId = extractYoutubeVideoId(videoUrl);
    if (videoId) {
      setPreviewVideoId(videoId);
      setPreviewThumbnail(getYoutubeThumbnailUrl(videoUrl));
    }
  };

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest({
        url: "testimonials",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      // Invalidate general testimonials queries
      queryClient.invalidateQueries({ queryKey: ["testimonials", "video"] });
      
      // If we have a program ID, invalidate program-specific testimonials as well
      if (programId) {
        queryClient.invalidateQueries({ queryKey: [`admin/programs/${programId}/testimonials`] });
        queryClient.invalidateQueries({ queryKey: [`admin/programs/${programId}/testimonials`, 'video'] });
      }
      
      toast({
        title: "Video testimonial added",
        description: "The video testimonial has been added successfully.",
      });
      setOpen(false);
      onSuccess(); // Call the onSuccess callback to notify parent component
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

  // Handle form submission
  const onSubmit = (data: TestimonialFormValues) => {
    const thumbnailUrl = previewThumbnail || getYoutubeThumbnailUrl(data.video, 'hqdefault') || '';
    
    // Determine if the video is a YouTube Short (portrait) or regular video (landscape)
    const isPortrait = data.video.includes('youtube.com/shorts/');
    const videoType = isPortrait ? "portrait-video" : "landscape-video";
    
    createTestimonialMutation.mutate({ 
      ...data, 
      type: videoType,
      program: programName,
      quote: "",
      year: new Date().getFullYear(),
      image: thumbnailUrl, // Set the YouTube thumbnail as the image
      programId: programId, // Associate this testimonial with the program
    });
  };

  return (
    <Dialog open={open} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Add New Video Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Video Testimonial</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter student name" {...field} />
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
                    <Input placeholder="e.g. AIR 5, AIR 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Video URL</FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        {...field} 
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleVideoPreview}
                    >
                      Preview
                    </Button>
                  </div>
                  <FormDescription>
                    Enter a YouTube video URL. Both regular landscape videos and portrait Shorts are supported.
                    For a consistent look on program pages, consider using YouTube Shorts (portrait format) for testimonials.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewVideoId && (
              <div className="rounded-md overflow-hidden border mt-4">
                <p className="text-sm font-medium p-2 bg-gray-50">Video Preview</p>
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${previewVideoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={createTestimonialMutation.isPending}
              >
                {createTestimonialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add Testimonial"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

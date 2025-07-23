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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

// Type definition for form values
type TestimonialFormValues = {
  name: string;
  rank: string;
  quote: string;
  image: string;
};

// Zod schema for form validation
const testimonialFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  rank: z.string().min(1, { message: "AIR Rank is required" }),
  quote: z.string().min(10, { message: "Quote must be at least 10 characters long" }),
  image: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine(
      (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url),
      { message: "URL must point to an image file (jpg, png, webp, etc.)" }
    ),
});

interface ImageTestimonialFormProps {
  onSuccess: () => void;
  programName?: string; // Optional program name to pre-fill
  programId?: number; // Optional program ID to associate this testimonial with
}

export default function ImageTestimonialForm({ onSuccess, programName = "UPSC CSE", programId }: ImageTestimonialFormProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Setup form with default values
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      rank: "",
      quote: "",
      image: "",
    },
  });

  // Reset form when dialog opens/closes
  const onDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setPreviewImage(null);
    }
  };

  // Handle image preview
  const handleImagePreview = () => {
    const imageUrl = form.getValues("image");
    if (!imageUrl) return;
    
    if (/\.(jpeg|jpg|gif|png|webp)$/i.test(imageUrl)) {
      // First verify it's a valid image URL
      setPreviewImage(imageUrl);
      
      // Create an image element to check dimensions when loaded
      const img = new Image();
      img.onload = () => {
        // Check if the image is portrait orientation (height > width)
        if (img.height < img.width) {
          toast({
            title: "Warning: Image Orientation",
            description: "This image appears to be in landscape format. Portrait orientation (3:4 ratio) is recommended for testimonials.",
            variant: "destructive",
          });
        }
      };
      img.src = imageUrl;
    } else {
      setPreviewImage(null);
      toast({
        title: "Invalid image URL",
        description: "The URL must point to an image file (jpg, png, webp, etc.)",
        variant: "destructive",
      });
    }
  };

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest({
        url: "/api/testimonials",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      // Invalidate general testimonials queries
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials", "image"] });
      
      // If we have a program ID, invalidate program-specific testimonials as well
      if (programId) {
        queryClient.invalidateQueries({ queryKey: [`/api/programs/${programId}/testimonials`] });
        queryClient.invalidateQueries({ queryKey: [`/api/programs/${programId}/testimonials`, 'student'] });
      }
      
      toast({
        title: "Student testimonial added",
        description: "The student testimonial has been added successfully.",
      });
      setOpen(false);
      onSuccess(); // Call the onSuccess callback to notify parent component
    },
    onError: (error) => {
      console.error("Failed to add student testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to add student testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: TestimonialFormValues) => {
    createTestimonialMutation.mutate({ 
      ...data, 
      type: "image",
      program: programName,
      year: new Date().getFullYear(),
      programId: programId, // Associate this testimonial with the program
    });
  };

  return (
    <Dialog open={open} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Add New Student Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student Testimonial</DialogTitle>
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
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonial Quote</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the student's testimonial..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Image URL</FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleImagePreview}
                    >
                      Preview
                    </Button>
                  </div>
                  <FormDescription>
                    Enter an image URL (jpg, png, webp, etc.). Use portrait orientation images similar to the Success Stories on the homepage. Recommended size is 3:4 aspect ratio (e.g., 600x800px).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewImage && (
              <div className="rounded-md overflow-hidden border mt-4">
                <p className="text-sm font-medium p-2 bg-gray-50">Image Preview (3:4 Portrait Format)</p>
                <div className="p-2 flex justify-center">
                  <div className="relative w-[150px] h-[200px] border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
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

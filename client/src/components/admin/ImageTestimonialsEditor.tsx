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

// Type definition for Testimonial
type Testimonial = {
  id: number;
  name: string;
  rank: string;
  program: string;
  quote: string;
  year: number;
  image: string;
  type: string;
  displayOrder?: number;
  createdAt: string;
};

// Type definition for form values
type TestimonialFormValues = {
  image: string;
};

// Zod schema for form validation
const testimonialFormSchema = z.object({
  image: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine(
      (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url),
      { message: "URL must point to an image file (jpg, png, webp, etc.)" }
    ),
});

export default function ImageTestimonialsEditor() {
  const queryClient = useQueryClient();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const [editTestimonialId, setEditTestimonialId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Query to fetch image testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials", "image"],
    queryFn: () => apiRequest<Testimonial[]>({ 
      url: "testimonials?type=image"
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
      image: "",
    },
  });

  // Reset form when dialog opens/closes
  const onDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditTestimonialId(null);
      setPreviewImage(null);
    }
  };

  // Function to handle editing a testimonial
  const handleEdit = (testimonial: Testimonial) => {
    setEditTestimonialId(testimonial.id);
    form.reset({
      image: testimonial.image,
    });
    
    // Set preview image
    setPreviewImage(testimonial.image);
    
    setOpen(true);
  };

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: (data: TestimonialFormValues & { type: string; name: string; rank: string; program: string; quote: string; year: number }) => {
      return apiRequest({
        url: "testimonials",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials", "image"] });
      // Do NOT invalidate video testimonials as they are completely separate
      toast({
        title: "Image testimonial added",
        description: "The image testimonial has been added successfully.",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to add image testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to add image testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TestimonialFormValues> }) => {
      return apiRequest({
        url: `testimonials/${id}`,
        method: "PATCH",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials", "image"] });
      // Do NOT invalidate video testimonials as they are completely separate
      toast({
        title: "Image testimonial updated",
        description: "The image testimonial has been updated successfully.",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update image testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to update image testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest({
        url: `testimonials/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials", "image"] });
      // Do NOT invalidate video testimonials as they are completely separate
      toast({
        title: "Image testimonial deleted",
        description: "The image testimonial has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete image testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to delete image testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: TestimonialFormValues) => {
    if (editTestimonialId !== null) {
      updateTestimonialMutation.mutate({ id: editTestimonialId, data });
    } else {
      // @ts-ignore - adding required fields for API compatibility
      createTestimonialMutation.mutate({ 
        ...data, 
        type: "image",
        name: "Success Story",
        rank: "",
        program: "UPSC CSE",
        quote: "",
        year: new Date().getFullYear()
      });
    }
  };

  // Handle delete confirmation
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this image testimonial? This action cannot be undone.")) {
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
    
    // Update all items with their new positions in sequential order to avoid race conditions
    const updateSequentially = async () => {
      try {
        for (let i = 0; i < updatedItems.length; i++) {
          const item = updatedItems[i];
          await apiRequest({
            url: `testimonials/${item.id}`,
            method: "PATCH",
            data: { 
              displayOrder: i,
              type: item.type || "image" // Ensure type is included
            },
          });
        }
        
        // Force invalidate after all updates are complete
        await queryClient.invalidateQueries({ queryKey: ["testimonials", "image"] });
        
        toast({
          title: "Order updated",
          description: "The display order has been updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update display order:", error);
        toast({
          title: "Error",
          description: "Failed to update display order. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    // Execute the sequential update function
    updateSequentially();
  };

  // Function to handle image URL change for preview
  const handleImageUrlChange = (url: string) => {
    setPreviewImage(url);
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
    return <div className="py-8 text-center">Loading image testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <CardTitle>Image Testimonials</CardTitle>
              <CardDescription>
                Manage image testimonials for success stories section
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={onDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Add New Image Testimonial</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editTestimonialId ? "Edit Image Testimonial" : "Add New Image Testimonial"}</DialogTitle>
                  <DialogDescription>
                    Upload an image containing success story testimonial content.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleImageUrlChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a direct URL to an image containing testimonial content
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Image Preview */}
                    {previewImage && (
                      <div className="border rounded-md p-2 mt-2">
                        <p className="text-sm font-medium mb-2">Image Preview:</p>
                        <div className="h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain"
                            onError={() => setPreviewImage(null)}
                          />
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
          {/* Image Requirements Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <InfoCircledIcon className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Image Requirements</AlertTitle>
            <AlertDescription className="text-blue-700">
              For optimal display in the image testimonials carousel:
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Upload landscape format images (16:9 aspect ratio) for testimonial cards</li>
                <li>Recommended resolution: 800×450 pixels</li>
                <li>Maximum file size: 200KB for quick loading</li>
                <li>Use PNG or JPG format for best quality</li>
                <li>Ensure testimonial text is legible in the image as this is what will be displayed</li>
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
                {items.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <div className="h-40 overflow-hidden bg-gray-100">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback for broken images
                          e.currentTarget.src = "https://via.placeholder.com/800x450?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold truncate">{testimonial.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">{testimonial.rank}</span>
                        <span className="text-xs text-gray-500">{testimonial.year}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{testimonial.quote}</p>
                    </div>
                  </div>
                ))}
                
                {items.length === 0 && (
                  <div className="flex-1 py-10 text-center text-gray-500">
                    No image testimonials found. Add one to get started.
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
                    {items.map((testimonial, index) => (
                      <Draggable key={testimonial.id} draggableId={testimonial.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm group"
                            style={{
                              width: '120px',
                              height: '90px',
                              ...provided.draggableProps.style
                            }}
                          >
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/120x90?text=No+Image";
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-white text-xs truncate">
                              {testimonial.name}
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
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No image testimonials found. Add one to get started.
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

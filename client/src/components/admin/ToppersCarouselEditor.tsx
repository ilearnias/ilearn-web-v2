import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
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
import { API } from "@/config/api";
// For debugging
import { useEffect as useEffectDebug } from 'react';

// Type definition for Topper
type Topper = {
  id: number;
  name: string;
  rank: number;
  program: string;
  year: number;
  image: string;
  testimonial?: string;
  scorecard?: string;
  displayOrder?: number;
  createdAt: string;
};

// Type definition for form values
type TopperFormValues = {
  name: string;
  rank: number;
  program: string;
  year: number;
  image: string;
  testimonial?: string;
  scorecard?: string;
  displayOrder?: number;
};

// Zod schema for form validation
const topperFormSchema = z.object({
  // Keep only the essential fields required for the topper
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  rank: z.coerce.number().int().positive({ message: "Rank must be a positive integer" }),
  image: z.string().min(1, { message: "Image is required" })
    .or(z.literal("").transform(() => ""))
    .refine((val) => val !== "", {
      message: "Image is required",
      path: ["image"]
    }),
  // Default fields with simple validation
  program: z.string().default("UPSC CSE"),
  year: z.coerce.number().default(new Date().getFullYear()),
  // Optional fields
  testimonial: z.string().optional(),
  scorecard: z.string().optional(),
  displayOrder: z.number().optional(),
});

export default function ToppersCarouselEditor() {
  const queryClient = useQueryClient();
  const carouselRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Topper[]>([]);
  const [open, setOpen] = useState(false);
  const [editTopperId, setEditTopperId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Query to fetch toppers
  const { data: toppers, isLoading } = useQuery({
    queryKey: ["admin/achievers"],
    queryFn: () => apiRequest<Topper[]>({ url: "admin/achievers" }),
  });

  // Update state when data is loaded
  useEffect(() => {
    if (toppers) {
      // Sort by displayOrder first, then by rank
      const sortedItems = [...toppers].sort((a, b) => {
        // First sort by displayOrder if both items have it
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        // If only one has displayOrder, prioritize it
        if (a.displayOrder !== undefined) return -1;
        if (b.displayOrder !== undefined) return 1;
        // Fall back to sorting by rank
        return a.rank - b.rank;
      });
      setItems(sortedItems);
    }
  }, [toppers]);

  // Setup form with default values
  const form = useForm<TopperFormValues>({
    resolver: zodResolver(topperFormSchema),
    defaultValues: {
      name: "",
      rank: 0,
      program: "",
      year: new Date().getFullYear(),
      image: "",
      testimonial: "",
      scorecard: "",
    },
  });

  // Reset form when dialog opens/closes
  const onDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditTopperId(null);
      setPreviewImage(null);
    }
  };

  // Function to handle editing a topper
  const handleEdit = (topper: Topper) => {
    setEditTopperId(topper.id);
    form.reset({
      name: topper.name,
      rank: topper.rank,
      program: topper.program,
      year: topper.year,
      image: topper.image,
      testimonial: topper.testimonial || "",
      scorecard: topper.scorecard || "",
      displayOrder: topper.displayOrder,
    });
    setPreviewImage(topper.image);
    setOpen(true);
  };

  // Create topper mutation
  const createTopperMutation = useMutation({
    mutationFn: (data: TopperFormValues) => {
      console.log('Creating topper with data:', data);
      return apiRequest({
        url: "admin/achievers",
        method: "POST",
        data,
      });
    },
    onSuccess: (response) => {
      console.log('Topper created successfully:', response);
      queryClient.invalidateQueries({ queryKey: ["admin/achievers"] });
      toast({
        title: "Topper added",
        description: "The topper has been added successfully.",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to add topper:", error);
      toast({
        title: "Error",
        description: "Failed to add topper. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update topper mutation
  const updateTopperMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TopperFormValues> }) => {
      return apiRequest({
        url: `admin/achievers/${id}`,
        method: "PATCH",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/achievers"] });
      toast({
        title: "Topper updated",
        description: "The topper has been updated successfully.",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update topper:", error);
      toast({
        title: "Error",
        description: "Failed to update topper. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete topper mutation
  const deleteTopperMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest({
        url: `admin/achievers/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/achievers"] });
      toast({
        title: "Topper deleted",
        description: "The topper has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete topper:", error);
      toast({
        title: "Error",
        description: "Failed to delete topper. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: TopperFormValues) => {
    // Add debugging
    console.log('Submitting form with data:', data);
    console.log('Form state:', form.formState);
    
    // Validate image is provided
    if (!data.image) {
      toast({
        title: "Image required",
        description: "Please upload an image for the topper",
        variant: "destructive",
      });
      return;
    }
    
    // Get the number of existing toppers for default displayOrder
    const itemCount = items.length;
    
    // Set default values for program, year, and displayOrder if not provided
    const submitData = {
      ...data,
      program: data.program || 'UPSC CSE',
      year: data.year || new Date().getFullYear(),
      // For new toppers, set displayOrder to be after all existing toppers
      displayOrder: editTopperId !== null ? data.displayOrder : itemCount
    };
    
    console.log('Final submission data:', submitData);
    
    try {
      if (editTopperId !== null) {
        updateTopperMutation.mutate({ id: editTopperId, data: submitData });
      } else {
        createTopperMutation.mutate(submitData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "There was an error saving the topper. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete confirmation
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this topper? This action cannot be undone.")) {
      deleteTopperMutation.mutate(id);
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
          url: `admin/achievers/${item.id}`,
          method: "PATCH",
          data: { displayOrder: index },
        })
      )
    ).then(() => {
      queryClient.invalidateQueries({ queryKey: ["admin/achievers"] });
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

  // Function to handle image URL change for preview
  const handleImageUrlChange = (url: string) => {
    setPreviewImage(url);
  };

  // Handle file selection for image upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size allowed is 2MB",
        variant: "destructive",
      });
      return;
    }
    
    // Upload the file
    uploadImage(file);
  };
  
  // Function to upload image
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Create a promise to handle the XMLHttpRequest
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Upload failed due to network error'));
        };
        
        xhr.open('POST', API.BASEURL + 'upload/image', true);
        const token = localStorage.getItem('adminToken');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
      
      // Wait for upload to complete
      const imageUrl = await uploadPromise;
      
      // Set the image URL in the form
      form.setValue('image', imageUrl);
      setPreviewImage(imageUrl);
      
      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
    return <div className="py-8 text-center">Loading toppers...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <CardTitle>Toppers Carousel</CardTitle>
              <CardDescription>
                Manage UPSC toppers displayed in the carousel
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={onDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Add New Topper</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editTopperId ? "Edit Topper" : "Add New Topper"}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the UPSC topper.
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
                              <Input placeholder="Topper's full name" {...field} />
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
                              <Input type="number" min="1" placeholder="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Hidden but still active fields for program and year */}
                    <input type="hidden" {...form.register('program')} value="UPSC CSE" />
                    <input type="hidden" {...form.register('year')} value={new Date().getFullYear()} />
                    
                    {/* Image Upload */}
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topper Image</FormLabel>
                          <FormDescription>
                            Upload a square image (1:1 aspect ratio) of the topper
                          </FormDescription>
                          <div className="space-y-4">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/jpg"
                              className="hidden"
                              onChange={handleFileSelect}
                              disabled={isUploading}
                            />
                            
                            <div 
                              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary/60 transition-colors relative"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              {!previewImage && !isUploading ? (
                                <div className="flex flex-col items-center justify-center py-4">
                                  <svg
                                    className="h-10 w-10 text-gray-400 mb-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                                    <path d="m9 15 3-3 3 3" />
                                    <path d="m12 12 3-3 3 3" />
                                    <path d="M16 5h6" />
                                    <path d="M19 2v6" />
                                  </svg>
                                  <p className="text-base font-medium">Click to upload image</p>
                                  <p className="text-sm text-gray-500">or drag and drop a file here</p>
                                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, JPEG or WEBP (max 2MB)</p>
                                  <p className="text-xs text-gray-400 mt-1">Square format recommended (1:1)</p>
                                </div>
                              ) : isUploading ? (
                                <div className="py-4 space-y-2">
                                  <div className="flex justify-center">
                                    <svg
                                      className="animate-spin h-8 w-8 text-primary"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-primary h-2.5 rounded-full"
                                      style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-sm text-center text-gray-500">
                                    Uploading... {uploadProgress}%
                                  </p>
                                </div>
                              ) : (
                                <div className="relative py-2">
                                  <img 
                                    src={previewImage || ''} 
                                    alt="Preview" 
                                    className="max-h-64 mx-auto rounded-md"
                                    onError={() => setPreviewImage(null)}
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewImage(null);
                                      field.onChange('');
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                      }
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M18 6L6 18" />
                                      <path d="M6 6l12 12" />
                                    </svg>
                                  </button>
                                  <p className="text-sm text-center text-gray-500 mt-2">
                                    Click to change image
                                  </p>
                                </div>
                              )}
                            </div>
                            <input 
                              type="hidden" 
                              {...field} 
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Hidden fields for testimonial and scorecard */}
                    <div className="hidden">
                      <FormField
                        control={form.control}
                        name="testimonial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Testimonial (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter a testimonial from the topper" 
                                className="resize-y"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="scorecard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scorecard URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/scorecard.pdf" {...field} />
                            </FormControl>
                            <FormDescription>
                              URL to the topper's scorecard document (PDF, image, etc.)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setOpen(false)}
                        disabled={createTopperMutation.isPending || updateTopperMutation.isPending || isUploading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={form.formState.isSubmitting || createTopperMutation.isPending || updateTopperMutation.isPending || isUploading}
                      >
                        {(createTopperMutation.isPending || updateTopperMutation.isPending || isUploading) ? 
                          "Saving..." : 
                          "Save Topper"}
                      </Button>
                    </div>
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
              For optimal display in the toppers carousel:
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Upload square format images (1:1 aspect ratio)</li>
                <li>Recommended resolution: 400x400 pixels</li>
                <li>Maximum file size: 200KB for quick loading</li>
                <li>Use PNG, JPG, JPEG or WEBP format with professional headshots</li>
                <li>For consistent display, crop images to show face and shoulders</li>
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
                {items.map((topper) => (
                  <div 
                    key={topper.id} 
                    className="flex-shrink-0 w-44 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleEdit(topper)}
                  >
                    <div className="h-44 overflow-hidden bg-gray-100">
                      <img 
                        src={topper.image} 
                        alt={topper.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback for broken images
                          e.currentTarget.src = "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold truncate">{topper.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">AIR {topper.rank}</span>
                        <span className="text-xs text-gray-500">{topper.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {items.length === 0 && (
                  <div className="flex-1 py-10 text-center text-gray-500">
                    No toppers found. Add a topper to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reordering Interface */}
          <div className="mt-8">
            <h3 className="text-base font-medium mb-4">Drag and Drop to Reorder</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="toppers" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-4"
                  >
                    {items.map((topper, index) => (
                      <Draggable key={topper.id} draggableId={topper.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm group"
                            style={{
                              width: '100px',
                              height: '125px',
                              ...provided.draggableProps.style
                            }}
                          >
                            <img 
                              src={topper.image} 
                              alt={topper.name}
                              className="w-full h-3/4 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/100x75?text=No+Image";
                              }}
                            />
                            <div className="p-1 text-center overflow-hidden">
                              <p className="text-xs font-medium truncate">{topper.name}</p>
                              <p className="text-xs text-gray-600">AIR {topper.rank}</p>
                            </div>
                            
                            {/* Action overlay */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 space-y-2">
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="w-full h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(topper);
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="w-full h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(topper.id);
                                }}
                                disabled={deleteTopperMutation.isPending}
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
                No toppers found. Add one to get started.
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

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define types for the component
interface AboutPageImage {
  id: number;
  section: string;
  imageUrl: string;
  alt: string | null;
  displayOrder: number;
  createdAt: string;
}

// Form schema for validation
const aboutPageImageSchema = z.object({
  section: z.string().min(1, "Section is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  alt: z.string().optional(),
  displayOrder: z.number().optional(),
});

type FormValues = z.infer<typeof aboutPageImageSchema>;

// Available sections for the About page
const availableSections = [
  { value: 'intro', label: 'Introduction' },
  { value: 'mission', label: 'Mission & Vision' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'campus', label: 'Campus' },
  { value: 'timeline', label: 'Timeline' },
];

const AboutPageImageEditor = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editImageId, setEditImageId] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(aboutPageImageSchema),
    defaultValues: {
      section: 'intro',
      imageUrl: '',
      alt: '',
    },
  });

  // Fetch about page images
  const { data: aboutPageImages = [], isLoading } = useQuery({
    queryKey: ['about-page-images', selectedSection],
    queryFn: async () => {
      const url = selectedSection && selectedSection !== 'all'
        ? `about-page-images?section=${selectedSection}` 
        : 'about-page-images';
      return apiRequest<AboutPageImage[]>({ url });
    },
  });

  // Create a new about page image
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => apiRequest<AboutPageImage>({
      url: 'about-page-images',
      method: 'POST',
      data
    }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Image added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['about-page-images'] });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add image',
        variant: 'destructive',
      });
      console.error('Error adding image:', error);
    },
  });

  // Update an existing about page image
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormValues }) => 
      apiRequest<AboutPageImage>({
        url: `about-page-images/${id}`,
        method: 'PATCH',
        data
      }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Image updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['about-page-images'] });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update image',
        variant: 'destructive',
      });
      console.error('Error updating image:', error);
    },
  });

  // Delete an about page image
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest<void>({
      url: `about-page-images/${id}`,
      method: 'DELETE'
    }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['about-page-images'] });
      setConfirmDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
      console.error('Error deleting image:', error);
    },
  });

  // Update the order of about page images
  const updateOrderMutation = useMutation({
    mutationFn: (ids: number[]) => apiRequest<{ message: string }>({
      url: 'about-page-images/order',
      method: 'POST',
      data: { ids }
    }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Image order updated',
      });
      queryClient.invalidateQueries({ queryKey: ['about-page-images'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update image order',
        variant: 'destructive',
      });
      console.error('Error updating image order:', error);
    },
  });

  // Reset form when dialog closes
  const resetForm = () => {
    form.reset({
      section: 'intro',
      imageUrl: '',
      alt: '',
    });
    setEditImageId(null);
    setOpen(false);
  };

  // Load image data for editing
  const editImage = (image: AboutPageImage) => {
    form.reset({
      section: image.section,
      imageUrl: image.imageUrl,
      alt: image.alt || '',
      displayOrder: image.displayOrder,
    });
    setEditImageId(image.id);
    setOpen(true);
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (editImageId) {
      updateMutation.mutate({ id: editImageId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle dialog open/close
  const onDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  // Handle drag and drop for reordering images
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const items = Array.from(aboutPageImages);
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, removed);
    
    // Update order in backend
    const newIds = items.map(item => item.id);
    updateOrderMutation.mutate(newIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">About Page Images</h3>
          <p className="text-sm text-muted-foreground">
            Manage images for different sections of the About page
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select 
            value={selectedSection} 
            onValueChange={(value) => setSelectedSection(value || "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {availableSections.map((section) => (
                <SelectItem key={section.value} value={section.value}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={open} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">Add New Image</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] w-[95vw]">
              <DialogHeader>
                <DialogTitle className="text-xl">{editImageId ? "Edit Image" : "Add New Image"}</DialogTitle>
                <DialogDescription className="text-sm">
                  Fill in the details for the about page image.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSections.map((section) => (
                              <SelectItem key={section.value} value={section.value}>
                                {section.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the section where this image will appear
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a URL to the image. You can upload an image and copy its URL.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the image" 
                            className="resize-none" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe the image for accessibility (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => onDialogOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* Confirmation dialog for delete */}
          <Dialog 
            open={confirmDeleteId !== null} 
            onOpenChange={(open) => !open && setConfirmDeleteId(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this image? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => confirmDeleteId && deleteMutation.mutate(confirmDeleteId)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Separator />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
        </div>
      ) : aboutPageImages.length === 0 ? (
        <Alert className="bg-muted/50">
          <AlertDescription>
            No images found. {selectedSection ? 'Try selecting a different section or ' : ''}
            Add your first image by clicking the "Add New Image" button.
          </AlertDescription>
        </Alert>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="about-page-images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {aboutPageImages.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="rounded-lg border bg-card text-card-foreground shadow-sm"
                      >
                        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 relative">
                          <div 
                            {...provided.dragHandleProps}
                            className="absolute top-3 right-3 bg-muted rounded-md p-1 cursor-move hover:bg-muted/80"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="5" r="1"/>
                              <circle cx="9" cy="12" r="1"/>
                              <circle cx="9" cy="19" r="1"/>
                              <circle cx="15" cy="5" r="1"/>
                              <circle cx="15" cy="12" r="1"/>
                              <circle cx="15" cy="19" r="1"/>
                            </svg>
                          </div>
                          
                          <div className="aspect-[4/3] md:w-56 rounded-md overflow-hidden flex-shrink-0 relative border border-muted">
                            <img 
                              src={image.imageUrl} 
                              alt={image.alt || `About page image ${index + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/600x400?text=Image+Error';
                              }}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col h-full justify-between">
                              <div>
                                <div className="flex items-center mb-2">
                                  <span className="text-xs font-medium bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-md">
                                    {availableSections.find(s => s.value === image.section)?.label || image.section}
                                  </span>
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ID: {image.id}
                                  </span>
                                </div>
                                
                                {image.alt && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {image.alt}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => editImage(image)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => setConfirmDeleteId(image.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
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
      )}
    </div>
  );
};

export default AboutPageImageEditor;
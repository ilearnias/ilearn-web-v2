import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Icons
import { Trash2, Move, Edit, X, Plus, ImagePlus, ArrowUp, ArrowDown } from 'lucide-react';
import MediaSelector from '@/components/admin/MediaSelector';
import MediaCreator from '@/components/admin/MediaCreator';

type GalleryEvent = {
  id: number;
  title: string;
  description: string | null;
  mediaIds: number[] | null;
  displayOrder: number;
  createdAt: string;
};

type Media = {
  id: number;
  title: string;
  description: string | null;
  type: 'image' | 'video';
  aspectRatio: 'landscape' | 'portrait' | 'square';
  mediaUrl: string;
  thumbnailUrl: string | null;
  embedUrl: string | null;
  displayOrder: number | null;
  createdAt: string;
};

const galleryEventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  mediaIds: z.array(z.number()).optional(),
});

export default function GalleryEventEditor() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [isMediaCreatorOpen, setIsMediaCreatorOpen] = useState(false);
  
  // Event dialog form
  const form = useForm<z.infer<typeof galleryEventSchema>>({
    resolver: zodResolver(galleryEventSchema),
    defaultValues: {
      title: '',
      description: '',
      mediaIds: [],
    },
  });

  // Query: Fetch all gallery events
  const { data: galleryEvents = [], isLoading } = useQuery({
    queryKey: ['admin/gallery'],
    queryFn: () => apiRequest<GalleryEvent[]>('admin/gallery'),
  });

  // Query: Fetch media items for a specific event
  const { data: eventMedia = [], isLoading: isMediaLoading } = useQuery({
    queryKey: ['admin/gallery', selectedEventId, 'media'],
    queryFn: () => selectedEventId 
      ? apiRequest<Media[]>(`admin/gallery/${selectedEventId}/media`) 
      : Promise.resolve([]),
    enabled: !!selectedEventId,
  });

  // Mutation: Create a new gallery event
  const createEventMutation = useMutation({
    mutationFn: (data: z.infer<typeof galleryEventSchema>) => 
      apiRequest({ url: 'admin/gallery', method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin/gallery'] });
      toast({
        title: 'Success',
        description: 'Gallery event created successfully',
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Error creating gallery event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create gallery event',
        variant: 'destructive',
      });
    },
  });

  // Mutation: Update an existing gallery event
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<z.infer<typeof galleryEventSchema>> }) => 
      apiRequest({ url: `admin/gallery/${id}`, method: 'PATCH', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['admin/gallery', selectedEventId, 'media'] });
      toast({
        title: 'Success',
        description: 'Gallery event updated successfully',
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Error updating gallery event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update gallery event',
        variant: 'destructive',
      });
    },
  });

  // Mutation: Delete a gallery event
  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => apiRequest({ 
      url: `admin/gallery/${id}`, 
      method: 'DELETE' 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin/gallery'] });
      toast({
        title: 'Success',
        description: 'Gallery event deleted successfully',
      });
      if (selectedEventId === editEventId) {
        setSelectedEventId(null);
      }
    },
    onError: (error) => {
      console.error('Error deleting gallery event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete gallery event',
        variant: 'destructive',
      });
    },
  });

  // Mutation: Update display order of events
  const updateOrderMutation = useMutation({
    mutationFn: (ids: number[]) => apiRequest({ 
      url: `admin/gallery/order`, 
      method: 'PATCH', 
      data: { ids } 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin/gallery'] });
      toast({
        title: 'Success',
        description: 'Event order updated',
      });
    },
    onError: (error) => {
      console.error('Error updating event order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event order',
        variant: 'destructive',
      });
    },
  });

  // Form submit handler
  const onSubmit = (data: z.infer<typeof galleryEventSchema>) => {
    if (editEventId) {
      updateEventMutation.mutate({ id: editEventId, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  // Load event data for editing
  const handleEditEvent = (event: GalleryEvent) => {
    setEditEventId(event.id);
    form.reset({
      title: event.title,
      description: event.description || '',
      mediaIds: event.mediaIds || [],
    });
    setOpen(true);
  };

  // Reset form on dialog open/close
  const onDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditEventId(null);
      form.reset();
    }
  };

  // Handle drag end for reordering events
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(galleryEvents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Extract just the IDs in the new order
    const newOrderIds = items.map(item => item.id);
    
    // Update the order in the database
    updateOrderMutation.mutate(newOrderIds);
  };

  // Handle media selection for an event
  const handleMediaSelected = (mediaIds: number[]) => {
    if (selectedEventId) {
      updateEventMutation.mutate({
        id: selectedEventId,
        data: { mediaIds }
      });
    }
    setIsMediaSelectorOpen(false);
  };

  // Select an event to view/edit its media
  const handleSelectEvent = (event: GalleryEvent) => {
    setSelectedEventId(event.id);
  };

  // Render event card for each event
  const renderEventCard = (event: GalleryEvent, index: number) => {
    const isSelected = selectedEventId === event.id;
    return (
      <Draggable key={event.id} draggableId={`event-${event.id}`} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-2 border rounded-md p-3 ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => handleSelectEvent(event)}
                >
                  <div {...provided.dragHandleProps} className="mr-2 text-muted-foreground">
                    <Move size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditEvent(event)}
                  title="Edit event"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEventMutation.mutate(event.id)}
                  title="Delete event"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline">{(event.mediaIds?.length || 0)} media items</Badge>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Gallery Editor</h2>
        <p className="text-muted-foreground">
          Manage gallery events and their media content for the website gallery section.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="grid md:grid-cols-7 gap-6">
        {/* Left panel - Events list */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Gallery Events</CardTitle>
              <CardDescription>
                Create and arrange event categories like "Life@iLearn", "Infrastructure", etc.
              </CardDescription>
              
              <Dialog open={open} onOpenChange={onDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-2">
                    <Plus size={16} className="mr-2" /> Add Event Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editEventId ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                    <DialogDescription>
                      {editEventId 
                        ? 'Update the details for this gallery event.' 
                        : 'Create a new gallery event to showcase related media.'}
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Life@iLearn" {...field} />
                            </FormControl>
                            <FormDescription>
                              A descriptive name for this gallery event category.
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
                                placeholder="Glimpses from campus life and student activities"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={createEventMutation.isPending || updateEventMutation.isPending}>
                          {createEventMutation.isPending || updateEventMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading gallery events...
                </div>
              ) : galleryEvents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No gallery events yet. Create your first one!
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="gallery-events">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {galleryEvents.map((event, index) => renderEventCard(event, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel - Media for selected event */}
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {selectedEventId 
                      ? galleryEvents.find(e => e.id === selectedEventId)?.title || 'Event Media'
                      : 'Event Media'}
                  </CardTitle>
                  <CardDescription>
                    {selectedEventId
                      ? galleryEvents.find(e => e.id === selectedEventId)?.description || 'Manage media for this event'
                      : 'Select an event to manage its media'}
                  </CardDescription>
                </div>

                {selectedEventId && (
                  <div className="flex gap-2">
                    {/* Use existing media */}
                    <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <ImagePlus size={16} className="mr-2" /> Use Existing Media
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add Media to Event</DialogTitle>
                          <DialogDescription>
                            Select media items to add to this gallery event.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <MediaSelector 
                          onSelect={handleMediaSelected} 
                          initialSelected={eventMedia.map(media => media.id)}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    {/* Create new media */}
                    <Dialog open={isMediaCreatorOpen} onOpenChange={setIsMediaCreatorOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus size={16} className="mr-2" /> Create New Media
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Media</DialogTitle>
                          <DialogDescription>
                            Upload a new image or add a YouTube video specifically for this event.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <MediaCreator 
                          galleryEventId={selectedEventId} 
                          onComplete={() => {
                            // Close the dialog and refresh the media
                            setIsMediaCreatorOpen(false);
                            queryClient.invalidateQueries({ 
                              queryKey: ['admin/gallery', selectedEventId, 'media'] 
                            });
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {!selectedEventId ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-md">
                  Select an event from the left panel to manage its media content
                </div>
              ) : isMediaLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading media items...
                </div>
              ) : eventMedia.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-md">
                  No media items in this event yet. Click "Use Existing Media" to select from the media library or "Create New Media" to upload content specifically for this event.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {eventMedia.map((media) => (
                    <div key={media.id} className="relative group border rounded-md overflow-hidden">
                      {/* Media Thumbnail */}
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        {media.type === 'image' ? (
                          <img 
                            src={media.mediaUrl} 
                            alt={media.title} 
                            className={`w-full h-full object-cover ${media.aspectRatio === 'portrait' ? 'object-top' : 'object-center'}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <div className="relative w-full h-full">
                              {/* Video Thumbnail */}
                              {media.thumbnailUrl && (
                                <img 
                                  src={media.thumbnailUrl} 
                                  alt={media.title} 
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="white" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Media Details */}
                      <div className="p-2">
                        <h4 className="font-medium truncate text-sm">{media.title}</h4>
                        <div className="flex space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{media.type}</Badge>
                          <Badge variant="outline" className="text-xs">{media.aspectRatio}</Badge>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        className="absolute top-2 right-2 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          if (selectedEventId) {
                            const currentEvent = galleryEvents.find(e => e.id === selectedEventId);
                            if (currentEvent && currentEvent.mediaIds) {
                              const updatedMediaIds = currentEvent.mediaIds.filter(id => id !== media.id);
                              updateEventMutation.mutate({
                                id: selectedEventId,
                                data: { mediaIds: updatedMediaIds }
                              });
                            }
                          }
                        }}
                        title="Remove from event"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import MediaUploader from './MediaUploader';

type MediaCreatorProps = {
  galleryEventId: number;
  onComplete: () => void;
};

export default function MediaCreator({ galleryEventId, onComplete }: MediaCreatorProps) {
  const [activeTab, setActiveTab] = useState('upload-image');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeDescription, setYoutubeDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [imageAspectRatio, setImageAspectRatio] = useState('landscape');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Handle upload completion
  const handleUploadComplete = (mediaId: number) => {
    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: ['/api/media'] });
    queryClient.invalidateQueries({ 
      queryKey: ['/api/gallery-events', galleryEventId, 'media'] 
    });
    
    // Notify of success and close the dialog
    onComplete();
  };

  // Handle Image URL submission
  const handleImageUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter an image URL',
        variant: 'destructive',
      });
      return;
    }
    
    if (!imageTitle.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for this image',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: imageTitle,
          description: imageDescription,
          type: 'image',
          aspectRatio: imageAspectRatio,
          mediaUrl: imageUrl,
          galleryEventId
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add image');
      }
      
      const result = await response.json();
      
      // If a gallery event ID was provided, associate this media with that event
      if (galleryEventId && result.id) {
        const eventResponse = await fetch(`/api/gallery-events/${galleryEventId}`);
        if (eventResponse.ok) {
          const event = await eventResponse.json();
          const currentMediaIds = event.mediaIds || [];
          const updatedMediaIds = [...currentMediaIds, result.id];
          
          await fetch(`/api/gallery-events/${galleryEventId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mediaIds: updatedMediaIds
            }),
          });
        }
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/gallery-events', galleryEventId, 'media'] 
      });
      
      toast({
        title: 'Success',
        description: 'Image added successfully',
      });
      
      // Reset form and close
      setImageUrl('');
      setImageTitle('');
      setImageDescription('');
      onComplete();
    } catch (error) {
      console.error('Image URL processing error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add image',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle YouTube URL submission
  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter a YouTube URL',
        variant: 'destructive',
      });
      return;
    }
    
    if (!youtubeTitle.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for this video',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Detect if this is a shorts video (you may need to adjust this logic)
      const isShort = youtubeUrl.includes('/shorts/');
      
      const response = await fetch('/api/media/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl,
          title: youtubeTitle,
          description: youtubeDescription,
          galleryEventId,
          aspectRatio: isShort ? 'portrait' : 'landscape',
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add YouTube video');
      }
      
      const result = await response.json();
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/gallery-events', galleryEventId, 'media'] 
      });
      
      toast({
        title: 'Success',
        description: 'YouTube video added successfully',
      });
      
      // Reset form and close
      setYoutubeUrl('');
      setYoutubeTitle('');
      setYoutubeDescription('');
      onComplete();
    } catch (error) {
      console.error('YouTube processing error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add YouTube video',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload-image" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="upload-image">Upload Image</TabsTrigger>
          <TabsTrigger value="image-url">Image URL</TabsTrigger>
          <TabsTrigger value="youtube-video">YouTube Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload-image" className="pt-4">
          <MediaUploader 
            onUploadComplete={handleUploadComplete}
            mediaType="image"
            galleryEventId={galleryEventId}
          />
        </TabsContent>

        <TabsContent value="image-url" className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter a direct URL to an image (JPG, PNG, WEBP, etc.)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image-title">Title</Label>
                <Input
                  id="image-title"
                  placeholder="Enter a title for this image"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="image-aspect-ratio">Aspect Ratio</Label>
                <Select
                  value={imageAspectRatio}
                  onValueChange={setImageAspectRatio}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="image-aspect-ratio">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                    <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                    <SelectItem value="square">Square (1:1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image-description">Description (Optional)</Label>
              <Input
                id="image-description"
                placeholder="Add a short description for this image"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <Button 
              onClick={handleImageUrlSubmit} 
              className="w-full"
              disabled={isSubmitting || !imageUrl.trim() || !imageTitle.trim()}
            >
              {isSubmitting ? 'Adding Image...' : 'Add Image'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="youtube-video" className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="youtube-url">YouTube Video URL</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Works with regular YouTube videos, YouTube Shorts, and YouTube links with timestamps.
              </p>
              <p className="text-xs text-muted-foreground">
                YouTube Shorts will be displayed in portrait mode, regular videos in landscape mode.
              </p>
            </div>
            
            <div>
              <Label htmlFor="youtube-title">Title</Label>
              <Input
                id="youtube-title"
                placeholder="Enter a title for this video"
                value={youtubeTitle}
                onChange={(e) => setYoutubeTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="youtube-description">Description (Optional)</Label>
              <Input
                id="youtube-description"
                placeholder="Add a short description for this video"
                value={youtubeDescription}
                onChange={(e) => setYoutubeDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <Button 
              onClick={handleYoutubeSubmit} 
              className="w-full"
              disabled={isSubmitting || !youtubeUrl.trim() || !youtubeTitle.trim()}
            >
              {isSubmitting ? 'Adding YouTube Video...' : 'Add YouTube Video'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

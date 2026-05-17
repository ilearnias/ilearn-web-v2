import { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { API } from '@/config/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AspectRatioType = 'landscape' | 'portrait' | 'square';

function AspectRatioSelect({
  value,
  onChange,
  disabled,
}: {
  value: AspectRatioType;
  onChange: (value: AspectRatioType) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as AspectRatioType)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select aspect ratio" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="landscape">
          Landscape (16:9)
        </SelectItem>
        <SelectItem value="portrait">
          Portrait (9:16)
        </SelectItem>
        <SelectItem value="square">
          Square (1:1)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

type MediaType = 'image' | 'video';
type AspectRatio = 'landscape' | 'portrait' | 'square';

type MediaUploaderProps = {
  onUploadComplete: (mediaId: number) => void;
  mediaType?: MediaType;
  defaultAspectRatio?: AspectRatio;
  galleryEventId?: number;
};

export default function MediaUploader({
  onUploadComplete,
  mediaType = 'image',
  defaultAspectRatio = 'landscape',
  galleryEventId
}: MediaUploaderProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(defaultAspectRatio);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // Process the file (either from drag-drop or file input)
  const handleFile = (file: File) => {
    // Image validation
    if (mediaType === 'image') {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (PNG, JPG, JPEG, WEBP)',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: 'File too large',
          description: 'Image size should not exceed 2MB',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Video validation (if we add video upload support later)
    if (mediaType === 'video') {
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a video file',
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: 'File too large',
          description: 'Video size should not exceed 50MB',
          variant: 'destructive',
        });
        return;
      }
    }

    uploadMedia(file);
  };

  // Upload the media file
  const uploadMedia = async (file: File) => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for this media',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append(mediaType === 'image' ? 'image' : 'video', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('aspectRatio', aspectRatio);
      formData.append('type', mediaType);
      
      // If we have a gallery event ID, include it
      if (galleryEventId) {
        formData.append('galleryEventId', galleryEventId.toString());
      }

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      const uploadPromise = new Promise<number>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            
            // Create media entry using the uploaded file URL
            const token = localStorage.getItem('adminToken');
            const createMediaPromise = fetch(API.BASEURL + 'media', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                title,
                description,
                type: mediaType,
                aspectRatio,
                mediaUrl: response.url,
                galleryEventId
              }),
            });
            
            createMediaPromise.then(res => {
              if (!res.ok) {
                throw new Error('Failed to create media entry');
              }
              return res.json();
            })
            .then(media => {
              // If we have a gallery event ID, associate this media with that event
              if (galleryEventId && media.id) {
                return fetch(API.BASEURL + `admin/gallery/${galleryEventId}`, {
                    headers: {
                      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                  })
                  .then(eventRes => eventRes.json())
                  .then(event => {
                    const currentMediaIds = event.mediaIds || [];
                    const updatedMediaIds = [...currentMediaIds, media.id];

                    return fetch(API.BASEURL + `admin/gallery/${galleryEventId}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({
                        mediaIds: updatedMediaIds
                      }),
                    });
                  })
                  .then(() => resolve(media.id));
              } else {
                resolve(media.id);
              }
            })
            .catch(error => {
              reject(error);
            });
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.onabort = () => reject(new Error('Upload was aborted'));
        
        // Use the appropriate endpoint based on media type
        const endpoint = mediaType === 'image'
          ? API.BASEURL + 'upload/image'
          : API.BASEURL + 'upload/video';

        xhr.open('POST', endpoint, true);
        const uploadToken = localStorage.getItem('adminToken');
        if (uploadToken) xhr.setRequestHeader('Authorization', `Bearer ${uploadToken}`);
        xhr.send(formData);
      });

      // Wait for upload to complete
      const mediaId = await uploadPromise;
      
      // Notify parent component of successful upload
      onUploadComplete(mediaId);

      // Reset form fields
      setTitle('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: 'Upload successful',
        description: `${mediaType === 'image' ? 'Image' : 'Video'} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : "Failed to upload media",
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="media-title">Title</Label>
          <Input 
            id="media-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this media"
            required
            disabled={isUploading}
          />
        </div>
        <div>
          <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
          <AspectRatioSelect 
            value={aspectRatio} 
            onChange={setAspectRatio} 
            disabled={isUploading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="media-description">Description (Optional)</Label>
        <Input
          id="media-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a short description"
          disabled={isUploading}
        />
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-medium">Click to upload {mediaType}</p>
              <p className="text-sm text-muted-foreground">or drag and drop a file here</p>
              {mediaType === 'image' && (
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG, JPEG or WEBP (max 2MB)</p>
              )}
              {mediaType === 'video' && (
                <p className="text-xs text-muted-foreground mt-2">MP4, WEBM, OGG (max 50MB)</p>
              )}
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={mediaType === 'image' ? 'image/png, image/jpeg, image/jpg, image/webp' : 'video/mp4, video/webm, video/ogg'}
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}

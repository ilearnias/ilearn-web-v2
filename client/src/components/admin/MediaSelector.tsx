import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ImageIcon, PlayIcon, Search, X } from 'lucide-react';

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

type MediaSelectorProps = {
  onSelect: (mediaIds: number[]) => void;
  initialSelected?: number[];
};

export default function MediaSelector({ onSelect, initialSelected = [] }: MediaSelectorProps) {
  const [selectedMedia, setSelectedMedia] = useState<number[]>(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [aspectFilter, setAspectFilter] = useState<string | null>(null);

  // Query to fetch all media items
  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['/api/media'],
    queryFn: () => apiRequest<Media[]>('/api/media'),
  });

  // Filter media items based on search, type, and aspect ratio
  const filteredMedia = mediaItems.filter((media) => {
    const matchesSearch = searchTerm 
      ? media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (media.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      : true;
    
    const matchesType = activeTab === 'all' ||
      (activeTab === 'images' && media.type === 'image') ||
      (activeTab === 'videos' && media.type === 'video');
    
    const matchesAspect = !aspectFilter || media.aspectRatio === aspectFilter;
    
    return matchesSearch && matchesType && matchesAspect;
  });

  // Toggle selection of a media item
  const toggleSelection = (mediaId: number) => {
    setSelectedMedia(prev => 
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  // Select all filtered media
  const selectAllFiltered = () => {
    const filteredIds = filteredMedia.map(media => media.id);
    setSelectedMedia(prev => {
      const newSelection = [...prev];
      filteredIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      return newSelection;
    });
  };

  // Deselect all filtered media
  const deselectAllFiltered = () => {
    const filteredIds = filteredMedia.map(media => media.id);
    setSelectedMedia(prev => prev.filter(id => !filteredIds.includes(id)));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setAspectFilter(null);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    onSelect(selectedMedia);
  };

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title or description..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={selectAllFiltered}
              className="whitespace-nowrap"
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={deselectAllFiltered}
              className="whitespace-nowrap"
            >
              Deselect All
            </Button>
            {(searchTerm || activeTab !== 'all' || aspectFilter) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={!aspectFilter ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAspectFilter(null)}
          >
            All Ratios
          </Badge>
          <Badge 
            variant={aspectFilter === 'landscape' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAspectFilter('landscape')}
          >
            Landscape
          </Badge>
          <Badge 
            variant={aspectFilter === 'portrait' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAspectFilter('portrait')}
          >
            Portrait
          </Badge>
          <Badge 
            variant={aspectFilter === 'square' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAspectFilter('square')}
          >
            Square
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          {selectedMedia.length} items selected
        </div>
      </div>

      {/* Media grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
          No media items found matching the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {filteredMedia.map((media) => (
            <div 
              key={media.id} 
              className={`border rounded-md overflow-hidden cursor-pointer transition-all ${selectedMedia.includes(media.id) ? 'ring-2 ring-primary' : 'hover:border-primary'}`}
              onClick={() => toggleSelection(media.id)}
            >
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
                      {media.thumbnailUrl ? (
                        <img 
                          src={media.thumbnailUrl} 
                          alt={media.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <PlayIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                          <PlayIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant={media.type === 'image' ? 'secondary' : 'destructive'} className="text-xs">
                    {media.type === 'image' ? (
                      <>
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {media.aspectRatio}
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-3 w-3 mr-1" />
                        {media.aspectRatio}
                      </>
                    )}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Checkbox 
                    checked={selectedMedia.includes(media.id)}
                    className="h-5 w-5 bg-background/80 data-[state=checked]:bg-primary"
                    onCheckedChange={() => toggleSelection(media.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="p-2">
                <h4 className="font-medium truncate text-sm">{media.title}</h4>
                {media.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {media.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm selection button */}
      <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
        <Button variant="outline" onClick={() => onSelect(initialSelected)}>Cancel</Button>
        <Button onClick={handleConfirm}>Confirm Selection</Button>
      </div>
    </div>
  );
}

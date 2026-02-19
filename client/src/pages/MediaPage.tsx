import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getYearRange } from '@/lib/utils';

// Mock data for display until API connection is ready
const MockMediaItems: MediaItem[] = [
  // Photos
  {
    id: 1,
    title: 'Annual Day Celebration 2023',
    type: 'photo',
    year: 2023,
    event: 'Annual Day',
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'UPSC Toppers Felicitation',
    type: 'photo',
    year: 2023,
    event: 'Felicitation',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'Guest Lecture by IAS Officer',
    type: 'photo',
    year: 2023,
    event: 'Guest Lecture',
    url: 'https://images.unsplash.com/photo-1475721027785-f74ec9c7605a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74ec9c7605a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    title: 'New Campus Inauguration',
    type: 'photo',
    year: 2022,
    event: 'Inauguration',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    title: 'KAS Workshop',
    type: 'photo',
    year: 2022,
    event: 'Workshop',
    url: 'https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    title: 'Annual Sports Day',
    type: 'photo',
    year: 2022,
    event: 'Sports',
    url: 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  
  // Videos
  {
    id: 7,
    title: 'UPSC Strategy Webinar',
    type: 'video',
    year: 2023,
    event: 'Webinar',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 8,
    title: 'Interview Preparation Tips',
    type: 'video',
    year: 2023,
    event: 'Workshop',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 9,
    title: 'Current Affairs Discussion',
    type: 'video',
    year: 2023,
    event: 'Discussion',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 10,
    title: 'Essay Writing Workshop',
    type: 'video',
    year: 2022,
    event: 'Workshop',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 11,
    title: 'Prelims Exam Strategy',
    type: 'video',
    year: 2022,
    event: 'Webinar',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  
  // Press
  {
    id: 12,
    title: 'Manorama Coverage of UPSC Results',
    type: 'press',
    year: 2023,
    event: 'UPSC Results',
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 13,
    title: 'Mathrubhumi Feature on KAS Success',
    type: 'press',
    year: 2023,
    event: 'KAS Results',
    url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 14,
    title: 'Deshabhimani Report on New Campus',
    type: 'press',
    year: 2022,
    event: 'Inauguration',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 15,
    title: 'Indian Express Feature on Director Interview',
    type: 'press',
    year: 2022,
    event: 'Interview',
    url: 'https://images.unsplash.com/photo-1504465039710-0f49c0fce85f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504465039710-0f49c0fce85f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
];

const years = ['all', ...new Set(MockMediaItems.map(item => item.year.toString()))];
const events = ['all', ...new Set(MockMediaItems.map(item => item.event))];

const MediaPage = () => {
  const [mediaType, setMediaType] = useState<'photos' | 'videos' | 'press'>('photos');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  
  // For lightbox/modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch media items from ilearn-server, fall back to mock data
  const { data: mediaItems = MockMediaItems, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      try {
        const { apiRequest } = await import('@/lib/queryClient');
        const data = await apiRequest<MediaItem[]>('media');
        return Array.isArray(data) && data.length > 0 ? data : MockMediaItems;
      } catch {
        return MockMediaItems;
      }
    },
  });

  // Filter media items based on selected type, year, and event
  const filteredItems = mediaItems.filter(item => {
    let matches = item.type === mediaType;
    
    if (selectedYear !== 'all') {
      matches = matches && item.year.toString() === selectedYear;
    }
    
    if (selectedEvent !== 'all') {
      matches = matches && item.event === selectedEvent;
    }
    
    return matches;
  });

  // Open modal with selected item
  const openModal = (item: MediaItem, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Navigate through items in modal
  const navigateModal = (direction: 'prev' | 'next') => {
    const totalItems = filteredItems.length;
    
    if (direction === 'prev') {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
      setCurrentItem(filteredItems[(currentIndex - 1 + totalItems) % totalItems]);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
      setCurrentItem(filteredItems[(currentIndex + 1) % totalItems]);
    }
  };

  return (
    <>
      <Helmet>
        <title>Media Gallery | iLearn IAS Academy</title>
        <meta name="description" content="Browse photos, videos, and press coverage of iLearn IAS Academy events, achievements, and activities." />
      </Helmet>
      
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-light-grey py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">Media Gallery</h1>
              <p className="text-dark-grey max-w-3xl mx-auto">
                Explore photos, videos, and press coverage of our events, achievements, and activities at iLearn IAS Academy.
              </p>
            </div>
          </div>
        </section>
        
        {/* Gallery Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {/* Media Type Tabs */}
            <Tabs 
              defaultValue="photos" 
              value={mediaType}
              onValueChange={(value) => setMediaType(value as 'photos' | 'videos' | 'press')}
              className="mb-8"
            >
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="press">Press</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
            
            {/* Filters */}
            <div className="bg-light-grey p-6 rounded-lg mb-8">
              <h2 className="text-lg font-semibold mb-4">Filter Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-grey mb-2">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>
                          {year === 'all' ? 'All Years' : year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-grey mb-2">Event</label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map(event => (
                        <SelectItem key={event} value={event}>
                          {event === 'all' ? 'All Events' : event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Media Gallery */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all"
                    onClick={() => openModal(item, index)}
                  >
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4 text-white">
                        <p className="font-medium truncate">{item.title}</p>
                        <div className="flex items-center text-sm mt-1">
                          <span className="mr-2">{item.year}</span>
                          <span className="bg-primary-blue bg-opacity-70 px-2 py-0.5 rounded-full">{item.event}</span>
                        </div>
                      </div>
                    </div>
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center">
                          <i className="ri-play-fill text-white text-xl"></i>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-light-grey p-8 rounded-lg text-center">
                <i className="ri-image-line text-4xl text-primary-blue mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No Media Found</h3>
                <p className="text-dark-grey">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </section>
      </PageTransition>

      {/* Media Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black">
          {currentItem && (
            <>
              <div className="relative">
                {/* Close Button */}
                <button 
                  className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center z-10"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                >
                  &times;
                </button>
                
                {/* Navigation Buttons */}
                <button 
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateModal('prev');
                  }}
                  aria-label="Previous item"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateModal('next');
                  }}
                  aria-label="Next item"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
                
                {/* Content */}
                {currentItem.type === 'video' ? (
                  <div className="aspect-video w-full">
                    <iframe
                      src={currentItem.url}
                      title={currentItem.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <img 
                    src={currentItem.url} 
                    alt={currentItem.title}
                    className="max-h-[80vh] max-w-full mx-auto"
                  />
                )}
                
                {/* Caption */}
                <div className="bg-black bg-opacity-70 text-white p-4">
                  <h3 className="font-semibold text-lg">{currentItem.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span>{currentItem.event} | {currentItem.year}</span>
                    <span className="text-sm">{currentIndex + 1} of {filteredItems.length}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaPage;

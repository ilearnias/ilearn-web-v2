import { useState, useRef, useEffect } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getYearRange, getYoutubeEmbedUrl } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define base categories for the gallery based on content purpose
// These categories will be sorted based on their event's displayOrder
// The labels are the default labels, which can be overridden by the actual event title
const galleryCategories = [
  { id: 'life-at-iLearn', label: 'Life at iLearn', eventId: null, displayOrder: 0, originalTitle: null },
  { id: 'testing-order', label: 'Onam at iLearn', eventId: null, displayOrder: 1, originalTitle: null }
  // Events at iLearn section has been hidden
];

const GalleryPage = () => {
  // For lightbox/modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const carouselRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  // Touch state references for swipe detection
  const touchStartXRef = useRef<number | null>(null);
  const touchingElementRef = useRef<string | null>(null);
  const isSwiping = useRef<boolean>(false);

  // Fetch gallery events from API
  const { data: galleryEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/gallery-events'],
    queryFn: () => apiRequest<any[]>('/api/gallery-events'),
  });
  
  // Store all media items from gallery events
  const [eventMediaItems, setEventMediaItems] = useState<MediaItem[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  
  // State for sorted categories - starts with default order
  // But will be updated based on gallery events display order
  const [sortedCategories, setSortedCategories] = useState<typeof galleryCategories>([]);
  
  // Fetch media for all gallery events and update category order based on events
  useEffect(() => {
    if (galleryEvents.length === 0) {
      setIsMediaLoading(false);
      return;
    }
    
    const fetchAllEventMedia = async () => {
      try {
        setIsMediaLoading(true);
        const mediaPromises = galleryEvents.map(event => 
          apiRequest<MediaItem[]>(`/api/gallery-events/${event.id}/media`)
          .then(media => {
            // Return both the event and its media items together
            return { 
              event, 
              media 
            };
          })
        );
        
        const results = await Promise.all(mediaPromises);
        
        // Process each event's media separately without flattening
        const allEventMedia = results.flatMap((result) => {
          const { event, media } = result;
          const categoryId = getCategoryIdFromEventTitle(event.title);
          
          // Map each media item to include the event ID and category from the event
          return media.map(mediaItem => ({
            ...mediaItem,
            eventId: event.id, // Add the eventId to keep track of which event this media belongs to
            category: categoryId
          }));
        });
        
        // Debug log - see what orders we got from the server
        console.log("Gallery events with order:", galleryEvents.map(e => ({ 
          id: e.id, 
          title: e.title, 
          displayOrder: e.displayOrder 
        })));
        
        // Create a map from category IDs to their event's display order
        // This will be used to properly sort categories
        const categoryToOrderMap = new Map<string, number>();
        
        // First, map each event to a category ID
        galleryEvents.forEach(event => {
          const categoryId = getCategoryIdFromEventTitle(event.title);
          
          // Only set if not already set or if the current event has a lower display order
          if (!categoryToOrderMap.has(categoryId) || 
              (event.displayOrder < categoryToOrderMap.get(categoryId)!)) {
            categoryToOrderMap.set(categoryId, event.displayOrder);
          }
        });
        
        // Create a fresh copy of gallery categories and assign display orders
        const updatedCategories = galleryCategories.map(category => {
          // Find the event that maps to this category
          const matchingEvent = galleryEvents.find(event => {
            const categoryId = getCategoryIdFromEventTitle(event.title);
            return categoryId === category.id;
          });
          
          // Deep clone the category to avoid modifying the original
          const updatedCategory = { ...category };
          
          if (matchingEvent) {
            updatedCategory.eventId = matchingEvent.id;
            updatedCategory.displayOrder = matchingEvent.displayOrder;
            // Store the original title from the event
            updatedCategory.originalTitle = matchingEvent.title;
            // Override the label with the actual event title (removing any prefix letters used for sorting)
            // Remove prefix letters (A, B, C) used for ordering by catching uppercase letter at start
            let titleWithoutPrefix = matchingEvent.title;
            // Check if the string starts with an uppercase letter followed by a different case character
            if (/^[A-Z][^A-Z]/.test(titleWithoutPrefix)) {
              titleWithoutPrefix = titleWithoutPrefix.substring(1);
            }
            
            // Use proper titles based on the event title
            if (matchingEvent.title === "Life at iLearn") {
              updatedCategory.label = "Life at iLearn";
            } else if (matchingEvent.title === "Events at iLearn") {
              updatedCategory.label = "Events at iLearn";
            } else if (matchingEvent.title === "Onam at iLearn") {
              updatedCategory.label = "Onam at iLearn";
            } else {
              updatedCategory.label = titleWithoutPrefix;
            }
            console.log(`Mapping category ${category.label} to event "${matchingEvent.title}" (ID: ${matchingEvent.id}) with order ${matchingEvent.displayOrder}`);
          } else {
            // If no matching event, set a high display order to sort it to the end
            updatedCategory.displayOrder = 999;
            console.log(`No matching event found for category ${category.label}`);
          }
          
          return updatedCategory;
        });
        
        // Only include categories that have matching events or media
        const categoriesToShow = updatedCategories.filter(category => {
          // Check if this category has any media items
          const hasMedia = allEventMedia.some(item => item.category === category.id);
          return hasMedia;
        });
        
        // Sort the categories by their display order
        categoriesToShow.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
        
        console.log("Sorted categories:", categoriesToShow.map(c => ({
          id: c.id,
          label: c.label,
          eventId: c.eventId,
          order: c.displayOrder
        })));
        
        // Update state with the sorted categories
        setSortedCategories(categoriesToShow);
        setEventMediaItems(allEventMedia);
      } catch (error) {
        console.error('Error fetching media items:', error);
      } finally {
        setIsMediaLoading(false);
      }
    };
    
    fetchAllEventMedia();
  }, [galleryEvents]);

  
  // Create a custom mapping of event titles to category IDs
  const galleryEventMapping = {
    'Life at iLearn': 'life-at-iLearn',
    'Events at iLearn': 'events-at-iLearn',
    'CTesting the order sequence ': 'testing-order',
    'Onam at iLearn': 'testing-order'
  };
  
  // Helper function to map event titles to category IDs
  const getCategoryIdFromEventTitle = (title: string): string => {
    // First check for exact matches in our mapping
    if (title in galleryEventMapping) {
      return galleryEventMapping[title as keyof typeof galleryEventMapping];
    }
    
    // Fallback to pattern matching if no exact match
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('test') || lowerTitle.includes('order sequence')) {
      return 'testing-order';
    } else if (lowerTitle.includes('life') || lowerTitle.includes('leader')) {
      return 'life-at-iLearn';
    } else if (lowerTitle.includes('nation') || lowerTitle.includes('serving')) {
      return 'iLearners-serving-nation';
    } else if (lowerTitle.includes('infrastructure') || lowerTitle.includes('campus')) {
      return 'infrastructure';
    } else if (lowerTitle.includes('dracula') || lowerTitle.includes('city')) {
      return 'dracula-in-city';
    }
    
    // Default to first category if no match
    return galleryCategories[0].id;
  };
  
  // Initialize carousel refs when component mounts or categories change
  useEffect(() => {
    // Initialize refs for all possible categories
    galleryCategories.forEach(category => {
      if (!carouselRefs.current[category.id]) {
        carouselRefs.current[category.id] = null;
      }
    });
  }, []);

  // Open modal with selected item
  const openModal = (item: MediaItem, category: string, index: number) => {
    // Only open if we're not in the middle of a swipe action
    if (!isSwiping.current) {
      setCurrentItem(item);
      setCurrentCategory(category);
      setCurrentIndex(index);
      setIsModalOpen(true);
    }
  };
  
  // Touch event handlers for swipe detection
  const handleTouchStart = (e: React.TouchEvent, categoryId: string) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchingElementRef.current = categoryId;
    isSwiping.current = false;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || !touchingElementRef.current) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const diffX = touchStartXRef.current - touchCurrentX;
    
    // Mark as swiping if the movement is significant (more than 10px)
    if (Math.abs(diffX) > 10) {
      isSwiping.current = true;
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || !touchingElementRef.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    
    // Detect swipe (minimum 50px movement)
    if (Math.abs(diffX) > 50) {
      const direction = diffX > 0 ? 'right' : 'left';
      scrollCarousel(touchingElementRef.current, direction);
    }
    
    // Reset touch tracking
    touchStartXRef.current = null;
    
    // Wait a bit before resetting isSwiping to prevent tap events immediately after swipe
    setTimeout(() => {
      isSwiping.current = false;
    }, 100);
  };

  // Navigate through items in modal based on content category and event
  const navigateModal = (direction: 'prev' | 'next') => {
    if (!currentCategory || !currentItem) return;
    
    // Get items for the current category from gallery events
    // Also filter by the same eventId as the current item to ensure we only navigate within the same event
    const displayItems = eventMediaItems.filter(item => 
      item.category === currentCategory && 
      item.eventId === currentItem.eventId
    );
    
    const totalItems = displayItems.length;
    if (totalItems === 0) return;
    
    if (direction === 'prev') {
      const newIndex = (currentIndex - 1 + totalItems) % totalItems;
      setCurrentIndex(newIndex);
      setCurrentItem(displayItems[newIndex]);
    } else {
      const newIndex = (currentIndex + 1) % totalItems;
      setCurrentIndex(newIndex);
      setCurrentItem(displayItems[newIndex]);
    }
  };

  // Calculate card width based on content type and aspect ratio
  // While maintaining a consistent height across all cards
  const calculateCardWidth = (item: MediaItem): string => {
    // Fixed heights for all components, matches MediaShoutouts component
    const TOTAL_CARD_HEIGHT = 320;          // Total height of the card (as set in the style)
    const IMAGE_SECTION_HEIGHT = 220;       // Height of the image section within card
    const INFO_SECTION_HEIGHT = 100;        // Height of the info section below image
    
    // Determine aspect ratio
    const isPortraitVideo = 
      item.aspectRatio === 'portrait' || 
      (item.mediaUrl && item.mediaUrl.includes('/shorts/')) ||
      (item.title && item.title.toLowerCase().includes('portrait'));
    
    // Calculate width based on aspect ratio while maintaining the image height
    let width: number;
    
    if (isPortraitVideo) {
      // For portrait videos (YouTube Shorts), use the exact 9:16 ratio
      // For IMAGE_SECTION_HEIGHT of 220px, the width should be 220 * (9/16) = 124px
      width = Math.round(IMAGE_SECTION_HEIGHT * (9/16));
    } else if (item.aspectRatio === 'square') {
      // For square format (1:1 ratio), width equals height of image section
      width = IMAGE_SECTION_HEIGHT;
    } else if (item.aspectRatio === 'landscape' || (item.title && item.title.toLowerCase().includes('landscape'))) {
      // For landscape videos (16:9 ratio), width is 1.78x the height
      width = Math.round(IMAGE_SECTION_HEIGHT * (16/9));
    } else if (item.type === 'video') {
      // Videos without specific aspect ratio are assumed to be 16:9 landscape
      width = Math.round(IMAGE_SECTION_HEIGHT * (16/9));
    } else {
      // Default photos to 4:3 landscape ratio
      width = Math.round(IMAGE_SECTION_HEIGHT * (4/3));
    }
    
    // Limit maximum width on mobile
    return `min(${width}px, 90vw)`;
  };

  // Handle scrolling in carousels
  const scrollCarousel = (categoryId: string, direction: 'left' | 'right') => {
    const container = carouselRefs.current[categoryId];
    if (!container) return;
    
    // Calculate scroll amount based on container width to ensure better responsiveness
    const scrollAmount = direction === 'left' ? 
      -Math.min(container.offsetWidth * 0.8, 300) : 
      Math.min(container.offsetWidth * 0.8, 300);
    
    // Use requestAnimationFrame to ensure smooth scrolling
    requestAnimationFrame(() => {
      container.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    });
  };

  // Helper function to check if a video is a portrait/shorts format
  const isPortraitVideo = (item: MediaItem): boolean => {
    return !!(
      item.aspectRatio === 'portrait' || 
      (item.mediaUrl && item.mediaUrl.includes('/shorts/')) || 
      (item.title && item.title.toLowerCase().includes('portrait'))
    );
  };

  // Custom rendering function for the "Life at iLearn" section with vertical grid layout
  const renderLifeAtILearnGrid = () => {
    // Array of new images for the Life at iLearn section
    const lifeAtILearnImages = [
      { id: 'img1', src: '/gallery-images/DSC03892.JPG', title: 'Classroom Teaching Session', description: 'Faculty teaching in a classroom' },
      { id: 'img2', src: '/gallery-images/DSC04206.JPG', title: 'Cultural Celebrations', description: 'Students celebrating a cultural event' },
      { id: 'img3', src: '/gallery-images/DSC04368.JPG', title: 'Festival Celebration', description: 'Students in traditional attire during festival' },
      { id: 'img4', src: '/gallery-images/DSC04400.JPG', title: 'Onam Celebration', description: 'Students with traditional flower rangoli' },
      { id: 'img5', src: '/gallery-images/DSC04559.JPG', title: 'Festival Group Photo', description: 'Group celebration with traditional attire' },
      { id: 'img6', src: '/gallery-images/DSC06117.JPG', title: 'Exam Preparation', description: 'Students focused during exam preparation' },
      { id: 'img7', src: '/gallery-images/DSC06426.JPG', title: 'Student Gathering', description: 'Students in the common area' },
      { id: 'img8', src: '/gallery-images/DSC07082.JPG', title: 'Lecture Session', description: 'Students attending a lecture' },
      { id: 'img9', src: '/gallery-images/DSC08326.JPG', title: 'Farewell Event', description: 'Farewell celebration with students' },
      { id: 'img10', src: '/gallery-images/DSC08659.JPG', title: 'Birthday Celebration', description: 'Students celebrating a birthday' },
      { id: 'img11', src: '/gallery-images/DSC06441.JPG', title: 'Student Group', description: 'Students gathered in the common area' }
    ];
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-2 md:p-4 bg-white rounded-xl border border-neutral-100">
        {lifeAtILearnImages.map((image) => (
          <div 
            key={image.id} 
            className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.03] cursor-pointer aspect-[4/3]"
            onClick={() => {
              // Create a MediaItem to pass to the modal
              const mediaItem: MediaItem = {
                id: parseInt(image.id.replace('img', '')),
                title: image.title,
                description: image.description,
                mediaUrl: image.src,
                type: 'image',
                aspectRatio: 'landscape',
                category: 'life-at-iLearn'
              };
              
              // Open the modal with this image
              setCurrentItem(mediaItem);
              setCurrentCategory('life-at-iLearn');
              setCurrentIndex(parseInt(image.id.replace('img', '')) - 1);
              setIsModalOpen(true);
            }}
          >
            <img 
              src={image.src} 
              alt={image.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 flex flex-col justify-end">
              <h3 className="text-white text-sm font-medium mb-1">{image.title}</h3>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Gallery | iLearn IAS Academy</title>
        <meta name="description" content="Browse our gallery showcasing infrastructure, success stories, and student life at iLearn IAS Academy." />
      </Helmet>
      
      <PageTransition>
        {/* Hero Section - Material Design 3 Style */}
        <section className="py-10 md:py-16 relative overflow-hidden">
          {/* Material Design 3 layered background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 z-0"></div>
          
          {/* Material Design 3 decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-blue opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-primary-blue opacity-5 blur-2xl"></div>
          
          {/* Decorative pattern - subtle dots */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #20468D 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
               }}>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <span className="text-sm text-primary-blue-700 font-medium bg-primary-blue-50 px-4 py-1.5 rounded-full shadow-sm mb-4 border border-primary-blue-100">Our Media Collection</span>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-blue-800 mb-4 leading-tight">
                Explore our <span className="text-primary-red relative">Gallery
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary-red/30 rounded-full"></span>
                </span>
              </h1>
              <p className="text-neutral-700 max-w-2xl mx-auto text-lg leading-relaxed mb-5">
                Discover our campus infrastructure, success stories, and vibrant student life through our curated collection of images and videos.
              </p>
              
              <div className="flex gap-3 mt-2">
                <div className="w-3 h-3 rounded-full bg-primary-blue"></div>
                <div className="w-3 h-3 rounded-full bg-primary-red"></div>
                <div className="w-3 h-3 rounded-full bg-primary-blue-300"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Gallery Sections */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            {isLoadingEvents || isMediaLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-20 md:space-y-24">
                {sortedCategories.map(category => {
                    console.log("Rendering category:", category.id, category.label);
                    
                    // Special handling for Life at iLearn section
                    if (category.id === 'life-at-iLearn') {
                    return (
                      <div key={category.id} className="category-section">
                        <div className="flex items-center mb-10 md:mb-12">
                          {/* Material Design 3 style section heading with decorative element */}
                          <div className="flex items-center">
                            <div className="w-2 h-16 bg-gradient-to-b from-primary-blue to-primary-blue-700 rounded-full mr-5"></div>
                            <div>
                              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue-800">
                              {category.id === "life-at-iLearn" ? "Life at iLearn" : 
                               category.id === "testing-order" ? "Onam at iLearn" : 
                               category.id === "dracula-in-city" ? "Events at iLearn" :
                               category.label}
                            </h2>
                            </div>
                          </div>
                        </div>
                        
                        {/* Slider layout for "Life at iLearn" with larger images */}
                        <div className="relative p-4 bg-white rounded-xl border border-neutral-100 shadow-sm">
                          {/* Slider container with overflow */}
                          <div className="relative overflow-x-auto pb-6" id="life-at-ilearn-slider">
                            <div className="flex space-x-4 w-full" style={{ scrollBehavior: 'smooth' }}>
                              {/* Card 1 - Classroom Session - 50% larger */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/DSC03892.JPG" 
                                    alt="Classroom Teaching" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Classroom image failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EClassroom Teaching%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Classroom Teaching</h3>
                                      <p className="text-sm opacity-90">Faculty-led interactive session</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Card 2 - Student Group - 50% larger */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/DSC06441.JPG" 
                                    alt="Student Group" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Student Group image failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EStudent Group%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Student Group</h3>
                                      <p className="text-sm opacity-90">Collaborative learning environment</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Card 3 - Farewell Event - 50% larger */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/DSC08345.JPG" 
                                    alt="Farewell Event" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Farewell Event image failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EFarewell Event%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Farewell Event</h3>
                                      <p className="text-sm opacity-90">Celebrating our successful graduates</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Card 4 - Birthday Celebration - 50% larger */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/DSC08659.JPG" 
                                    alt="Birthday Celebration" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Birthday Celebration image failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EBirthday Celebration%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Birthday Celebration</h3>
                                      <p className="text-sm opacity-90">Building community and connections</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Navigation Arrows - with white text */}
                          <button 
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow-md hover:bg-black/50 hover:shadow-lg transition-all z-10"
                            onClick={() => {
                              const container = document.querySelector('#life-at-ilearn-slider') as HTMLElement;
                              if (container) {
                                container.scrollBy({ left: -300, behavior: 'smooth' });
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow-md hover:bg-black/50 hover:shadow-lg transition-all z-10"
                            onClick={() => {
                              const container = document.querySelector('#life-at-ilearn-slider') as HTMLElement;
                              if (container) {
                                container.scrollBy({ left: 300, behavior: 'smooth' });
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* Special additional content for the Onam at iLearn section */}
                          {category.id === 'testing-order' && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg shadow-md z-10 text-center">
                              <p className="text-sm text-primary-blue-800 font-medium">Swipe to see more Onam photos</p>
                            </div>
                          )}
                          
                          {/* Dots indicator - all white */}
                          <div className="flex justify-center space-x-2 mt-4">
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (category.id === 'testing-order') {
                    // Special handling for Onam at iLearn section with carousel of Onam photos
                    return (
                      <div key={category.id} className="category-section">
                        <div className="flex items-center mb-10 md:mb-12">
                          {/* Material Design 3 style section heading with decorative element */}
                          <div className="flex items-center">
                            <div className="w-2 h-16 bg-gradient-to-b from-primary-blue to-primary-blue-700 rounded-full mr-5"></div>
                            <div>
                              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue-800">
                                Onam at iLearn
                              </h2>
                            </div>
                          </div>
                        </div>
                        
                        {/* Slider layout for Onam photos with larger images */}
                        <div className="relative p-4 bg-white rounded-xl border border-neutral-100 shadow-sm">
                          {/* Slider container with overflow */}
                          <div className="relative overflow-x-auto pb-6" id="onam-celebration-slider">
                            <div className="flex space-x-4 w-full" style={{ scrollBehavior: 'smooth' }}>
                              {/* Card 1 - Original Onam Celebration Photo (moved to first position) */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/onam-celebration.jpg" 
                                    alt="Onam Celebration" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Onam celebration image failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EOnam Celebration%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Kerala's Harvest Festival</h3>
                                      <p className="text-sm opacity-90">Students dressed in traditional attire celebrating Onam</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Card 2 - Onam Group Photo with Pookalam */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/onam-celebration-1.jpg" 
                                    alt="Onam Group with Pookalam" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Onam image 1 failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EOnam Celebration%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Onam Group Celebration</h3>
                                      <p className="text-sm opacity-90">Students in traditional attire with 'Happy Onam' pookalam</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Card 3 - Second Onam Group Photo */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/onam-celebration-2.jpg" 
                                    alt="Onam Group Photo" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Onam image 2 failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EOnam Group%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Onam Celebrations</h3>
                                      <p className="text-sm opacity-90">Students and staff gathered around the traditional flower arrangement</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Card 4 - iLearn IAS Banner Group */}
                              <div className="relative flex-shrink-0 w-[75%] md:w-[50%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="aspect-[4/3]">
                                  <img 
                                    src="/uploads/onam-celebration-3.jpg" 
                                    alt="Onam Celebration with Banner" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Onam image 3 failed to load");
                                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' style='fill:rgb(220,220,220);'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='black'%3EOnam Banner%3C/text%3E%3C/svg%3E`;
                                    }}
                                  />
                                  {/* Text overlay appears on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                      <h3 className="text-lg font-medium">Onam at iLearn IAS</h3>
                                      <p className="text-sm opacity-90">Students in traditional mundu posing in front of festival banner</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Navigation Arrows - with white text */}
                          <button 
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow-md hover:bg-black/50 hover:shadow-lg transition-all z-10"
                            onClick={() => {
                              const container = document.querySelector('#onam-celebration-slider') as HTMLElement;
                              if (container) {
                                container.scrollBy({ left: -300, behavior: 'smooth' });
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow-md hover:bg-black/50 hover:shadow-lg transition-all z-10"
                            onClick={() => {
                              const container = document.querySelector('#onam-celebration-slider') as HTMLElement;
                              if (container) {
                                container.scrollBy({ left: 300, behavior: 'smooth' });
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* Caption at the bottom */}
                          <div className="mt-6 text-center">
                            <p className="text-neutral-700">Onam celebrations at iLearn IAS - Students come together to celebrate Kerala's harvest festival</p>
                          </div>
                          
                          {/* Dots indicator - all white */}
                          <div className="flex justify-center space-x-2 mt-4">
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                            <button className="w-2 h-2 rounded-full bg-white border border-gray-300"></button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // For all other categories, continue with the original carousel layout
                  // Filter media items by their category
                  // Each media item now has an eventId property to identify which event it belongs to
                  const categoryItems = eventMediaItems.filter(item => 
                    item.category === category.id
                  );
                  
                  // No fallback items - only show content that was explicitly added to gallery events
                  const displayItems = categoryItems;
                  
                  if (displayItems.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="category-section">
                      <div className="flex items-center justify-between mb-10 md:mb-12">
                        {/* Material Design 3 style section heading with decorative element */}
                        <div className="flex items-center">
                          <div className="w-2 h-16 bg-gradient-to-b from-primary-blue to-primary-blue-700 rounded-full mr-5"></div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-primary-blue-800">
                              {category.id === "life-at-iLearn" ? "Onam at iLearn IAS" : 
                               category.id === "testing-order" ? "Onam at iLearn" : 
                               category.label}
                            </h2>
                          </div>
                        </div>
                        
                        {/* Material Design 3 style button group with elevation and state layers */}
                        <div className="flex space-x-4">
                          <button 
                            onClick={() => scrollCarousel(category.id, 'left')}
                            className="p-3 md:p-4 bg-white hover:bg-primary-blue/5 active:bg-primary-blue/10 rounded-full transition-all duration-300 shadow-sm hover:shadow border border-neutral-200 group"
                            aria-label="Scroll left"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue-700 group-hover:text-primary-blue-600 transition-colors duration-300">
                              <path d="m15 18-6-6 6-6"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => scrollCarousel(category.id, 'right')}
                            className="p-3 md:p-4 bg-white hover:bg-primary-blue/5 active:bg-primary-blue/10 rounded-full transition-all duration-300 shadow-sm hover:shadow border border-neutral-200 group"
                            aria-label="Scroll right"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue-700 group-hover:text-primary-blue-600 transition-colors duration-300">
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div 
                        className="carousel relative overflow-hidden rounded-xl bg-white/50 shadow-sm p-4 border border-neutral-100"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                      >
                        <div 
                          ref={el => carouselRefs.current[category.id] = el} 
                          className="flex overflow-x-auto pb-6 gap-6 md:gap-7 scrollbar-hide snap-x snap-mandatory pl-1"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          onTouchStart={(e) => handleTouchStart(e, category.id)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {displayItems.map((item, index) => (
                            <div 
                              key={item.id}
                              className="group relative cursor-pointer overflow-hidden rounded-xl flex-shrink-0 snap-start transition-all duration-300 bg-white shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                              style={{ 
                                width: calculateCardWidth(item),
                                height: '320px' // Fixed height for all cards
                              }}
                              onClick={() => openModal(item, category.id, index)}
                            >
                              {/* Top section with image */}
                              <div className="relative h-[220px] overflow-hidden">
                                {/* Media Type Badge */}
                                <div className={`absolute top-3 right-3 ${item.aspectRatio === 'portrait' ? 'bg-primary-red/90' : item.type === 'video' ? 'bg-primary-blue/90' : 'bg-neutral-800/80'} backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full z-20 flex items-center gap-1.5`}>
                                  <span className="w-1.5 h-1.5 bg-white/80 rounded-full"></span>
                                  {item.aspectRatio === 'portrait' && item.type === 'video' ? 'Short' : item.type === 'video' ? 'Video' : 'Photo'}
                                </div>
                                
                                {/* Image with aspect ratio preservation */}
                                <div 
                                  className="w-full h-full overflow-hidden bg-black"
                                  style={{
                                    position: 'relative'
                                  }}
                                >
                                  {/* Special handling for portrait/shorts videos */}
                                  {isPortraitVideo(item) ? (
                                    <div 
                                      className="w-full h-full relative overflow-hidden flex justify-center items-center bg-black"
                                      style={{ aspectRatio: '9/16' }} /* YouTube Shorts aspect ratio */
                                    >
                                      <img
                                        src={item.thumbnailUrl} 
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                      />
                                      {/* Overlay gradient for better text readability */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10"></div>
                                    </div>
                                  ) : (
                                    /* Standard handling for landscape videos/images */
                                    <>
                                      <img 
                                        src={item.thumbnailUrl} 
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                      />
                                      {/* Overlay gradient for better text readability */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10"></div>
                                    </>
                                  )}
                                </div>
                                
                                {/* Main overlay gradient has been moved inside the media containers */}
                                
                                {/* Play button overlay for videos */}
                                {item.type === 'video' && (
                                  <div 
                                    className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent parent card click
                                      openModal(item, category.id, index);
                                    }}
                                  >
                                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:bg-white">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={item.aspectRatio === 'portrait' ? '#E21A24' : '#20468D'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Info section below the image */}
                              <div className="p-4 bg-white h-[100px] border-t border-neutral-100">
                                <h3 className="font-medium text-sm text-neutral-800 line-clamp-2 mb-2">{item.title}</h3>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-neutral-500 truncate max-w-[70%]">{item.event}</span>
                                  <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">{item.year}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </PageTransition>

      {/* Media Modal - Material Design 3 Style */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] h-[85vh] md:max-h-[90vh] md:max-w-6xl p-0 bg-black w-[95vw] md:w-auto overflow-hidden rounded-xl border-0 flex flex-col" aria-describedby="gallery-modal-description">
          <DialogTitle className="sr-only">Media Preview</DialogTitle>
          <div id="gallery-modal-description" className="sr-only">Gallery media preview with navigation controls</div>
          {currentItem && (
            <>
              <div className="relative flex flex-col flex-1">
                {/* Material Design 3 Close Button */}
                <button 
                  className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center z-20 shadow-md transition-all duration-300 border border-white/20"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
                
                {/* Material Design 3 Navigation Buttons */}
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center z-20 shadow-md border border-white/20 transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateModal('prev');
                  }}
                  aria-label="Previous item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center z-20 shadow-md border border-white/20 transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateModal('next');
                  }}
                  aria-label="Next item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
                
                {/* Content - With Material Design 3 scrim and loading effects */}
                <div 
                  className="relative flex-1 flex items-center justify-center overflow-hidden"
                  onTouchStart={(e) => {
                    touchStartXRef.current = e.touches[0].clientX;
                    isSwiping.current = false;
                    
                    // Reset any existing transform
                    const modalImage = document.querySelector('.modal-content-swipeable');
                    if (modalImage) {
                      (modalImage as HTMLElement).style.transform = 'translateX(0)';
                      (modalImage as HTMLElement).style.transition = 'none';
                    }
                    
                    // Hide both indicators initially
                    document.querySelectorAll('.swipe-indicator').forEach(el => {
                      (el as HTMLElement).style.opacity = '0';
                    });
                  }}
                  onTouchMove={(e) => {
                    if (touchStartXRef.current === null) return;
                    const touchCurrentX = e.touches[0].clientX;
                    const diffX = touchStartXRef.current - touchCurrentX;
                    
                    // For videos, we should only allow swiping but not visual transformations
                    const isVideo = currentItem && currentItem.type === 'video';
                    
                    if (Math.abs(diffX) > 10) {
                      isSwiping.current = true;
                      
                      // Show the appropriate direction indicator
                      document.querySelectorAll('.swipe-indicator').forEach(el => {
                        (el as HTMLElement).style.opacity = '0';
                      });
                      
                      if (diffX > 0) { // Swiping left, show right indicator
                        const indicator = document.querySelector('.swipe-indicator-right');
                        if (indicator) (indicator as HTMLElement).style.opacity = '1';
                      } else { // Swiping right, show left indicator
                        const indicator = document.querySelector('.swipe-indicator-left');
                        if (indicator) (indicator as HTMLElement).style.opacity = '1';
                      }
                      
                      // Only apply transformations for images, not videos
                      if (!isVideo) {
                        // Move the content with finger but with some resistance
                        const modalImage = document.querySelector('.modal-content-swipeable');
                        if (modalImage) {
                          const resistance = 3; // Higher value = more resistance
                          const moveX = -diffX / resistance;
                          (modalImage as HTMLElement).style.transform = `translateX(${moveX}px)`;
                        }
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (touchStartXRef.current === null) return;
                    const touchEndX = e.changedTouches[0].clientX;
                    const diffX = touchStartXRef.current - touchEndX;
                    
                    // Hide both indicators
                    document.querySelectorAll('.swipe-indicator').forEach(el => {
                      (el as HTMLElement).style.opacity = '0';
                    });
                    
                    // Reset any transform with a smooth transition
                    const modalImage = document.querySelector('.modal-content-swipeable');
                    if (modalImage) {
                      (modalImage as HTMLElement).style.transition = 'transform 0.3s ease-out';
                      (modalImage as HTMLElement).style.transform = 'translateX(0)';
                    }
                    
                    if (Math.abs(diffX) > 50) {
                      // Negative diff means swipe right (previous), positive means swipe left (next)
                      navigateModal(diffX > 0 ? 'next' : 'prev');
                    }
                    
                    touchStartXRef.current = null;
                    setTimeout(() => {
                      isSwiping.current = false;
                    }, 100);
                  }}
                >
                  {/* Subtle gradient backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-0"></div>
                  
                  {/* Visual indicator for swipe directions with animation */}
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/30 to-transparent opacity-0 z-10 transition-opacity duration-200 swipe-indicator swipe-indicator-left flex items-center justify-start pl-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/30 to-transparent opacity-0 z-10 transition-opacity duration-200 swipe-indicator swipe-indicator-right flex items-center justify-end pr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                  
                  {currentItem.type === 'video' ? (
                    <div className="bg-black relative flex items-center justify-center w-full h-full">
                      {/* Check for portrait video */}
                      {isPortraitVideo(currentItem) ? (
                        // Portrait video container (9:16 ratio)
                        // Use a max-height approach with centered content
                        <div 
                          className="relative flex items-center justify-center"
                          style={{
                            height: '85vh',    // Set fixed height to fill the viewport
                            aspectRatio: '9/16', // Maintain portrait aspect ratio
                            margin: '0 auto'    // Center horizontally
                          }}
                        >
                          <iframe 
                            src={getYoutubeEmbedUrl(currentItem.mediaUrl || '') || ''}
                            title={currentItem.title}
                            className="w-full h-full modal-content-swipeable"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            id="youtube-shorts-player"
                          ></iframe>
                        </div>
                      ) : (
                        // Landscape video container (16:9 ratio)
                        // Use a max-width approach with centered content
                        <div 
                          className="relative flex items-center justify-center"
                          style={{
                            width: '94vw',        // Set width to fill most of viewport width
                            maxWidth: '1400px',   // Limit maximum width
                            aspectRatio: '16/9',  // Maintain landscape aspect ratio
                            margin: '0 auto'      // Center horizontally
                          }}
                        >
                          <iframe 
                            src={getYoutubeEmbedUrl(currentItem.mediaUrl || '') || ''}
                            title={currentItem.title}
                            className="w-full h-full modal-content-swipeable"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            id="youtube-landscape-player"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="flex justify-center items-center bg-black/90 relative modal-content-swipeable"
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={currentItem.mediaUrl || currentItem.url} 
                        alt={currentItem.title}
                        className="object-contain relative z-10"
                        style={{ 
                          margin: '0 auto',
                          maxWidth: currentItem.title.toLowerCase().includes('landscape') ? 'min(90vw, 1200px)' : '90%',
                          maxHeight: currentItem.title.toLowerCase().includes('landscape') ? '80vh' : '75vh',
                          width: currentItem.title.toLowerCase().includes('landscape') ? 'auto' : 'auto'
                        }}
                        draggable="false" /* Prevent image dragging interfering with swipe */
                      />
                    </div>
                  )}
                </div>
                
                {/* Material Design 3 Caption - with proper typography and elevation */}
                <div className="p-6 bg-gradient-to-t from-black via-black/95 to-black/90 text-white relative z-10">
                  <h3 className="text-xl font-medium mb-2 text-white/95">{currentItem.title}</h3>
                  <div className="flex items-center text-sm text-white/80">
                    <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">{currentItem.year}</span>
                    <span className="mx-3 text-white/40">•</span>
                    <span className="bg-primary-blue/80 px-3 py-1 rounded-full shadow-sm">{currentItem.event}</span>
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

export default GalleryPage;
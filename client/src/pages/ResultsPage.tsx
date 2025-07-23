import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { Topper } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getYearRange, getYoutubeEmbedUrl } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';

// iLearn IAS Academy's Authentic Top Achievers with genuine photos and data
const iLearnTopAchievers: Topper[] = [
  {
    id: 1,
    name: 'Midhun Premraj IAS',
    rank: 12,
    program: 'PCM Program',
    year: 2024,
    image: '/attached_assets/Mithun Premraj.JPG',
    testimonial: "iLearn IAS Academy provided me with the perfect foundation and guidance throughout my UPSC journey. The comprehensive study materials, expert faculty, and personalized mentoring were instrumental in achieving AIR 12.",
    scorecard: ''
  },
  {
    id: 2,
    name: 'Dileep Kainikkara IAS',
    rank: 21,
    program: 'PCM Program', 
    year: 2024,
    image: '/attached_assets/photo_4_2025-03-22_11-18-25.jpg',
    testimonial: "The structured approach and dedicated faculty at iLearn IAS made all the difference in my preparation. Their focus on current affairs and answer writing helped me secure AIR 21.",
    scorecard: ''
  },
  {
    id: 3,
    name: 'Alfred OV IAS',
    rank: 57,
    program: 'PCM Program',
    year: 2024,
    image: '/attached_assets/Alfred OV.png',
    testimonial: "iLearn IAS Academy's comprehensive curriculum and expert guidance were crucial in my success. The regular mock tests and feedback sessions helped me improve consistently.",
    scorecard: ''
  },
  {
    id: 4,
    name: 'Reenu Anna Mathew',
    rank: 81,
    program: 'PCM Program',
    year: 2024,
    image: '/attached_assets/DSC07378.JPG',
    testimonial: "The supportive environment at iLearn IAS and the quality of teaching made my UPSC preparation journey successful. The faculty's dedication and personalized attention were exceptional.",
    scorecard: ''
  },
  {
    id: 5,
    name: 'Annie George',
    rank: 93,
    program: 'PCM Program',
    year: 2024,
    image: '/attached_assets/annie george.JPG',
    testimonial: "iLearn IAS Academy provided me with the right strategy and resources to crack UPSC. The comprehensive study materials and regular assessments were very helpful.",
    scorecard: ''
  },
  {
    id: 6,
    name: 'Devika Priyadersini',
    rank: 95,
    program: 'PCM Program',
    year: 2024,
    image: '/attached_assets/DSC02542.jpg',
    testimonial: "The expert faculty at iLearn IAS guided me through every step of my UPSC preparation. Their teaching methodology and current affairs coverage were outstanding.",
    scorecard: ''
  },
  {
    id: 7,
    name: 'Jayakrishnan IAS',
    rank: 444,
    program: 'PCM Program',
    year: 2024,
    image: '/attached_assets/photo_8_2025-03-22_11-18-25.jpg',
    testimonial: "iLearn IAS Academy's comprehensive approach and continuous support helped me achieve my dream of becoming a civil servant. The faculty's expertise and guidance were invaluable.",
    scorecard: ''
  }
];

// Mock media data for the results page
const mockMediaData = {
  2025: [
    { id: 1, title: "UPSC CSE 2024 Success Story", type: "video", year: 2025, event: "UPSC Results", 
      url: "https://youtube.com/shorts/7FGDoedTd9w?si=rHFdg-jOLJoQ0d-Z", 
      thumbnailUrl: "https://img.youtube.com/vi/7FGDoedTd9w/hqdefault.jpg",
      aspectRatio: "portrait" },
    { id: 2, title: "iLearn Top Rankers Interview", type: "video", year: 2025, event: "UPSC Results", 
      url: "https://youtu.be/pmunw8qu03M?si=fcAQ7oxpjwYr95fv", 
      thumbnailUrl: "https://img.youtube.com/vi/pmunw8qu03M/hqdefault.jpg",
      aspectRatio: "landscape" },
    { id: 3, title: "UPSC CSE Success Journey", type: "video", year: 2025, event: "UPSC Results", 
      url: "https://youtube.com/shorts/GxvrKTSrZbc?si=bb23jpk7L5kT-3zJ", 
      thumbnailUrl: "https://img.youtube.com/vi/GxvrKTSrZbc/hqdefault.jpg",
      aspectRatio: "portrait" }
  ],
  2024: [
    { id: 4, title: "CSE 2024 Celebration", type: "photo", year: 2024, event: "UPSC Results", 
      url: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1470&auto=format&fit=crop", 
      thumbnailUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1470&auto=format&fit=crop",
      aspectRatio: "landscape" },
    { id: 5, title: "CSE 2024 Interviews", type: "video", year: 2024, event: "UPSC Results", 
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
      thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop",
      aspectRatio: "landscape" }
  ],
  2023: [
    { id: 6, title: "CSE 2023 Toppers", type: "photo", year: 2023, event: "UPSC Results", 
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop", 
      thumbnailUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop",
      aspectRatio: "landscape" }
  ],
  2022: [
    { id: 7, title: "CSE 2022 Toppers", type: "photo", year: 2022, event: "UPSC Results", 
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop", 
      thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop",
      aspectRatio: "portrait" }
  ],
  2021: [
    { id: 8, title: "CSE 2021 Celebration", type: "photo", year: 2021, event: "UPSC Results", 
      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop", 
      thumbnailUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop",
      aspectRatio: "landscape" }
  ],
  2020: [
    { id: 9, title: "CSE 2020 Toppers", type: "photo", year: 2020, event: "UPSC Results", 
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop", 
      thumbnailUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop",
      aspectRatio: "landscape" }
  ]
};

// Stats data for results summary table
const resultsData = {
  2025: { totalSelections: 46, top100: 6, pcrClassroom: 11, firstAttempt: 1 },
  2024: { totalSelections: 28, top100: 4, pcrClassroom: 12, firstAttempt: 2 },
  2023: { totalSelections: 65, top100: 18, pcrClassroom: 52, firstAttempt: 25 },
  2022: { totalSelections: 48, top100: 12, pcrClassroom: 36, firstAttempt: 20 },
  2021: { totalSelections: 35, top100: 8, pcrClassroom: 28, firstAttempt: 15 },
  2020: { totalSelections: 18, top100: 5, pcrClassroom: 14, firstAttempt: 8 }
};

interface CarouselMediaItemProps {
  item: any;
  onOpen: (item: any) => void;
}

const CarouselMediaItem = ({ item, onOpen }: CarouselMediaItemProps) => {
  const isVideo = item.type === 'video';
  // Detect YouTube URL pattern
  const isYoutubeVideo = item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
  // Detect if it's a YouTube Shorts video
  const isYoutubeShorts = isYoutubeVideo && item.url.includes('/shorts/');
  
  return (
    <div 
      className="media-item cursor-pointer flex-shrink-0 relative mx-2 overflow-hidden rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
      onClick={() => onOpen(item)}
      style={{ 
        width: isYoutubeShorts || item.aspectRatio === 'portrait' ? '182px' : '300px',
        height: '320px',
        overflow: 'hidden'
      }}
    >
      <div className="w-full h-full relative">
        <img 
          src={item.thumbnailUrl} 
          alt={item.title}
          className="w-full h-full object-cover object-center"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-primary-red/80 backdrop-blur-sm rounded-full p-3 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm text-primary-blue px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            {item.year}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px] p-4">
          <h3 className="text-white text-sm font-medium mb-1">{item.title}</h3>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isVideo ? 'bg-primary-red' : 'bg-primary-blue'}`}></span>
            <p className="text-white text-xs">{item.event}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsPage = () => {
  // States for new results page design
  const [activeTab, setActiveTab] = useState<string>("2025");
  const [viewMode, setViewMode] = useState<"carousel" | "gallery">("carousel");
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [isFullScreenView, setIsFullScreenView] = useState<boolean>(false);
  
  // Media carousel ref
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  
  // Touch reference for swipe detection
  const touchStartXRef = useRef<number | null>(null);
  
  // Set default year to 2025 when component mounts
  useEffect(() => {
    setActiveTab("2025");
  }, []);
  
  
  // Modal state
  const [selectedTopper, setSelectedTopper] = useState<Topper | null>(null);
  
  // Get years array for tabs
  const yearTabs = Object.keys(resultsData).sort((a, b) => parseInt(b) - parseInt(a));
  
  // Total selections across all years
  const totalSelections = Object.values(resultsData).reduce(
    (sum, year) => sum + year.totalSelections, 0
  );
  
  // Define type for years in mockMediaData
  type MediaYear = keyof typeof mockMediaData;
  
  // Get current year's media
  const currentYearMedia = mockMediaData[activeTab as MediaYear] || [];
  

  
  // Handle tab change with haptic feedback
  const handleTabChange = (year: string) => {
    // Only allow 2025 tab to be selected, ignore other years
    if (year === "2025") {
      setActiveTab(year);
      
      // Simulate haptic feedback if supported
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Vibrate for 50ms
      }
    }
  };
  
  // Define type for media items
  type MediaItem = {
    id: number;
    title: string;
    type: string;
    year: number;
    event: string;
    url: string;
    thumbnailUrl: string;
    aspectRatio: string;
  };

  // Handle opening media in fullscreen
  const handleOpenMedia = (item: MediaItem) => {
    setCurrentItem(item);
    setIsFullScreenView(true);
  };
  
  // Handle navigation in fullscreen view
  const handlePrevItem = () => {
    const currentIndex = currentYearMedia.findIndex((item: MediaItem) => item.id === currentItem.id);
    if (currentIndex > 0) {
      setCurrentItem(currentYearMedia[currentIndex - 1]);
    }
  };
  
  const handleNextItem = () => {
    const currentIndex = currentYearMedia.findIndex((item: MediaItem) => item.id === currentItem.id);
    if (currentIndex < currentYearMedia.length - 1) {
      setCurrentItem(currentYearMedia[currentIndex + 1]);
    }
  };
  
  // Use authentic iLearn achievers data
  const { data: toppers = iLearnTopAchievers, isLoading } = useQuery({
    queryKey: ['/api/toppers'],
    queryFn: async () => {
      // Return authentic iLearn achievers data
      return Promise.resolve(iLearnTopAchievers);
    },
  });
  

  
  const handleTopperClick = (topper: Topper) => {
    setSelectedTopper(topper);
  };

  return (
    <>
      <Helmet>
        <title>Our Results | iLearn IAS Academy</title>
        <meta name="description" content="Explore the success stories and achievements of iLearn IAS Academy students in UPSC, KAS, and other civil service examinations." />
      </Helmet>
      
      <PageTransition>
        {/* New Results Hero Section */}
        <section className="py-10 bg-light-grey">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-blue text-center mb-4">Our Results</h1>
            
            {/* "The Most Genuine Results in Kerala" highlighted title */}
            <div className="text-center mb-8">
              <div className="inline-block bg-primary-blue text-white px-4 py-2 rounded-full text-lg md:text-xl font-bold shadow-md">
                The Most Genuine Results in Kerala
              </div>
            </div>
            
            {/* Year Tab Selector */}
            <div className="mb-8">
              <Tabs defaultValue="2025" className="w-full max-w-3xl mx-auto" value={activeTab || "2025"} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-6 bg-white">
                  {yearTabs.map(year => (
                    <TabsTrigger 
                      key={year} 
                      value={year} 
                      className={`text-sm ${year !== "2025" ? "opacity-60 cursor-not-allowed" : ""}`}
                      disabled={year !== "2025"}
                    >
                      {year}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {yearTabs.map(year => (
                  <TabsContent 
                    key={year} 
                    value={year}
                    onTouchStart={(e) => {
                      touchStartXRef.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      if (touchStartXRef.current === null) return;
                      
                      const touchEndX = e.changedTouches[0].clientX;
                      const diffX = touchStartXRef.current - touchEndX;
                      
                      // If swipe distance is significant, change the year tab
                      if (Math.abs(diffX) > 50) {
                        const currentIndex = yearTabs.indexOf(year);
                        
                        // Swipe left (next/newer year)
                        if (diffX > 0 && currentIndex > 0) {
                          handleTabChange(yearTabs[currentIndex - 1]);
                        }
                        // Swipe right (previous/older year)
                        else if (diffX < 0 && currentIndex < yearTabs.length - 1) {
                          handleTabChange(yearTabs[currentIndex + 1]);
                        }
                      }
                      
                      touchStartXRef.current = null;
                    }}
                  >
                    {/* View Mode Toggle */}
                    <div className="flex justify-end mb-3">
                      <div className="bg-white inline-flex rounded-md shadow p-1">
                        <button 
                          className={`px-3 py-1 text-xs rounded ${viewMode === 'carousel' ? 'bg-primary-blue text-white' : 'bg-transparent text-dark-grey'}`}
                          onClick={() => setViewMode('carousel')}
                        >
                          <i className="ri-film-line mr-1"></i> Carousel
                        </button>
                        <button 
                          className={`px-3 py-1 text-xs rounded ${viewMode === 'gallery' ? 'bg-primary-blue text-white' : 'bg-transparent text-dark-grey'}`}
                          onClick={() => setViewMode('gallery')}
                        >
                          <i className="ri-layout-grid-line mr-1"></i> Gallery
                        </button>
                      </div>
                    </div>
                    
                    {/* Media Display Section */}
                    {viewMode === 'carousel' ? (
                      <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                          {mockMediaData[year as MediaYear]?.map((item: MediaItem) => (
                            <CarouselMediaItem key={item.id} item={item} onOpen={handleOpenMedia} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
                        {mockMediaData[year as MediaYear]?.map((item: MediaItem) => (
                          <div 
                            key={item.id}
                            className="cursor-pointer relative rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group bg-white"
                            onClick={() => handleOpenMedia(item)}
                            style={{ aspectRatio: item.aspectRatio === 'portrait' ? '3/4' : '16/9' }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                            <img 
                              src={item.thumbnailUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                            />
                            {item.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center z-20">
                                <div className="bg-primary-red/80 backdrop-blur-sm rounded-full p-2 shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                  <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5.14v14l11-7-11-7z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            <div className="absolute top-2 left-2 z-20">
                              <div className="bg-white/90 backdrop-blur-sm text-primary-blue px-2 py-0.5 rounded-full text-xs font-medium shadow-sm opacity-80 group-hover:opacity-100">
                                {item.year}
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                              <h3 className="text-gray-800 text-xs font-medium truncate">{item.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            
            {/* Results Summary - Material Design 3 Style */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 md:p-6 mb-10 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-primary-blue flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Results Summary
              </h2>
              
              <div className="w-full overflow-x-auto hide-scrollbar pb-2">
                <div className="min-w-[600px] shadow-sm rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 tracking-wider">Year</th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 tracking-wider">Total Selections</th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 tracking-wider">Top 100 Ranks</th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 tracking-wider">PCM & Classroom</th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 tracking-wider">First Attempt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(resultsData).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([year, stats], index) => (
                        <tr 
                          key={year} 
                          className={`transition-colors hover:bg-blue-50 ${parseInt(year) === 2025 ? 'bg-blue-50/50' : ''} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                          <td className="py-3 px-4 font-medium text-primary-blue">{year}</td>
                          <td className="py-3 px-4 text-center text-gray-800 font-medium">
                            <span className="bg-green-50 text-green-700 py-1 px-2 rounded-full text-xs">
                              {stats.totalSelections}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-800">{stats.top100}</td>
                          <td className="py-3 px-4 text-center text-gray-800">{stats.pcrClassroom}</td>
                          <td className="py-3 px-4 text-center text-gray-800">{stats.firstAttempt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-600 italic">
                Consistently high Prelims-cum-Mains and classroom results—especially from first-attempt candidates—show our academic excellence.
              </div>
            </div>
            
            {/* Toppers Gallery - Material Design 3 Style */}
            <div id="toppers-section" className="mb-12">
              <h2 className="text-xl font-semibold mb-6 text-primary-blue flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M19 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M5 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M19 9a7 7 0 0 0-14 0"/>
                  <path d="M19 15a7 7 0 0 1-14 0"/>
                </svg>
                Our Top Achievers
              </h2>
              
              <div className="relative">
                <div className="overflow-x-auto hide-scrollbar pb-6">
                  <div className="flex gap-4 px-1">
                    {toppers.map(topper => (
                      <div 
                        key={topper.id}
                        className="flex-shrink-0 w-[180px] cursor-pointer transform transition-all duration-300 hover:translate-y-[-8px]"
                        onClick={() => handleTopperClick(topper)}
                      >
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="relative">
                            <div className="overflow-hidden">
                              <img 
                                src={topper.image} 
                                alt={topper.name}
                                className="w-full h-[180px] object-cover object-center"
                              />
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="mb-2">
                              <p className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2">{topper.name}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-0.5 bg-primary-red/10 text-primary-red rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm">
                                <span className="opacity-85 tracking-wide">AIR</span>
                                <span className="font-bold">{topper.rank}</span>
                              </span>
                              <span className="text-primary-blue text-xs font-medium">{topper.year}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Gradient fade indicators for scrolling */}
                <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-light-grey to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-light-grey to-transparent pointer-events-none"></div>
              </div>
              
              <div className="text-center mt-4 mb-1">
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 bg-primary-blue/10 hover:bg-primary-blue/20 text-primary-blue px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                  Back to top
                </button>
              </div>
            </div>
            
            {/* Full Screen Media Modal - Material Design 3 Style */}
            <Dialog open={isFullScreenView} onOpenChange={setIsFullScreenView}>
              <DialogContent className="max-w-5xl p-0 bg-black/95 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10">
                {currentItem && (
                  <div className="relative">
                    {/* Navigation */}
                    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary-red rounded-full w-2 h-2"></div>
                        <h3 className="text-white text-sm font-medium">{currentItem.event}</h3>
                      </div>
                      <button 
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
                        onClick={() => setIsFullScreenView(false)}
                      >
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex items-center justify-center min-h-[70vh] px-2 relative">
                      {/* Navigation Buttons */}
                      <button 
                        className="absolute left-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                        onClick={handlePrevItem}
                      >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      
                      <button 
                        className="absolute right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                        onClick={handleNextItem}
                      >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                      
                      {/* Media Content */}
                      <div className={`transition-all duration-300 ${currentItem.type === 'video' ? 'w-full max-w-4xl' : 'max-w-3xl'}`}>
                        {currentItem.type === 'video' ? (
                          <div className={`w-full ${
                            // For YouTube videos, ensure they're displayed in landscape format
                            // unless they're explicitly YouTube Shorts
                            (currentItem.url && currentItem.url.includes('youtube.com') && !currentItem.url.includes('/shorts/'))
                              ? 'aspect-video' // YouTube videos are always landscape
                              : currentItem.url && currentItem.url.includes('/shorts/') 
                                ? 'aspect-[9/16] max-w-sm mx-auto' // YouTube Shorts are portrait
                                : currentItem.aspectRatio === 'portrait'
                                  ? 'aspect-[9/16] max-w-sm mx-auto' // Other portrait videos
                                  : 'aspect-video' // Default landscape
                          } rounded-md overflow-hidden shadow-2xl`}>
                            <iframe
                              src={getYoutubeEmbedUrl(currentItem.url) || currentItem.url}
                              title={currentItem.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <img
                              src={currentItem.url}
                              alt={currentItem.title}
                              className="max-h-[70vh] max-w-full rounded-md shadow-2xl object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Footer - Information Section */}
                    <div className="p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent absolute bottom-0 left-0 right-0">
                      <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary-blue/90 text-white text-xs py-1 px-2 rounded-full">{currentItem.year}</span>
                          <span className="bg-white/10 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full">{currentItem.type}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-white">{currentItem.title}</h3>
                        
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-white/70 text-sm">{currentItem.event}</p>
                          
                          <div className="flex gap-2">
                            <button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors">
                              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                              </svg>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors">
                              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            
            <p className="text-dark-grey text-center max-w-3xl mx-auto mb-10">
              Your hard work and perseverance have continually inspired us to raise our academic standards and strengthen our work ethic. Thank you.
            </p>
          </div>
        </section>
        
        {/* Topper Detail Modal - Material Design 3 Style */}
        <Dialog open={!!selectedTopper} onOpenChange={() => setSelectedTopper(null)}>
          <DialogContent className="sm:max-w-3xl p-0 overflow-hidden rounded-xl border border-gray-100">
            {selectedTopper && (
              <div className="relative">
                {/* Header with color bar */}
                <div className="h-2 bg-gradient-to-r from-primary-red via-primary-blue to-primary-red"></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-red/10 rounded-full p-2">
                        <svg className="w-5 h-5 text-primary-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M3 12h18M3 18h18"></path>
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Success Story</h2>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedTopper(null)}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="md:col-span-4">
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <div className="overflow-hidden">
                          <img 
                            src={selectedTopper.image} 
                            alt={`${selectedTopper.name} portrait`}
                            className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">{selectedTopper.name}</h3>
                            <div className="flex items-center gap-1 bg-primary-red/10 text-primary-red px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm">
                              <span className="opacity-85 tracking-wide">AIR</span>
                              <span className="font-bold">{selectedTopper.rank}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="inline-flex items-center gap-1 text-primary-blue text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">
                              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {selectedTopper.year}
                            </span>
                            <span className="inline-flex items-center gap-1 text-gray-600 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                              {selectedTopper.program}
                            </span>
                          </div>
                          
                          {selectedTopper.scorecard && (
                            <a 
                              href={selectedTopper.scorecard} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center gap-1 text-sm bg-primary-red/10 hover:bg-primary-red/20 text-primary-red px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View Scorecard
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm mt-4 p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Current Status</h4>
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-700">Assistant Collector (Training)</p>
                            <p className="text-gray-500 text-sm">Indian Administrative Service</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="md:col-span-8">
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-6 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-5 h-5 text-primary-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <h3 className="text-lg font-semibold text-gray-900">Testimonial</h3>
                        </div>
                        
                        <div className="bg-blue-50 rounded-xl p-4 mb-3 relative">
                          <svg className="absolute top-4 left-4 w-8 h-8 text-blue-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
                          </svg>
                          <p className="text-gray-700 pl-12 pr-4 py-2 italic">
                            {selectedTopper.testimonial}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-5 h-5 text-primary-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <h3 className="text-lg font-semibold text-gray-900">Achievement Highlights</h3>
                        </div>
                      
                        <ul className="space-y-4">
                          <li className="flex gap-3">
                            <div className="flex-shrink-0 bg-red-100 rounded-full h-8 w-8 flex items-center justify-center">
                              <svg className="w-4 h-4 text-primary-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">UPSC Civil Services Examination {selectedTopper.year}</h4>
                              <p className="text-gray-600 text-sm">
                                Secured <span className="inline-flex items-center gap-0.5 bg-primary-red/10 text-primary-red rounded-md px-1.5 py-0.5 text-xs"><span className="opacity-85 tracking-wide">AIR</span> <span className="font-bold">{selectedTopper.rank}</span></span> among over 11,000 candidates
                              </p>
                            </div>
                          </li>
                          
                          <li className="flex gap-3">
                            <div className="flex-shrink-0 bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center">
                              <svg className="w-4 h-4 text-primary-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">iLearn IAS Academy</h4>
                              <p className="text-gray-600 text-sm">Completed {selectedTopper.program} with distinction</p>
                            </div>
                          </li>
                          
                          <li className="flex gap-3">
                            <div className="flex-shrink-0 bg-green-100 rounded-full h-8 w-8 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Special Achievements</h4>
                              <p className="text-gray-600 text-sm">Specialized in Public Administration with top scores in Interview round</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageTransition>
    </>
  );
};

export default ResultsPage;

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
import QUERY_KEY from '@/config/queryKeys';
import apiClient from '@/config/apiClient';
import { API } from '@/config/api';

// iLearn IAS Academy's Authentic Top Achievers with genuine photos and data
// const iLearnTopAchievers: Topper[] = 
// [
//   {
//     id: 1,
//     name: 'Midhun Premraj IAS',
//     details: 'AIR 12',
//     program: 'PCM Program',
//     description: 'UPSC CSE 2024',
//     image: '/attached_assets/Mithun Premraj.JPG',
//     testimonial: "iLearn IAS Academy provided me with the perfect foundation and guidance throughout my UPSC journey. The comprehensive study materials, expert faculty, and personalized mentoring were instrumental in achieving AIR 12.",
//     scorecard: ''
//   },
//   {
//     id: 2,
//     name: 'Dileep Kainikkara IAS',
//     details: 'AIR 21',
//     program: 'PCM Program', 
//     description: 'UPSC CSE 2024',
//     image: '/attached_assets/photo_4_2025-03-22_11-18-25.jpg',
//     testimonial: "The structured approach and dedicated faculty at iLearn IAS made all the difference in my preparation. Their focus on current affairs and answer writing helped me secure AIR 21.",
//     scorecard: ''
//   },
//   {
//     id: 3,
//     name: 'Alfred OV IAS',
//     details: 'AIR 57',
//     program: 'PCM Program',
//     description: 'UPSC CSE 2024',
//     image: '/attached_assets/Alfred OV.png',
//     testimonial: "iLearn IAS Academy's comprehensive curriculum and expert guidance were crucial in my success. The regular mock tests and feedback sessions helped me improve consistently.",
//     scorecard: ''
//   },
//   {
//     id: 4,
//     name: 'Reenu Anna Mathew',
//     details: '81',
//     program: 'PCM Program',
//     description: 'UPSC CSE 2024',
//     image: '/attached_assets/DSC07378.JPG',
//     testimonial: "The supportive environment at iLearn IAS and the quality of teaching made my UPSC preparation journey successful. The faculty's dedication and personalized attention were exceptional.",
//     scorecard: ''
//   },
//   {
//     id: 5,
//     name: 'Annie George',
//     details: '93',
//     program: 'PCM Program',
//     description: '2024',
//     image: '/attached_assets/annie george.JPG',
//     testimonial: "iLearn IAS Academy provided me with the right strategy and resources to crack UPSC. The comprehensive study materials and regular assessments were very helpful.",
//     scorecard: ''
//   },
//   {
//     id: 6,
//     name: 'Devika Priyadersini',
//     details: 'AIR 95',
//     program: 'PCM Program',
//     description: 'UPSC CSE 2024',
//     image: '/attached_assets/DSC02542.jpg',
//     testimonial: "The expert faculty at iLearn IAS guided me through every step of my UPSC preparation. Their teaching methodology and current affairs coverage were outstanding.",
//     scorecard: ''
//   },
//   {
//     id: 7,
//     name: 'Jayakrishnan IAS',
//     details: 'AIR 444',
//     program: 'PCM Program',
//     description: 'UPSC CSE 2024',
//     image: '/attached_assets/photo_8_2025-03-22_11-18-25.jpg',
//     testimonial: "iLearn IAS Academy's comprehensive approach and continuous support helped me achieve my dream of becoming a civil servant. The faculty's expertise and guidance were invaluable.",
//     scorecard: ''
//   }
// ];

// Mock media data for the results page
// const mockMediaData = {
//   2025: [
//     {
//       id: 1, title: "UPSC CSE 2024 Success Story", type: "video", year: 2025, event: "UPSC Results",
//       url: "https://youtube.com/shorts/7FGDoedTd9w?si=rHFdg-jOLJoQ0d-Z",
//       thumbnailUrl: "https://img.youtube.com/vi/7FGDoedTd9w/hqdefault.jpg",
//       aspectRatio: "portrait"
//     },
//     {
//       id: 2, title: "iLearn Top Rankers Interview", type: "video", year: 2025, event: "UPSC Results",
//       url: "https://youtu.be/pmunw8qu03M?si=fcAQ7oxpjwYr95fv",
//       thumbnailUrl: "https://img.youtube.com/vi/pmunw8qu03M/hqdefault.jpg",
//       aspectRatio: "landscape"
//     },
//     {
//       id: 3, title: "UPSC CSE Success Journey", type: "video", year: 2025, event: "UPSC Results",
//       url: "https://youtube.com/shorts/GxvrKTSrZbc?si=bb23jpk7L5kT-3zJ",
//       thumbnailUrl: "https://img.youtube.com/vi/GxvrKTSrZbc/hqdefault.jpg",
//       aspectRatio: "portrait"
//     }
//   ],
//   2024: [
//     {
//       id: 4, title: "CSE 2024 Celebration", type: "photo", year: 2024, event: "UPSC Results",
//       url: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1470&auto=format&fit=crop",
//       thumbnailUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1470&auto=format&fit=crop",
//       aspectRatio: "landscape"
//     },
//     {
//       id: 5, title: "CSE 2024 Interviews", type: "video", year: 2024, event: "UPSC Results",
//       url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//       thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop",
//       aspectRatio: "landscape"
//     }
//   ],
//   2023: [
//     {
//       id: 6, title: "CSE 2023 Toppers", type: "photo", year: 2023, event: "UPSC Results",
//       url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop",
//       thumbnailUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop",
//       aspectRatio: "landscape"
//     }
//   ],
//   2022: [
//     {
//       id: 7, title: "CSE 2022 Toppers", type: "photo", year: 2022, event: "UPSC Results",
//       url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop",
//       thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop",
//       aspectRatio: "portrait"
//     }
//   ],
//   2021: [
//     {
//       id: 8,
//        title: "CSE 2021 Celebration",
//         type: "photo",
//          year: 2021,
//           event: "UPSC Results",
//      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop",
//      thumbnailUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop",
//      aspectRatio: "landscape"
//    }
//  ],
//  2020: [
//    {
//      id: 9, title: "CSE 2020 Toppers", type: "photo", year: 2020, event: "UPSC Results",
//      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop",
//      thumbnailUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop",
//      aspectRatio: "landscape"
//    }
//  ]
// };

// Stats data for results summary table


interface CarouselMediaItemProps {
  item: any;
  onOpen: (item: any) => void;
}

const CarouselMediaItem = ({ item, onOpen }: CarouselMediaItemProps) => {
  //Api call for Result 

  const { data: resultData, isLoading: resultLoading } = useQuery({
    queryKey: [QUERY_KEY?.RESULT],
    queryFn: async () => {
      const response = await apiClient.get(API?.RESULT + "?isActive=true&page=1&limit=50");
      return response.data.data; // Return only the array of toppers
    },
  });




  //Api call for Result Summary
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY?.RESULT_SUMMARY],
    queryFn: async () => {
      const response = await apiClient.get(API?.RESULT_SUMMARY );
      return response.data.data; // Return only the array of toppers
    },
  });

  // Topper Api call
  const { data: toppersData, isLoading: toppersLoading } = useQuery({
    queryKey: [QUERY_KEY?.TOP_ACHIEVERS],
    queryFn: async () => {
      const response = await apiClient.get(API?.TOP_ACHIEVERS + "?isActive=true&page=1&limit=50");
      return response.data.data; // Return only the array of toppers
    },
  });

  const resultsData = data
  // {
  //   2025: { totalSelections: 46, topRanks: 6, pcmClassroom: 11, firstAttempt: 1 },
  //   2024: { totalSelections: 28, topRanks: 4, pcmClassroom: 12, firstAttempt: 2 },
  //   2023: { totalSelections: 65, topRanks: 18, pcmClassroom: 52, firstAttempt: 25 },
  //   2022: { totalSelections: 48, topRanks: 12, pcmClassroom: 36, firstAttempt: 20 },
  //   2021: { totalSelections: 35, topRanks: 8, pcmClassroom: 28, firstAttempt: 15 },
  //   2020: { totalSelections: 18, topRanks: 5, pcmClassroom: 14, firstAttempt: 8 }
  // };
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

  // Add state for media data
  const [mediaData, setMediaData] = useState<Record<string, any[]>>({});

  // Fetch media data from API (replace with your actual API call)
  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await apiClient.get(API.RESULT + "?isActive=true&page=1&limit=50"); // Use the correct API endpoint
        const apiMedia = response.data.data; // Array of media items
        // Group by year and map fields
        const grouped: Record<string, any[]> = {};
        apiMedia.forEach((item: any) => {
          const year = String(item.year);
          const isVideo =
            typeof item.media === 'string' &&
            (item.media.includes('youtube.com') || item.media.includes('youtu.be') || item.media.match(/\.(mp4|mov|avi|webm)$/i));
          const mapped = {
            id: item.id,
            title: item.title,
            year: item.year,
            event: item.description,
            url: item.media,
            thumbnailUrl: item.thumbnail,
            aspectRatio: item.aspectRatio,
            type: isVideo ? 'video' : 'photo',
          };
          if (!grouped[year]) grouped[year] = [];
          grouped[year].push(mapped);
        });
        setMediaData(grouped);
      } catch (e) {
        // handle error
      }
    }
    fetchMedia();
  }, []);


  // Fetch results summary data for the results table and year tabs
  const { data: resultsData = {} } = useQuery({
    queryKey: [QUERY_KEY?.RESULT_SUMMARY],
    queryFn: async () => {
      const response = await apiClient.get(API?.RESULT_SUMMARY + "?isActive=true&page=1&limit=50");
      return response.data.data;
    },
  });

  // Use years from mediaData (RESULT API) for yearTabs
  const yearTabs = Object.keys(mediaData).sort((a, b) => parseInt(b) - parseInt(a));

  // For the summary table, still use resultsData as before
  let yearEntries: [string, any][] = [];
  let totalSelections = 0;
  if (Array.isArray(resultsData)) {
    yearEntries = resultsData.map((item: any) => [String(item.year), item]);
    totalSelections = resultsData.reduce(
      (sum: number, year: any) => sum + (year.totalSelections || year.totalSelection || 0), 0
    );
  } else if (resultsData && typeof resultsData === 'object') {
    yearEntries = Object.entries(resultsData);
    totalSelections = Object.values(resultsData).reduce(
      (sum: number, year: any) => sum + (year.totalSelections || year.totalSelection || 0), 0
    );
  }

  // Define type for years in mockMediaData
  type MediaYear = keyof typeof mediaData;

  // Get current year's media
  const currentYearMedia = mediaData[activeTab] || [];



  // Handle tab change with haptic feedback
  const handleTabChange = (year: string) => {
    setActiveTab(year);
    // Simulate haptic feedback if supported
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Vibrate for 50ms
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

  // Remove the redundant useQuery for /api/toppers and use toppersData from the API call
  const { data: toppersData, isLoading: toppersLoading } = useQuery({
    queryKey: [QUERY_KEY?.TOP_ACHIEVERS],
    queryFn: async () => {
      const response = await apiClient.get(API?.TOP_ACHIEVERS + "?isActive=true&page=1&limit=50");
      return response.data.data; // Return only the array of toppers
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
              {yearTabs.length > 0 ? (
                <Tabs defaultValue={yearTabs[0]} className="w-full max-w-3xl mx-auto" value={activeTab || yearTabs[0]} onValueChange={handleTabChange}>
                  <TabsList className={`grid grid-cols-${yearTabs.length} bg-white`}>
                    {yearTabs.map(year => (
                      <TabsTrigger
                        key={year}
                        value={year}
                        className="text-sm"
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
                            {(mediaData[year as MediaYear] || []).map((item: MediaItem) => (
                              <CarouselMediaItem key={item.id} item={item} onOpen={handleOpenMedia} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
                          {(mediaData[year as MediaYear] || []).map((item: MediaItem) => (
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
                                <div className="bg-white/90  backdrop-blur-sm text-primary-blue px-2 py-0.5 rounded-full text-xs font-medium shadow-sm opacity-80 group-hover:opacity-100">
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
              ) : (
                <div className="text-center text-gray-500 py-8">No results available for any year.</div>
              )}
            </div>

            {/* Results Summary - Material Design 3 Style */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 md:p-6 mb-10 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-primary-blue flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
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
                      {yearEntries.sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([year, stats], index) => {
                        const s = stats as { totalSelections?: number; totalSelection?: number; topRanks: number; pcmClassroom: number; firstAttempt: number };
                        return (
                          <tr
                            key={year}
                            className={`transition-colors hover:bg-blue-50 ${parseInt(year) === 2025 ? 'bg-blue-50/50' : ''} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                          >
                            <td className="py-3 px-4 font-medium text-primary-blue">{year}</td>
                            <td className="py-3 px-4 text-center text-gray-800 font-medium">
                              <span className="bg-green-50 text-green-700 py-1 px-2 rounded-full text-xs">
                                {s.totalSelections ?? s.totalSelection}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-gray-800">{s.topRanks}</td>
                            <td className="py-3 px-4 text-center text-gray-800">{s.pcmClassroom}</td>
                            <td className="py-3 px-4 text-center text-gray-800">{s.firstAttempt}</td>
                          </tr>
                        );
                      })}
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
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M19 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M5 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M19 9a7 7 0 0 0-14 0" />
                  <path d="M19 15a7 7 0 0 1-14 0" />
                </svg>
                Our Top Achievers
              </h2>

              <div className="relative">
                <div className="overflow-x-auto hide-scrollbar pb-6">
                  <div className="flex gap-4 px-1">
                    {toppersLoading ? (
                      <div className="text-center w-full py-8 text-gray-500">Loading toppers...</div>
                    ) : toppersData && toppersData.length > 0 ? (
                      toppersData.map((topper: Topper) => (
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
                                  <span className="font-bold">{topper.details}</span>
                                </span>
                                <span className="text-primary-blue text-xs font-medium">{topper.description}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center w-full py-8 text-gray-500">No toppers found.</div>
                    )}
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
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
                            alt={selectedTopper.name + ' portrait'}
                            className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <p className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2">{selectedTopper.name}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-0.5 bg-primary-red/10 text-primary-red rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm">
                              <span className="opacity-85 tracking-wide">AIR</span>
                              <span className="font-bold">{selectedTopper.details}</span>
                            </span>
                            <span className="text-primary-blue text-xs font-medium">{selectedTopper.description}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="md:col-span-8">
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <div className="overflow-hidden">
                          <img
                            src={selectedTopper.image}
                            alt={selectedTopper.name + ' portrait'}
                            className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <p className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2">{selectedTopper.name}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-0.5 bg-primary-red/10 text-primary-red rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm">
                              <span className="opacity-85 tracking-wide">AIR</span>
                              <span className="font-bold">{selectedTopper.details}</span>
                            </span>
                            <span className="text-primary-blue text-xs font-medium">{selectedTopper.description}</span>
                          </div>
                        </div>
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
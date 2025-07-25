import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Milestone as BaseMilestone, MilestoneImage } from '@shared/schema';
import MilestoneToppersImage from './MilestoneToppersImage';
import Milestone2024Image from './Milestone2024Image';
import QUERY_KEY from '@/config/queryKeys';
import apiClient from '@/config/apiClient';
import { API } from '@/config/api';

type Milestone = BaseMilestone & {
  isImage: boolean;
  media?: string;
};

const MilestoneTimeline = () => {



  

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY?.JOURNEY],
    queryFn: async () => {
      const response = await apiClient.get(API?.JOURNEY);
      return response.data.data; // Return only the array of toppers
    },
  });


  // State for active milestone
  const [activeMilestoneId, setActiveMilestoneId] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Static milestone data arranged in reverse chronological order (2025 to 2015)
  const milestones: Milestone[] = [
    {
      id: 9,
      year: "2025",
      title: "Future Vision",
      description: "Continuing to lead civil service coaching with cutting-edge technology, personalized learning paths, and maintaining our position as Kerala's top UPSC coaching institute with unwavering commitment to student success.",
      displayOrder: 1,
      isDefault: true,
      createdAt: new Date(),
      isImage: true,
      media: "/client/src/assets/uploaded/logo.jpg"
    },
    {
      id: 10,
      year: "2024",
      title: "Strategic Growth",
      description: "Expanded our reach and impact with enhanced digital platforms, new program offerings, and strengthened our position as Kerala's leading UPSC coaching institute with record-breaking student success rates.",
      displayOrder: 2,
      isDefault: false,
      createdAt: new Date(),
      isImage: true,
      media: "/client/src/assets/uploaded/new-logo.png"
    },
    {
      id: 8,
      year: "2023",
      title: "Innovation & Excellence",
      description: "Continued our journey of innovation with advanced teaching methodologies and technology integration. Our commitment to excellence remains unwavering.",
      displayOrder: 3,
      isDefault: false,
      createdAt: new Date(),
      isImage: false,
      media: "https://www.youtube.com/embed/fbfH3RAewCQ"
    },
    {
      id: 7,
      year: "2022",
      title: "Kerala's Best Results",
      description: "Achieved Kerala's highest success rate in UPSC examinations through our PCM Classroom Program. Our proven methodology and dedicated faculty created history.",
      displayOrder: 4,
      isDefault: false,
      createdAt: new Date(),
      isImage: false,
      media: "https://www.youtube.com/embed/TaFSTn5XfTo?rel=0"
    },
    {
      id: 6,
      year: "2021",
      title: "Digital Transformation",
      description: "Embraced digital learning platforms and hybrid teaching methods. Our adaptability during challenging times ensured uninterrupted learning for all students.",
      displayOrder: 5,
      isDefault: false,
      createdAt: new Date(),
      isImage: false,
      media: "https://www.youtube.com/embed/xVNRlQGQqWk?rel=0"
    },
    {
      id: 5,
      year: "2020",
      title: "Residential Campus",
      description: "Opened our state-of-the-art residential campus, providing students with a conducive learning environment. Despite challenges, we continued to deliver quality education and support.",
      displayOrder: 6,
      isDefault: false,
      createdAt: new Date(),
      isImage: false,
      media: "https://www.youtube.com/embed/cZkjyk5oloU?rel=0"
    },
    {
      id: 4,
      year: "2019",
      title: "Mentorship Program Launch",
      description: "Launched our comprehensive mentorship program, providing personalized guidance to each student. This initiative significantly improved our success rates and student satisfaction.",
      displayOrder: 7,
      isDefault: false,
      createdAt: new Date(),
      isImage: false,
      media: "https://www.youtube.com/embed/03PnA2QsJwk?rel=0"
    },
    {
      id: 3,
      year: "2018",
      title: "Expansion Year",
      description: "With growing demand and proven results, we expanded our infrastructure and faculty. New programs were introduced to cater to diverse student needs and learning preferences.",
      displayOrder: 8,
      isDefault: false,
      createdAt: new Date(),
      isImage: false,
      media: "https://www.youtube.com/embed/_-P0BIRarJE?rel=0"
    },
    {
      id: 2,
      year: "2017",
      title: "First Batch Success",
      description: "Our first batch of students achieved remarkable success in the UPSC examinations, establishing our reputation as a reliable coaching institute. This milestone marked the beginning of our legacy of excellence.",
      displayOrder: 9,
      isDefault: false,
      createdAt: new Date(),
      isImage: false,
      media: "https://www.youtube.com/embed/9NyxU2M7UUQ?rel=0"
    },
    {
      id: 1,
      year: "2015",
      title: "Foundation Year",
      description: "iLearn IAS Academy was established with a vision to provide quality civil service coaching. Starting with a small team and big dreams, we laid the foundation for what would become Kerala's premier coaching institute.",
      displayOrder: 10,
      isDefault: false,
      createdAt: new Date(),
      isImage: true,
      media: undefined
    }
  ];

  const milestonesLoading = false;
  const defaultMilestone = milestones.find(m => m.isDefault) || milestones[milestones.length - 1];
  const milestoneImages: MilestoneImage[] = [];
  const imagesLoading = false;

  // Set default milestone as active when data is loaded
  useEffect(() => {
    if (defaultMilestone && !activeMilestoneId) {
      setActiveMilestoneId(defaultMilestone.id);
      console.log("Setting default milestone ID:", defaultMilestone.id);
    } else if (milestones.length > 0 && !activeMilestoneId) {
      // If no default milestone, use the first one
      setActiveMilestoneId(milestones[0].id);
      console.log("Setting first milestone ID:", milestones[0].id);
    }
  }, [defaultMilestone, milestones, activeMilestoneId]);

  // Get the active milestone and image
  const activeMilestone = milestones.find(m => m.id === activeMilestoneId);
  const activeMilestoneImage = milestoneImages[0]; // Use first image for now
  
  // Debug logging
  useEffect(() => {
    console.log("Current active milestone:", activeMilestone);
    console.log("Current active milestone ID:", activeMilestoneId);
    console.log("Current active milestone images:", milestoneImages);
  }, [activeMilestone, milestoneImages, activeMilestoneId]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    // Check if we have valid touch coordinates
    if (touchStart === 0 || touchEnd === 0) return;
    
    // Minimum swipe distance: 30px
    const minSwipeDistance = 30;
    const swipeDistance = Math.abs(touchStart - touchEnd);
    
    // Only process if we have significant swipe movement
    if (swipeDistance >= minSwipeDistance) {
      // Get current milestone index
      const currentIndex = milestones.findIndex(m => m.id === activeMilestoneId);
      
      if (touchStart > touchEnd) {
        // Swipe left - next milestone (newer)
        if (currentIndex < milestones.length - 1) {
          setActiveMilestoneId(milestones[currentIndex + 1].id);
        } else {
          setActiveMilestoneId(milestones[0].id); // Cycle back to first milestone
        }
      } else {
        // Swipe right - previous milestone (older)
        if (currentIndex > 0) {
          setActiveMilestoneId(milestones[currentIndex - 1].id);
        } else {
          setActiveMilestoneId(milestones[milestones.length - 1].id); // Cycle to last milestone
        }
      }
    }
    
    // Reset touch coordinates
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Function to navigate to previous milestone
  const goToPreviousMilestone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = milestones.findIndex(m => m.id === activeMilestoneId);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : milestones.length - 1;
    setActiveMilestoneId(milestones[prevIndex].id);
  };

  // Function to navigate to next milestone
  const goToNextMilestone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = milestones.findIndex(m => m.id === activeMilestoneId);
    const nextIndex = currentIndex < milestones.length - 1 ? currentIndex + 1 : 0;
    setActiveMilestoneId(milestones[nextIndex].id);
  };

  // If no milestones yet, show loading state
  if (milestonesLoading || milestones.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-32 w-full max-w-md bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage for timeline bar
  const progress = ((milestones.findIndex(m => m.id === activeMilestoneId) + 1) / milestones.length) * 100;

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* 1. Year Navigation - MD3 Style */}
      <div className="relative max-w-5xl mx-auto mb-6">
        <div className="flex justify-start overflow-x-auto hide-scrollbar py-2 px-4">
          {milestones.map((milestone) => (
            <button
              key={milestone.id}
              onClick={() => setActiveMilestoneId(milestone.id)}
              className={`flex-shrink-0 rounded-full text-center transition-all duration-300 mx-1.5 ${
                activeMilestoneId === milestone.id
                  ? 'bg-primary-blue text-white shadow-md px-5 py-2.5 font-semibold scale-110'
                  : 'bg-white text-primary-blue hover:bg-gray-50 px-4 py-2 border border-gray-200'
              }`}
            >
              {milestone.year}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Timeline Progress Bar - Material Design 3 Style */}
      <div className="max-w-4xl mx-auto mb-6 px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-primary-blue">
            {milestones[0]?.year || ''}
          </span>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-1 shadow-sm">
            <div 
              className="h-full bg-gradient-to-r from-primary-blue to-primary-red rounded-full"
              style={{ 
                width: `${progress}%`,
                transition: 'width 0.5s ease-in-out'
              }}
            ></div>
          </div>
          <span className="text-sm font-medium text-primary-red">
            {milestones[milestones.length - 1]?.year || ''}
          </span>
        </div>
      </div>

      {/* 3. Milestone Card - Enhanced Material Design 3 Style */}
      {activeMilestone && (
        <div 
          className="relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 transform hover:shadow-lg cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left/Right Swipe Indicators - Subtle visual guides */}
          <div className="absolute left-0 inset-y-0 w-10 bg-gradient-to-r from-primary-blue/5 to-transparent flex items-center justify-center opacity-30 pointer-events-none z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-blue/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          <div className="absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-primary-red/5 to-transparent flex items-center justify-center opacity-30 pointer-events-none z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-red/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Milestone Content - 2 Column Layout on Tablet+ */}
          <div className="flex flex-col md:flex-row">
            {/* Left Column: Image - Takes full width on mobile, half on desktop */}
            <div className="md:w-1/2 order-2 md:order-1 relative">
              {/* Loading indicator if image is still loading */}
              {imagesLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Image with aspect-ratio container */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                {activeMilestone?.media ? (
                  activeMilestone.isImage ? (
                    <img
                      src={activeMilestone.media}
                      alt={activeMilestone.title + ' image'}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                      <iframe
                        src={activeMilestone.media}
                        title="Milestone video"
                        frameBorder="0"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                    No image or video available
                  </div>
                )}
              </div>
              
              {/* Year badge overlaid on image - MD3 surface floating treatment */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-primary-blue font-bold py-1 px-3 rounded-full shadow-sm text-sm md:text-base">
                {activeMilestone.year}
              </div>
            </div>
            
            {/* Right Column - Content - Takes full width on mobile, half on desktop */}
            <div className="md:w-1/2 order-1 md:order-2 flex flex-col">
              {/* Right Column Top: Title */}
              <div className="p-4 md:p-6 bg-primary-blue text-white">
                <h3 className="text-xl md:text-2xl font-bold">
                  {activeMilestone.year === "2022" 
                    ? "Kerala's best results from PCM Classroom Program" 
                    : activeMilestone.title}
                </h3>
              </div>
              
              {/* Right Column Bottom: Description & Navigation with MD3 spacing */}
              <div 
                className="p-4 md:p-8 bg-white flex flex-col flex-grow"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Milestone Description - MD3 baseline spacing */}
                <p className="text-gray-700 text-sm md:text-lg leading-tight md:leading-relaxed mb-6 md:mb-8">
                  {activeMilestone.year === "2022" 
                    ? "Kerala's best results from PCM Classroom Program"
                    : activeMilestone.year === "2023"
                    ? "iLearn is a complete learning package"
                    : activeMilestone.year === "2020"
                    ? "Highest Success Rate in Kerala from Classroom Programs"
                    : activeMilestone.year === "2019"
                    ? "Hamna Mariyam's extraordinary success"
                    : activeMilestone.year === "2018"
                    ? "Hamna Mariyam's Extraordinary Success"
                    : activeMilestone.year === "2017"
                    ? "First Major Result : Athul Janardanan IFS became State Topper"
                    : activeMilestone.description}
                </p>
                
                {/* Navigation Controls - MD3 standard spacing */}
                <div 
                  className="flex justify-center gap-4 md:gap-6 mt-auto pt-2"
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                >
                  {/* Previous Year Button - Compact on Mobile */}
                  <button
                    onClick={goToPreviousMilestone}
                    className="flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 bg-white border border-primary-blue/20 rounded-full text-primary-blue hover:bg-primary-blue/5 transition-colors shadow-sm relative z-20 text-xs md:text-sm"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      goToPreviousMilestone(e as any);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Prev</span>
                  </button>
                  
                  {/* Next Year Button - Compact on Mobile */}
                  <button
                    onClick={goToNextMilestone}
                    className="flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 bg-primary-blue text-white rounded-full hover:bg-primary-blue-dark transition-colors shadow-sm relative z-20 text-xs md:text-sm"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      goToNextMilestone(e as any);
                    }}
                  >
                    <span className="font-medium">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTimeline;
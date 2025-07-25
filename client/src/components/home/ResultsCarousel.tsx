import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { API } from "@/config/api";
import apiClient from "@/config/apiClient";
import QUERY_KEY from "@/config/queryKeys";

// Update Topper type for new API structure
// Remove import of Topper from '@/lib/constants' and define a local type

type Topper = {
  id: string;
  name: string;
  details: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const ResultsCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch toppers data from API using TanStack Query and apiClient
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY?.TOP_ACHIEVERS],
    queryFn: async () => {
      const response = await apiClient.get(API?.TOP_ACHIEVERS + "?isActive=true");
      return response.data.data; // Return only the array of toppers
    },
  });
  
  // Remove the fallback to iLearnAchievers, only use API data
  const toppers = data;

  // Check scroll position to update button visibility
  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }
    
    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [toppers]);

  // Scroll handlers
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 relative inline-block">
            <span className="relative z-10">Our Proud Achievers</span>
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
          </h2>
          <p className="text-neutral-600 mt-3">Success stories of India's future leaders</p>
        </div>
        
        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 border-3 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto pb-4 snap-x snap-mandatory gap-4 hide-scrollbar"
                aria-label="Toppers carousel"
              >
                {toppers && toppers.map((topper: Topper) => (
                  <div 
                    key={topper.id}
                    className="snap-start shrink-0 w-56 h-[320px] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={topper.image} 
                        alt={`${topper.name} portrait`}
                        className="w-full h-56 object-cover object-center transform transition-transform duration-300 group-hover:scale-[1.02]"
                        width="224"
                        height="224"
                      />
                    </div>
                    <div className="p-5 flex flex-col items-start gap-2">
                      <div className="bg-primary-red/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white/80 rounded-full"></span>
                        <span>
                          {typeof topper.order === 'number' ? `AIR ${topper.details}` : ''}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base text-neutral-800 line-clamp-2">
                        {topper.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 
                ${!canScrollLeft ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white hover:-translate-x-0.5'}`}
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                aria-label="Previous result"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button 
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 
                ${!canScrollRight ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white hover:translate-x-0.5'}`}
                onClick={scrollRight}
                disabled={!canScrollRight}
                aria-label="Next result"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </>
          )}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/results">
            <button className="group inline-flex items-center gap-2 px-5 py-2 bg-white border border-primary-blue/20 text-primary-blue rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-primary-blue/5">
              View All Results
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResultsCarousel;

import { useState, useCallback, useEffect } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import useEmblaCarousel from 'embla-carousel-react';
import AboutMediaCarousel from '@/components/about/AboutMediaCarousel';
import MilestoneTimeline from '@/components/about/MilestoneTimeline';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { AboutPageImage } from '@shared/schema';
import { useIsMobile } from '@/hooks/use-mobile';
import ilearnBuildingImage from '../assets/ilearn-building.jpg';

// Faculty Images
import nikhilImage from '../assets/faculty/Nikhil.png';
import vishnuSadanandImage from '../assets/faculty/Vishnu Sadanand.png';
import shinasImage from '../assets/faculty/Shinas.png';
import diasImage from '../assets/faculty/Dias.png';
import ijasImage from '../assets/faculty/Ijas.png';
import sreehariImage from '../assets/faculty/Sreehari.png';
import anoopImage from '../assets/faculty/Anoop.png';
import adhilImage from '../assets/faculty/Adhil.png';
import chitraImage from '../assets/faculty/Chitra.png';
import jishnuImage from '../assets/faculty/Jishnu.png';
import ajayImage from '../assets/faculty/Ajay.png';
import aksharImage from '../assets/faculty/Akshar.png';
import albinImage from '../assets/faculty/Albin.png';
import anandapadmanImage from '../assets/faculty/Anandapadman.png';
import jerrinImage from '../assets/faculty/Jerrin.png';
import subinImage from '../assets/faculty/Subin.png';
import reenuImage from '../assets/faculty/Reenu.png';
import dhanyaImage from '../assets/faculty/Dhanya.png';
import aswathyImage from '../assets/faculty/Aswathy.png';
import parvathyImage from '../assets/faculty/Parvathy.png';
import vishnuImage from '../assets/faculty/Vishnu.png';
import martinImage from '../assets/faculty/Marteshhh.png';
import abiSundarImage from '../assets/faculty/Abi Sundar.png';
import MediaShoutouts from '@/components/home/MediaShoutouts';

const AboutPage = () => {
  // Fetch images for different sections of the About page
  const { data: introImages = [], isLoading: isLoadingIntroImages } = useQuery({
    queryKey: ['/api/about-page-images', 'intro'],
    queryFn: () => apiRequest<AboutPageImage[]>({ 
      url: '/api/about-page-images?section=intro'
    }),
  });
  
  const [introImageIndex, setIntroImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile();
  
  // Initialize Embla Carousels with optimized options for smoother scrolling
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: isMobile ? 'center' : 'start',
    dragFree: true,
    inViewThreshold: 0.75,
    containScroll: 'trimSnaps'
  });
  const [introEmblaRef, introEmblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center', 
    dragFree: true
  });
  
  // Carousel navigation functions with improved scrolling
  const scrollCarousel = useCallback((direction: number) => {
    if (emblaApi) {
      if (direction > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
      // Update the selected index after a short delay to ensure animation has started
      setTimeout(() => {
        const currentIndex = emblaApi.selectedScrollSnap();
        setSelectedIndex(currentIndex);
      }, 100);
    }
  }, [emblaApi]);
  
  const scrollToSlide = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      setSelectedIndex(index);
    }
  }, [emblaApi]);
  
  // Effect to watch embla slide changes and handle touch interactions
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    
    // Add better touch handling for mobile
    const handlePointerDown = () => {
      document.body.classList.add('embla-dragging');
    };
    
    const handlePointerUp = () => {
      document.body.classList.remove('embla-dragging');
    };
    
    if (isMobile) {
      emblaApi.on('pointerDown', handlePointerDown);
      emblaApi.on('pointerUp', handlePointerUp);
    }
    
    return () => {
      emblaApi.off('select', onSelect);
      if (isMobile) {
        emblaApi.off('pointerDown', handlePointerDown);
        emblaApi.off('pointerUp', handlePointerUp);
      }
    };
  }, [emblaApi, isMobile]);
  
  // Functions to navigate the intro carousel
  const scrollIntroCarousel = useCallback((direction: number) => {
    if (introEmblaApi) {
      if (direction > 0) {
        introEmblaApi.scrollNext();
      } else {
        introEmblaApi.scrollPrev();
      }
    } else {
      // Fallback if embla carousel is not initialized
      if (direction > 0) {
        if (introImageIndex < introImages.length - 1) {
          setIntroImageIndex(introImageIndex + 1);
        } else {
          setIntroImageIndex(0);
        }
      } else {
        if (introImageIndex > 0) {
          setIntroImageIndex(introImageIndex - 1);
        } else {
          setIntroImageIndex(introImages.length - 1);
        }
      }
    }
  }, [introEmblaApi, introImageIndex, introImages.length]);
  
  const scrollIntroToSlide = useCallback((index: number) => {
    if (introEmblaApi) {
      introEmblaApi.scrollTo(index);
    } else {
      // Fallback if embla carousel is not initialized
      setIntroImageIndex(index);
    }
  }, [introEmblaApi]);
  
  // Update selected index when faculty carousel scrolls
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  // Update intro image index when intro carousel scrolls
  useEffect(() => {
    if (!introEmblaApi) return;
    
    const onSelect = () => {
      setIntroImageIndex(introEmblaApi.selectedScrollSnap());
    };
    
    introEmblaApi.on('select', onSelect);
    return () => {
      introEmblaApi.off('select', onSelect);
    };
  }, [introEmblaApi]);
  
  // Intro section touch handler
  const handleIntroTouchEnd = () => {
    // Minimum swipe distance: 50px
    if (touchStart - touchEnd > 50) {
      // Swipe left - next image
      if (introImageIndex < introImages.length - 1) {
        setIntroImageIndex(introImageIndex + 1);
      } else {
        setIntroImageIndex(0); // Cycle back to first image
      }
    }
    
    if (touchEnd - touchStart > 50) {
      // Swipe right - previous image
      if (introImageIndex > 0) {
        setIntroImageIndex(introImageIndex - 1);
      } else {
        setIntroImageIndex(introImages.length - 1); // Cycle to last image
      }
    }
    
    // Reset touch coordinates
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  const coreValues = [
    {
      icon: 'ri-award-line',
      title: 'Pursuit of Excellence',
      description: 'We are committed to continuous improvement in our academic programs so every student can confidently pursue—and achieve—their dream of becoming a civil-service officer who serves Bharat.'
    },
    {
      icon: 'ri-home-heart-line',
      title: 'Hospitality',
      description: 'Preparation for the civil services is a defining chapter in a student\'s life. We aim to be their "home away from home," providing the emotional support and welcoming environment that sustains them throughout the journey.'
    }
  ];
  
  // Data for faculty members
  const facultyMembers = [
    // Directors first
    {
      name: 'Nikhil Lohithakshan',
      subjects: 'Director',
      image: nikhilImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample1'
    },
    {
      name: 'Mohammed Shinas S',
      subjects: 'Director',
      image: shinasImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample3'
    },
    {
      name: 'Dias Jose',
      subjects: 'Director',
      image: diasImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample4'
    },
    {
      name: 'Jishnu Krishna',
      subjects: 'Director',
      image: jishnuImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample11'
    },
    {
      name: 'TJ Abraham',
      subjects: 'Director',
      image: null,
      videoUrl: 'https://www.youtube.com/watch?v=sample2'
    },
    
    // Faculty members
    {
      name: 'Mohammed Ijas',
      subjects: 'Senior Faculty',
      image: ijasImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample5'
    },
    {
      name: 'Sreehari',
      subjects: 'Faculty',
      image: sreehariImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample7'
    },
    {
      name: 'Anoop E K',
      subjects: 'Faculty',
      image: anoopImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample8'
    },
    {
      name: 'Adhil Shukoor',
      subjects: 'Faculty',
      image: adhilImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample9'
    },
    {
      name: 'Chithra Ashok',
      subjects: 'Faculty',
      image: chitraImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample10'
    },
    {
      name: 'Akshar Narayanan',
      subjects: 'Faculty',
      image: aksharImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample13'
    },
    {
      name: 'Reenu Anna Mathew',
      subjects: 'Faculty',
      image: reenuImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample18'
    },
    {
      name: 'Sachin',
      subjects: 'CSAT Faculty',
      image: null,
      videoUrl: 'https://www.youtube.com/watch?v=sample19'
    },
    {
      name: 'Aswathy',
      subjects: 'Faculty',
      image: aswathyImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample22'
    },
    
    // Others - Managers, Team members, etc.
    {
      name: 'Vishnu Sadanand',
      subjects: 'Academic Manager',
      image: vishnuSadanandImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample6'
    },
    {
      name: 'Ajay P',
      subjects: 'Admin Manager',
      image: ajayImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample12'
    },
    {
      name: 'Dhanya Gopan',
      subjects: 'Manager-Admissions',
      image: dhanyaImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample21'
    },
    {
      name: 'Martin Roy',
      subjects: 'Marketing Manager',
      image: martinImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample25'
    },
    {
      name: 'Abi Sundar',
      subjects: 'Creative Head',
      image: abiSundarImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample26'
    },
    {
      name: 'Albin Benny',
      subjects: 'CANA Team',
      image: albinImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample14'
    },
    {
      name: 'Parvathy Suresh',
      subjects: 'CANA Team',
      image: parvathyImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample23'
    },
    {
      name: 'Jerrin Tomy',
      subjects: 'Content Team',
      image: jerrinImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample17'
    },
    {
      name: 'Anandapadman',
      subjects: 'Mentor',
      image: anandapadmanImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample15'
    },
    {
      name: 'Subin Sabu',
      subjects: 'Mentor',
      image: subinImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample20'
    },
    {
      name: 'Vishnu Rajmohan',
      subjects: 'Mentor',
      image: vishnuImage,
      videoUrl: 'https://www.youtube.com/watch?v=sample24'
    }
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>About Us - iLearn IAS Academy</title>
        <meta name="description" content="Learn about iLearn IAS Academy, our mission, values, and history." />
      </Helmet>
      
      <div className="relative">
        {/* Hero Section with Parallax Effect */}
        <section className="pt-20 pb-16 md:pb-20 bg-gradient-to-b from-white to-light-grey relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            {/* Hero Content */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Left Column: Title and Subtitle */}
              <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-primary-blue">
                  About <span className="text-primary-red">Us</span>
                </h1>
                <div className="w-20 h-1 bg-primary-red mb-6"></div>
                <p className="text-dark-grey/90 text-lg md:text-xl leading-relaxed mb-8 text-justify">
                  Since 2015, iLearn has been transforming dreams into reality, redefining civil service coaching with trust, innovation, and care. We're not just an institute but an extended family, offering academic excellence through:
                </p>
                <div className="flex flex-col space-y-3 mb-8 text-justify">
                  <div className="flex items-start">
                    <i className="ri-user-star-fill text-primary-blue text-xl mr-3 mt-0.5"></i>
                    <span className="text-dark-grey/90 text-lg md:text-xl"><span className="text-primary-blue font-semibold bg-primary-blue/10 px-2 py-0.5 rounded-md">personal mentorship</span> tailored to individual learning needs</span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-heart-pulse-fill text-primary-blue text-xl mr-3 mt-0.5"></i>
                    <span className="text-dark-grey/90 text-lg md:text-xl"><span className="text-primary-blue font-semibold bg-primary-blue/10 px-2 py-0.5 rounded-md">continuous support</span> throughout the UPSC preparation journey</span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-calendar-check-fill text-primary-blue text-xl mr-3 mt-0.5"></i>
                    <span className="text-dark-grey/90 text-lg md:text-xl"><span className="text-primary-blue font-semibold bg-primary-blue/10 px-2 py-0.5 rounded-md">integrated learning routine</span> designed for optimal progress</span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-community-fill text-primary-blue text-xl mr-3 mt-0.5"></i>
                    <span className="text-dark-grey/90 text-lg md:text-xl"><span className="text-primary-blue font-semibold bg-primary-blue/10 px-2 py-0.5 rounded-md">supportive environment</span> that nurtures every aspirant's journey</span>
                  </div>
                </div>
                <div className="max-w-lg mx-auto md:mx-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-blue/10 flex items-center justify-center mr-4">
                      <i className="ri-award-fill text-primary-blue text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Exceptional Results</h3>
                      <p className="text-dark-grey/75">Consistently producing top UPSC rankers every year</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary-red/10 flex items-center justify-center mr-4">
                      <i className="ri-user-heart-fill text-primary-red text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Student-First Approach</h3>
                      <p className="text-dark-grey/75">Personalized mentoring with focus on holistic development</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Horizontal Carousel */}
              <div className="md:w-1/2 relative">
                {/* Simple Horizontal Carousel Container */}
                <div className="relative rounded-xl overflow-hidden shadow-md">
                  {/* Images Container */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {/* Classroom Image */}
                    <div className="flex-shrink-0 w-full snap-center">
                      <div className="aspect-w-16 aspect-h-9">
                        <img 
                          src="/assets/classroom.jpg"
                          alt="iLearn IAS Academy Classroom" 
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    
                    {/* Building Image */}
                    <div className="flex-shrink-0 w-full snap-center">
                      <div className="aspect-w-16 aspect-h-9">
                        <img 
                          src={ilearnBuildingImage}
                          alt="iLearn IAS Academy Building" 
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Carousel Navigation Dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    <button 
                      onClick={() => document.querySelector('.snap-x')?.scrollTo({ left: 0, behavior: 'smooth' })}
                      className="w-3 h-3 rounded-full bg-white/80 hover:bg-white shadow-sm"
                      aria-label="View classroom image"
                    ></button>
                    <button 
                      onClick={() => {
                        const container = document.querySelector('.snap-x');
                        if (container) container.scrollTo({ left: container.clientWidth, behavior: 'smooth' });
                      }}
                      className="w-3 h-3 rounded-full bg-white/60 hover:bg-white shadow-sm"
                      aria-label="View building image"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Journey Section - Material Design 3 Style */}
        <section className="pt-14 pb-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/5 to-primary-red/5"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            {/* 1. Our Journey Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-blue mb-2">
                Our <span className="text-primary-red">Journey</span>
              </h2>
              <div className="w-20 h-1 bg-primary-red mx-auto mb-4"></div>
              <p className="text-dark-grey/80 text-lg max-w-2xl mx-auto">
                Explore the milestones that have shaped our evolution
              </p>
            </div>
            
            {/* 2. Timeline Component */}
            <MilestoneTimeline />
          </div>
        </section>
        
        {/* Core Values Section */}
        <section className="py-16 md:py-24 bg-light-grey">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-blue mb-3">
                Core <span className="text-primary-red">Values</span>
              </h2>
              <div className="w-20 h-1 bg-primary-red mx-auto mb-6"></div>
              <p className="text-dark-grey/80 text-lg max-w-2xl mx-auto">
                The principles that guide our approach to education and student care
              </p>
            </div>
            
            {/* Core Values cards grid - Material Design 3 style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-blue/10 to-primary-red/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${value.icon} text-primary-blue text-2xl`}></i>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary-blue mb-3">{value.title}</h3>
                  <p className="text-dark-grey/80 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-blue mb-3">
                Our <span className="text-primary-red">Team</span>
              </h2>
              <div className="w-20 h-1 bg-primary-red mx-auto mb-6"></div>
              <p className="text-dark-grey/80 text-lg max-w-2xl mx-auto">
                Meet our dedicated team members who contribute to student success in the UPSC journey
              </p>
            </div>
            
            {/* Team Carousel - Enhanced for mobile */}
            <div className="relative">
              <div className="overflow-hidden md:pb-4 -mx-4 md:mx-0" ref={emblaRef}>
                <div className="flex px-4 md:px-0 touch-pan-y">
                  {facultyMembers.map((faculty, index) => (
                    <div key={index} className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2 md:px-3">
                      <div 
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md h-full active:shadow-lg active:scale-[0.99] md:active:scale-100 touch-manipulation"
                        onClick={() => isMobile && faculty.videoUrl && window.open(faculty.videoUrl, '_blank')}
                      >
                        <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden relative">
                          {faculty.image ? (
                            <>
                              <img 
                                src={faculty.image} 
                                alt={faculty.name} 
                                className="object-cover w-full h-full object-center transition-transform duration-500 hover:scale-110" 
                                loading="lazy"
                                onError={(e) => {
                                  // Fall back to a placeholder if image fails to load
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=e1effe&color=1e40af&bold=true&size=200`;
                                }}
                              />
                              {isMobile && faculty.videoUrl && (
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary-red/90 flex items-center justify-center animate-pulse">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-primary-blue/10 transition-colors duration-300 hover:bg-primary-blue/20">
                              <span className="text-xl font-bold text-primary-blue">{faculty.name.split(' ').map(name => name[0]).join('')}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 md:p-5">
                          <h3 className="text-lg md:text-xl font-bold text-primary-blue">{faculty.name}</h3>
                          <p className="text-primary-red">{faculty.subjects}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Controls - Improved for Mobile */}
              <div className="flex flex-col">
                {/* Swipe indicator for mobile */}
                <div className="text-center mb-4 text-dark-grey/60 text-sm md:hidden">
                  <span>Swipe left or right to navigate</span>
                  <div className="flex justify-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce-x-reverse ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                {/* Navigation Controls - Enhanced touch feedback */}
                <div className="flex justify-center items-center space-x-3 mt-4">
                  <button 
                    onClick={() => scrollCarousel(-1)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-blue hover:bg-primary-blue hover:text-white transition-all duration-200 shadow-sm active:scale-90 active:shadow-inner active:bg-primary-blue/10 touch-manipulation"
                    aria-label="Previous slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Dots indicator - scrollable for many dots */}
                  <div className="flex space-x-2 overflow-x-auto py-2 px-1 max-w-full scrollbar-hide touch-pan-x">
                    {Array.from({ length: Math.ceil(facultyMembers.length / (isMobile ? 1 : 3)) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSlide(idx)}
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0 rounded-full transition-all ${
                          idx === selectedIndex 
                            ? 'bg-primary-blue w-5 md:w-6 transform-gpu scale-110' 
                            : 'bg-gray-300 hover:bg-gray-400 active:bg-primary-blue/50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => scrollCarousel(1)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-blue hover:bg-primary-blue hover:text-white transition-all duration-200 shadow-sm active:scale-90 active:shadow-inner active:bg-primary-blue/10 touch-manipulation"
                    aria-label="Next slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Media Gallery Integration */}
        {/* <AboutMediaCarousel /> */}
        <MediaShoutouts />
        
        {/* Closing Call-to-Action Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary-blue/10 to-primary-red/10 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-blue mb-4">
                Ready to Begin Your <span className="text-primary-red">UPSC Journey</span> With Us?
              </h2>
              <p className="text-dark-grey/80 text-lg mb-8 max-w-2xl mx-auto">
                Join the thousands of students who have transformed their dream of becoming a civil servant into reality with iLearn IAS Academy's guidance.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/programs" className="btn-primary py-3 px-8 text-lg font-medium">
                  Explore Programs
                </a>
                <a href="/contact" className="btn-secondary py-3 px-8 text-lg font-medium">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-blue/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-red/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
// YouTube embed helper function
function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // Extract video ID from YouTube URL
  let videoId: string | null = null;

  // Regular YouTube watch URL
  if (url.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    } catch (e) {
      return null;
    }
  } 
  // Short YouTube URL
  else if (url.includes('youtu.be/')) {
    try {
      const parts = url.split('youtu.be/');
      if (parts.length < 2) return null;
      videoId = parts[1].split('?')[0].split('#')[0];
    } catch (e) {
      return null;
    }
  }
  // YouTube Shorts
  else if (url.includes('youtube.com/shorts/')) {
    try {
      const parts = url.split('youtube.com/shorts/');
      if (parts.length < 2) return null;
      videoId = parts[1].split('?')[0].split('#')[0];
    } catch (e) {
      return null;
    }
  }
  
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Program, Testimonial } from '@/lib/constants';
import { useState, useRef, useEffect } from 'react';

// Mock data for programs and testimonials
const MockPrograms: Program[] = [
  {
    id: 1,
    slug: 'upsc-general-studies',
    title: 'UPSC General Studies',
    description: 'Comprehensive coaching for UPSC General Studies papers covering all four papers with dedicated focus on each aspect of the syllabus.',
    icon: 'ri-government-line',
    duration: '12 months',
    usp: [
      'Complete syllabus coverage for GS Papers I, II, III, and IV',
      'Regular mock tests with detailed analysis',
      'Current affairs discussions and newspaper analysis',
      'Essay writing and answer presentation techniques',
      'Ethics case studies and governance analysis',
      'Science and technology updates',
      'Environmental studies and sustainable development',
      'Economic survey and budget analysis'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹85,000',
    testimonials: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    faq: [
      {
        question: 'Is this program suitable for beginners?',
        answer: 'Yes, this program is designed for aspirants at any stage of their UPSC preparation journey, including complete beginners.'
      },
      {
        question: 'How many classes are conducted per week?',
        answer: 'We conduct 6 classes per week, with additional doubt clearing sessions on weekends.'
      },
      {
        question: 'Do you provide study materials?',
        answer: 'Yes, comprehensive study materials for all subjects are provided as part of the program, along with digital access to our resource library.'
      },
      {
        question: 'Is there a fee installment option?',
        answer: 'Yes, you can pay the fees in 3 installments spread across the duration of the program.'
      }
    ]
  },
  {
    id: 2,
    slug: 'prelims-cum-mains',
    title: 'Prelims-cum-Mains Batch (PCM)',
    description: 'A comprehensive program covering both preliminary and main examinations with an integrated approach to maximize your success, providing continuous support from preparation to selection.',
    icon: 'ri-government-line',
    duration: '12 months',
    usp: [
      'No prerequisites - suitable for all aspirants regardless of background',
      'Daily 4-hour classes with flexible online or in-person attendance',
      'Complete study materials including standard textbooks',
      'Personal mentorship with dedicated 1-on-1 sessions and small group mentoring',
      'Daily guidance with morning reading recommendations through "Beacon"',
      'Evening "Chai Pe Quest" - daily Prelims practice during tea break',
      'Daily Mains answer writing practice focused on current affairs',
      'Weekly Prelims tests with elimination strategy improvement',
      'Saturday special sessions focusing on current affairs for both Prelims and Mains',
      'Access to recorded sessions for missed classes',
      'Modern air-conditioned classrooms for in-person students',
      'Integrated Prelims Test Series (iPTS) included with daily NCERT tests',
      'Mains Test Series (MTS) Program after first mains',
      'Interview guidance when you receive the call',
      'Regular interactions with toppers and civil servants for motivation',
      'Comprehensive "Prelims Edge" for daily current affairs revision'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹95,000',
    testimonials: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    faq: [
      {
        question: 'Is this program suitable for beginners?',
        answer: 'Yes, this program is designed for aspirants at any stage of their UPSC preparation journey. No prerequisites are required, and we provide personalized attention to help beginners build a strong foundation.'
      },
      {
        question: 'How many classes are conducted?',
        answer: 'We conduct daily 4-hour classes, with additional Saturday sessions for current affairs. You also receive daily guidance through our "Beacon" morning messages, "Chai Pe Quest" practice sessions, and evening "Prelims Edge" revisions.'
      },
      {
        question: 'What kind of study materials are provided?',
        answer: 'We provide comprehensive study materials including all standard textbooks, digital resources, and regular updates. Our materials are designed to cover the complete syllabus for both Prelims and Mains examinations.'
      },
      {
        question: 'Can I attend classes online?',
        answer: 'Yes, we offer flexible learning options where you can either join classes live online or attend in person at our air-conditioned, smart classrooms. All sessions are recorded so you can access them later if you miss a class.'
      },
      {
        question: 'What kind of personal attention do students receive?',
        answer: 'Each student is assigned a dedicated mentor who provides personalized guidance. You\'ll participate in weekly small-group mentorship sessions (approximately 15 students) and have access to individual 1-on-1 meetings to address personal concerns.'
      },
      {
        question: 'How does the program handle current affairs?',
        answer: 'Current affairs are covered through daily "Beacon" morning messages with must-read articles, evening "Prelims Edge" revisions, special Saturday sessions, and daily Mains answer writing practice focused on current topics.'
      },
      {
        question: 'Is there a fee installment option?',
        answer: 'Yes, you can pay the fees in installments spread across the duration of the program. Please contact our admissions office for detailed payment plans.'
      },
      {
        question: 'What happens after the Prelims examination?',
        answer: 'After Prelims, we focus on Mains preparation with our Mains Test Series (MTS) Program that emphasizes content development and answer writing skills. If you qualify for the interview, we provide comprehensive interview guidance as well.'
      }
    ]
  },
  {
    id: 2,
    slug: 'integrated-prelims-test-series',
    title: 'Integrated Prelims Test Series (iPTS)',
    description: 'Comprehensive test series focused on UPSC Preliminary examination with sectional tests and full-length mock exams.',
    icon: 'ri-draft-line',
    duration: '4 months',
    usp: [
      'Subject-wise tests',
      'Full-length mock exams',
      'Detailed performance analysis',
      'Comparative ranking',
      'Answer improvement techniques'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹25,000',
    testimonials: [1, 2],
    faq: [
      {
        question: 'How many tests are included in the series?',
        answer: 'The program includes 15 sectional tests and 8 full-length mock tests simulating the actual UPSC Prelims pattern.'
      },
      {
        question: 'How are the tests evaluated?',
        answer: 'Tests are evaluated through our advanced analytics system with detailed feedback on each question.'
      },
      {
        question: 'Is there an online option?',
        answer: 'Yes, all tests can be taken online through our iLearn app or in-person at our centers.'
      },
      {
        question: 'How frequently are the tests conducted?',
        answer: 'We conduct weekly subject-wise tests and monthly full-length mock tests.'
      }
    ]
  },
  {
    id: 3,
    slug: 'mains-test-series',
    title: 'Mains Mastery Program (MMP)',
    description: 'Comprehensive Mains preparation program featuring daily answer writing practice, masterclasses by expert faculty, and guidance from successful UPSC toppers with proven track records.',
    icon: 'ri-file-text-line',
    duration: '3.5 months (May - August)',
    usp: [
      'Daily Answer Writing Sessions with expert evaluation',
      'Masterclasses by highly qualified faculty',
      'Sessions by UPSC toppers (AIR 81, 169, 357, 822)',
      'Complete coverage of all GS papers and Essay',
      'Specialized sessions on Ethics, Current Affairs, and Optional subjects',
      'Subject-wise expert mentorship',
      'Progressive skill development from basics to advanced',
      'Regular feedback and performance tracking',
      'Comprehensive study materials and resources',
      'Small batch sizes for personalized attention'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: 'Contact for details',
    testimonials: [1, 2, 3, 4, 5],
    faq: [
      {
        question: 'What makes MMP different from other mains programs?',
        answer: 'MMP features daily answer writing practice with evaluation by expert faculty, masterclasses by subject specialists, and direct guidance from UPSC toppers with impressive ranks like AIR 81, 169, 357, and 822.'
      },
      {
        question: 'Who are the faculty members teaching in MMP?',
        answer: 'Our faculty includes Nikhil Lohithakshan (Answer Writing & Geography), Reenu Anna Mathew (AIR 81 - Economic Development), Vineeth Lohidakshan (AIR 169 - Governance & Environment), Dr. Jayesh Khaddar (Essay), and other subject experts.'
      },
      {
        question: 'How is the daily answer writing structured?',
        answer: 'The program includes daily answer writing sessions starting from June 9th, with masterclasses complementing the practice. Each session focuses on specific topics with immediate feedback and improvement techniques.'
      },
      {
        question: 'What subjects are covered in the program?',
        answer: 'Complete coverage includes History, Geography, Polity & Constitution, Economic Development, Science & Technology, Environment & Disaster Management, Ethics, International Relations, Internal Security, Governance, Social Justice, Art & Culture, and Essay writing.'
      },
      {
        question: 'When does the MMP 2025 batch commence?',
        answer: 'The program starts on May 28, 2025, with answer writing sessions beginning from June 8th onwards. The comprehensive schedule runs through August 2025.'
      }
    ]
  },
  {
    id: 4,
    slug: 'interview-guidance-program',
    title: 'Interview Guidance Program (iGP)',
    description: 'Specialized program for aspirants who have cleared the mains examination and are preparing for the personality test.',
    icon: 'ri-user-voice-line',
    duration: '2 months',
    usp: [
      'Mock interviews with experts',
      'Personality development',
      'DAF analysis',
      'Current affairs discussions',
      'Body language training'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹30,000',
    testimonials: [4, 5],
    faq: [
      {
        question: 'When should I join this program?',
        answer: 'Ideally after clearing the mains examination, about 2-3 months before your expected interview date.'
      },
      {
        question: 'How many mock interviews are conducted?',
        answer: 'The program includes 8 mock interviews with different panels including former civil servants and subject experts.'
      },
      {
        question: 'Do you provide DAF analysis?',
        answer: 'Yes, we conduct detailed DAF (Detailed Application Form) analysis and prepare you for questions based on your background.'
      },
      {
        question: 'Are the mock interviews recorded?',
        answer: 'Yes, all mock interviews are recorded for self-analysis and improvement.'
      }
    ]
  },
  {
    id: 5,
    slug: 'current-affairs',
    title: 'Current Affairs & News Analysis (CANA)',
    description: 'Stay updated with daily current affairs analysis relevant to UPSC and state civil service examinations.',
    icon: 'ri-newspaper-line',
    duration: 'Ongoing',
    usp: [
      'Daily news analysis',
      'Monthly compilations',
      'MCQ practice tests',
      'Current affairs discussions',
      'Trend analysis'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹15,000/year',
    testimonials: [1, 3],
    faq: [
      {
        question: 'How is the current affairs content delivered?',
        answer: 'Content is delivered through daily updates on our app, weekly classroom sessions, and monthly magazines.'
      },
      {
        question: 'Is it suitable for both Prelims and Mains?',
        answer: 'Yes, we provide analysis relevant for both Prelims MCQs and Mains answer writing with proper categorization.'
      },
      {
        question: 'Can I access previous months\' content?',
        answer: 'Yes, all subscribers get access to our archive of current affairs going back two years.'
      },
      {
        question: 'How do you select what news to cover?',
        answer: 'Our expert team filters news based on examination relevance and provides analysis focused on UPSC and state exams.'
      }
    ]
  },
  {
    id: 6,
    slug: 'restart-program',
    title: 'Restart Program',
    description: 'Designed for candidates who want to restart their preparation after a break or multiple attempts with renewed strategy.',
    icon: 'ri-restart-line',
    duration: '8 months',
    usp: [
      'Gap analysis',
      'Customized study plan',
      'Focus on weak areas',
      'Psychological support',
      'Strategy refinement'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹65,000',
    testimonials: [2, 5],
    faq: [
      {
        question: 'Who should join the Restart Program?',
        answer: 'It\'s ideal for candidates who have attempted UPSC before or took a break from preparation and want to start afresh.'
      },
      {
        question: 'How is this different from regular programs?',
        answer: 'The program begins with extensive gap analysis and creates customized study plans focused on your specific improvement areas.'
      },
      {
        question: 'Do you provide psychological support?',
        answer: 'Yes, the program includes motivational sessions and strategies to overcome exam anxiety and maintain consistency.'
      },
      {
        question: 'Is there individual attention?',
        answer: 'Yes, each student gets a dedicated mentor who tracks progress and provides regular guidance throughout the program.'
      }
    ]
  },
  {
    id: 7,
    slug: 'geography-optional',
    title: 'Geography Optional',
    description: 'Specialized coaching for Geography Optional paper with focus on content, maps, diagrams, and case studies.',
    icon: 'ri-earth-line',
    duration: '6 months',
    usp: [
      'Comprehensive content coverage',
      'Map-making techniques',
      'Case study approach',
      'Diagram practice',
      'Current examples'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹45,000',
    testimonials: [3],
    faq: [
      {
        question: 'Is prior knowledge of Geography required?',
        answer: 'Basic understanding is helpful but not mandatory as we cover the subject from fundamentals to advanced topics.'
      },
      {
        question: 'Do you provide materials for diagrams and maps?',
        answer: 'Yes, we provide specialized material for map-based questions and diagram-making techniques.'
      },
      {
        question: 'How many test papers are included?',
        answer: 'The program includes 12 sectional tests and 5 full-length tests with detailed evaluation.'
      },
      {
        question: 'Do you focus on both physical and human geography?',
        answer: 'Yes, we provide equal emphasis on physical, human, and Indian geography aspects as per the UPSC syllabus.'
      }
    ]
  },
  {
    id: 8,
    slug: 'political-science-optional',
    title: 'Political Science & IR Optional',
    description: 'Comprehensive coaching for Political Science and International Relations optional paper focusing on contemporary issues.',
    icon: 'ri-global-line',
    duration: '6 months',
    usp: [
      'Theory and contemporary linkage',
      'Answer structuring techniques',
      'Current affairs integration',
      'Conceptual clarity',
      'Comparative politics approach'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹45,000',
    testimonials: [2, 4],
    faq: [
      {
        question: 'Is this suitable for students from non-political science backgrounds?',
        answer: 'Yes, we start from basics and gradually move to advanced concepts making it suitable for all backgrounds.'
      },
      {
        question: 'How do you cover international relations?',
        answer: 'We provide extensive coverage of IR theories and their application to contemporary global issues.'
      },
      {
        question: 'Do you focus on Indian political system?',
        answer: 'Yes, Indian political system forms a core component with special focus on constitutional and contemporary governance issues.'
      },
      {
        question: 'How do you help with answer writing?',
        answer: 'We conduct weekly answer writing sessions with model answers and personalized feedback on structure and content.'
      }
    ]
  },
  {
    id: 9,
    slug: 'sociology-optional',
    title: 'Sociology Optional',
    description: 'Complete preparation for Sociology optional paper with focus on theoretical concepts and their applications.',
    icon: 'ri-team-line',
    duration: '6 months',
    usp: [
      'Conceptual clarity',
      'Applied sociology',
      'Answer framing techniques',
      'Thinker-wise approach',
      'Contemporary examples'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹45,000',
    testimonials: [5],
    faq: [
      {
        question: 'Is prior knowledge of Sociology required?',
        answer: 'No, our program is designed to build concepts from basics to advanced levels suitable for all backgrounds.'
      },
      {
        question: 'How do you cover Indian society?',
        answer: 'We provide in-depth coverage of Indian social structure, issues, and contemporary developments.'
      },
      {
        question: 'Do you provide guidance on sociological thinkers?',
        answer: 'Yes, we cover all major thinkers with their theories and contemporary relevance for answer writing.'
      },
      {
        question: 'How many practice tests are included?',
        answer: 'The program includes 15 sectional tests and 5 full-length tests with detailed evaluation.'
      }
    ]
  },
  {
    id: 10,
    slug: 'malayalam-optional',
    title: 'Malayalam Optional',
    description: 'Expert coaching for Malayalam optional paper focusing on literature, grammar, and answer writing techniques.',
    icon: 'ri-book-open-line',
    duration: '6 months',
    usp: [
      'Literary analysis',
      'Grammar and language mastery',
      'Regional literature focus',
      'Classical to modern texts',
      'Creative writing practice'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: '₹40,000',
    testimonials: [3],
    faq: [
      {
        question: 'Is fluency in Malayalam required?',
        answer: 'Yes, medium to advanced proficiency in Malayalam reading and writing is necessary for this optional.'
      },
      {
        question: 'Do you cover ancient and modern literature?',
        answer: 'Yes, we provide comprehensive coverage of Malayalam literature from classical to contemporary works.'
      },
      {
        question: 'How many practice tests are included?',
        answer: 'The program includes 10 sectional tests and 4 full-length tests with detailed feedback.'
      },
      {
        question: 'Do you provide special materials for literature analysis?',
        answer: 'Yes, we provide exclusive notes on literary works, critical analysis, and important excerpts from prescribed texts.'
      }
    ]
  }
];

const MockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Arun Kumar',
    rank: 'UPSC Rank 24',
    program: 'Foundation Program',
    quote: 'The structured approach and personal mentoring at iLearn IAS were game-changers for my preparation.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'text'
  },
  {
    id: 2,
    name: 'Priya Menon',
    rank: 'UPSC Rank 45',
    program: 'Advanced Program',
    quote: 'Faculty at iLearn IAS are truly dedicated to student success. The personalized feedback improved my answer writing.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1506956191951-7a88da4435e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'portrait-video'
  },
  {
    id: 3,
    name: 'Rahul Nair',
    rank: 'KAS Rank 12',
    program: 'KAS Special Program',
    quote: 'The KAS Special Program was perfectly tailored to state-specific needs while covering the broader syllabus.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'portrait-video'
  },
  {
    id: 4,
    name: 'Deepa Thomas',
    rank: 'UPSC Rank 78',
    program: 'Foundation Program',
    quote: 'The iLearn app made it possible to utilize every free minute for preparation, even during travel.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'landscape-video'
  },
  {
    id: 5,
    name: 'Joseph Philip',
    rank: 'KAS Rank 5',
    program: 'KAS Special Program',
    quote: 'The comprehensive approach to KAS preparation at iLearn helped me secure a top rank.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'landscape-video'
  },
  // Additional testimonials for demonstrating carousel
  {
    id: 6,
    name: 'Sara Khan',
    rank: 'UPSC Rank 112',
    program: 'Prelims-cum-Mains Program',
    quote: 'The iLearn methodology helped me understand complex concepts through simple frameworks that are easy to remember.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'text'
  },
  {
    id: 7,
    name: 'Vivek Joshi',
    rank: 'UPSC Rank 56',
    program: 'Prelims-cum-Mains Program',
    quote: 'Thanks to iLearn\'s current affairs analysis, I was able to connect theoretical concepts with practical applications in my answers.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'text'
  },
  {
    id: 8,
    name: 'Anjali Desai',
    rank: 'UPSC Rank 87',
    program: 'Prelims-cum-Mains Program',
    quote: 'The mock interview sessions at iLearn were almost identical to my actual UPSC interview, which gave me the confidence I needed.',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'text'
  },
  {
    id: 9,
    name: 'Michael Thomas',
    rank: 'UPSC Rank 132',
    program: 'Prelims-cum-Mains Program',
    quote: 'The weekly strategy sessions helped me optimize my preparation and focus on high-yield topics.',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'portrait-video'
  },
  {
    id: 10,
    name: 'Lakshmi Suresh',
    rank: 'UPSC Rank 98',
    program: 'Prelims-cum-Mains Program',
    quote: 'The daily answer writing practice turned out to be the most crucial part of my UPSC journey. iLearn made it systematic and effective.',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'landscape-video'
  }
];

const ProgramDetailPage = () => {
  const { slug } = useParams();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoType, setSelectedVideoType] = useState<'portrait' | 'landscape'>('landscape');
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  
  // Refs for testimonial carousels
  const videoTestimonialsRef = useRef<HTMLDivElement>(null);
  const textTestimonialsRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  

  
  // Handle testimonial carousel scrolling
  const scrollTestimonials = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right', isVideoCarousel: boolean = false) => {
    if (!ref.current) return;
    
    // Different scroll amounts based on carousel type
    // For video carousel, we need to consider both portrait (210px) and landscape (350px) cards
    const scrollAmount = isVideoCarousel ? 280 : 300; // Average card width + gap for video carousel
    const currentScroll = ref.current.scrollLeft;
    
    ref.current.scrollTo({
      left: direction === 'right' 
        ? currentScroll + scrollAmount 
        : currentScroll - scrollAmount,
      behavior: 'smooth'
    });
  };
  
  // Touch handlers for testimonial carousels
  const handleTouchStart = (e: React.TouchEvent, ref: React.RefObject<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    // Just for tracking, actual movement handled by CSS
  };
  
  const handleTouchEnd = (e: React.TouchEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (touchStartXRef.current === null || !ref.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    
    // If swipe distance is significant, scroll the carousel
    if (Math.abs(diffX) > 50) {
      // Check if we're dealing with the video testimonials ref
      const isVideoCarousel = ref === videoTestimonialsRef;
      scrollTestimonials(ref, diffX > 0 ? 'right' : 'left', isVideoCarousel);
    }
    
    touchStartXRef.current = null;
  };
  
  // Mock data for result images by year
  // Helper function to process result years from program data
  const getResultYears = (program: any) => {
    if (!program?.resultYears || !Array.isArray(program.resultYears) || program.resultYears.length === 0) {
      return [];
    }
    
    // Extract years from the resultYears array and sort them (newest first)
    return program.resultYears.map((item: any) => item.year)
      .sort((a: string, b: string) => parseInt(b) - parseInt(a));
  };
  
  // Helper function to get image URL for a specific year
  const getResultImageUrl = (program: any, year: string) => {
    if (!program?.resultYears || !Array.isArray(program.resultYears)) {
      return '';
    }
    
    const resultYear = program.resultYears.find((item: any) => item.year === year);
    // Return a default image URL if the imageUrl is empty
    return resultYear && resultYear.imageUrl ? resultYear.imageUrl : 'https://placehold.co/800x350/20468D/white?text=Results+for+' + year;
  };

  // Fetch program details
  const { data: program, isLoading: programLoading } = useQuery({
    queryKey: [`/api/programs/${slug}`],
    queryFn: async () => {
      // Fetch real data from the API
      const response = await fetch(`/api/programs/${slug}`);
      if (!response.ok) {
        throw new Error('Program not found');
      }
      return response.json();
    },
    enabled: !!slug, // Only run query if slug is available
  });

  // Fetch testimonials for this program
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: [`/api/programs/${slug}/testimonials`],
    enabled: !!program && !!slug,
    queryFn: async () => {
      // Fetch real data from the API
      const response = await fetch(`/api/programs/${slug}/testimonials`);
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      return response.json();
    },
  });
  
  // Fetch specifically video testimonials for this program
  const { data: videoTestimonials = [], isLoading: videoTestimonialsLoading } = useQuery({
    queryKey: [`/api/programs/${slug}/testimonials`, 'video'],
    enabled: !!program && !!slug,
    queryFn: async () => {
      // Fetch video testimonials
      const response = await fetch(`/api/programs/${slug}/testimonials?type=video`);
      if (!response.ok) {
        throw new Error('Failed to fetch video testimonials');
      }
      return response.json();
    },
  });
  
  // Update selected year when program data changes
  useEffect(() => {
    if (program?.resultYears && Array.isArray(program.resultYears) && program.resultYears.length > 0) {
      // Get years from the program data
      const years = program.resultYears.map((item: any) => item.year)
        .sort((a: string, b: string) => parseInt(b) - parseInt(a));
      
      // Set the selected year to the latest year (first in the sorted array)
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    }
  }, [program]);

  const openVideoDialog = (videoUrl: string, isPortrait: boolean = false) => {
    setSelectedVideo(videoUrl);
    setSelectedVideoType(isPortrait ? 'portrait' : 'landscape');
  };

  const closeVideoDialog = () => {
    setSelectedVideo(null);
  };

  if (programLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-light-grey">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-md text-center">
          <i className="ri-error-warning-line text-primary-red text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold text-primary-blue mb-2">Program Not Found</h2>
          <p className="text-dark-grey mb-4">The program you're looking for doesn't exist or may have been removed.</p>
          <Link to="/programs">
            <Button className="bg-primary-blue hover:bg-[#193a76] text-white">
              View All Programs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{program.title} | iLearn IAS Academy</title>
        <meta name="description" content={program.description} />
        <link rel="canonical" href={`https://www.ilearnias.com/programs/${program.slug}`} />
        <meta property="og:title" content={`${program.title} | iLearn IAS Academy`} />
        <meta property="og:description" content={program.description} />
        <meta property="og:url" content={`https://www.ilearnias.com/programs/${program.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": program.title,
          "description": program.description,
          "url": `https://www.ilearnias.com/programs/${program.slug}`,
          "provider": {
            "@type": "EducationalOrganization",
            "name": "iLearn IAS Academy",
            "url": "https://www.ilearnias.com"
          }
        })}</script>
      </Helmet>
      
      <PageTransition>
        {/* Program Hero Section */}
        <section className="bg-light-grey py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start gap-8">
              <div className="w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">{program.title}</h1>
                <p className="text-dark-grey text-lg mb-6">{program.description}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Video Section - Moved Up */}
        {program.video && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue text-center mb-8">Program Overview</h2>
              <div className="max-w-3xl mx-auto aspect-video bg-light-grey rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <iframe 
                  src={getYoutubeEmbedUrl(program.video) || program.video} 
                  title={`${program.title} overview`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
        )}
        
        {/* Expert Faculty Section - Only for Mains Mastery Program */}
        {program.slug === 'mains-test-series' && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue text-center mb-8">
                Expert Faculty & <span className="text-primary-red">UPSC Toppers</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Faculty Member 1 */}
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-user-line text-2xl text-primary-blue"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-blue mb-1">Nikhil Lohithakshan</h3>
                    <p className="text-sm text-primary-red mb-3">Answer Writing & Geography Expert</p>
                    <p className="text-neutral-600 text-sm">Specializes in answer writing techniques and comprehensive geography coverage</p>
                  </div>
                </div>

                {/* Faculty Member 2 */}
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-trophy-line text-2xl text-primary-red"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-blue mb-1">Rahul Raghavan</h3>
                    <p className="text-sm text-primary-red mb-3">UPSC AIR 404 - Mains Super Mentor</p>
                    <p className="text-neutral-600 text-sm">Expert in mains, cleared mains 5 times and 2 selections to rank list</p>
                  </div>
                </div>

                {/* Faculty Member 3 */}
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-trophy-line text-2xl text-primary-red"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-blue mb-1">Vineeth Lohidakshan</h3>
                    <p className="text-sm text-primary-red mb-3">UPSC AIR 169 - Governance & Environment</p>
                    <p className="text-neutral-600 text-sm">Specializes in governance, social justice, and environmental issues</p>
                  </div>
                </div>

                {/* Faculty Member 4 */}
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-trophy-line text-2xl text-primary-red"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-blue mb-1">Adhil Shukoor</h3>
                    <p className="text-sm text-primary-red mb-3">UPSC AIR 822 - International Relations</p>
                    <p className="text-neutral-600 text-sm">Expert in international relations and global affairs</p>
                  </div>
                </div>

                {/* Faculty Member 5 */}
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-trophy-line text-2xl text-primary-red"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-blue mb-1">Adithya Narayan H</h3>
                    <p className="text-sm text-primary-red mb-3">UPSC AIR 357 - Society</p>
                    <p className="text-neutral-600 text-sm">Specialist in social issues and contemporary society</p>
                  </div>
                </div>

                {/* Faculty Member 6 */}
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-user-line text-2xl text-primary-blue"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-blue mb-1">Dr. Jayesh Khaddar</h3>
                    <p className="text-sm text-primary-red mb-3">Essay Writing Specialist</p>
                    <p className="text-neutral-600 text-sm">Expert in essay writing techniques and evaluation</p>
                  </div>
                </div>
              </div>
              
              {/* Additional Faculty Row */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-6">
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-user-line text-lg text-primary-blue"></i>
                    </div>
                    <h4 className="text-base font-semibold text-primary-blue mb-1">TJ Abraham</h4>
                    <p className="text-xs text-primary-red mb-2">Ethics Expert</p>
                  </div>
                </div>
                
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-user-line text-lg text-primary-blue"></i>
                    </div>
                    <h4 className="text-base font-semibold text-primary-blue mb-1">Anoop EK</h4>
                    <p className="text-xs text-primary-red mb-2">Science & Technology</p>
                  </div>
                </div>
                
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-user-line text-lg text-primary-blue"></i>
                    </div>
                    <h4 className="text-base font-semibold text-primary-blue mb-1">Sreehari VS</h4>
                    <p className="text-xs text-primary-red mb-2">History Specialist</p>
                  </div>
                </div>
                
                <div className="bg-light-grey rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-user-line text-lg text-primary-blue"></i>
                    </div>
                    <h4 className="text-base font-semibold text-primary-blue mb-1">Mohammed Shinas</h4>
                    <p className="text-xs text-primary-red mb-2">Polity & Constitution</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Program Highlights Section - Material Design 3 style */}
        <section className="py-12 bg-light-grey">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-8">
              {/* Program Highlights Section */}
              <div className="w-full">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100/50 w-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-6 text-primary-blue">Program Highlights</h3>
                  
                  {/* Vertical list layout */}
                  <div className="flex flex-col gap-4 flex-grow">
                    {program.usp.map((point: any, index: number) => {
                      // List of keywords to highlight
                      const keywords = [
                        "No prerequisites", 
                        "Daily 4-hour classes",
                        "Complete study materials",
                        "Personal mentorship",
                        "Daily guidance",
                        "daily Prelims practice",
                        "Daily Mains answer writing practice",
                        "Weekly Prelims tests",
                        "special sessions focusing on current affairs",
                        "Access to recorded sessions",
                        "Modern air-conditioned classrooms",
                        "Integrated Prelims Test Series (iPTS)",
                        "Mains Test Series (MTS)",
                        "Interview guidance",
                        "Regular interactions with toppers and civil servants",
                        "Comprehensive \"Prelims Edge\""
                      ];
                      
                      // Function to highlight keywords in text
                      const highlightText = (text: string) => {
                        let highlightedText = text;
                        
                        // Find keyword that appears in this point
                        const matchingKeyword = keywords.find(keyword => 
                          text.includes(keyword)
                        );
                        
                        if (matchingKeyword) {
                          const parts = text.split(matchingKeyword);
                          return (
                            <>
                              {parts[0]}
                              <span className="font-bold text-primary-blue bg-blue-50 px-1 py-0.5 rounded">
                                {matchingKeyword}
                              </span>
                              {parts[1]}
                            </>
                          );
                        }
                        
                        return text;
                      };
                      
                      return (
                        <div 
                          key={index} 
                          className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start h-auto"
                        >
                          <div className="w-8 h-8 bg-primary-red/10 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                            <svg className="w-5 h-5 text-primary-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span className="text-base text-neutral-800">{highlightText(point)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Program Details Section */}
              <div className="w-full">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100/50 w-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-6 text-primary-blue">Program Details</h3>
                  
                  {/* Program metrics - Material Design 3 style */}
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="bg-gray-50/80 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-1">
                        <svg className="w-5 h-5 text-primary-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <p className="text-gray-500 text-sm">Duration</p>
                      </div>
                      <p className="font-medium text-lg text-gray-800 pl-8">{program.duration}</p>
                    </div>
                    

                  </div>
                  
                  {/* Action buttons */}
                  <div className="space-y-4">
                    <Link to="/contact" className="block">
                      <button className="w-full bg-primary-red text-white py-3 px-6 rounded-full transition-all font-medium hover:shadow-md hover:translate-y-[-1px]">
                        Enroll Now
                      </button>
                    </Link>
                    
                    <Link to="/contact" className="block text-center">
                      <span className="text-primary-blue font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                        Book a Counselling Call
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        

        
        {/* What Our Students Say Section - Specific for Mains Mastery Program */}
        {program.slug === 'mains-test-series' && (
          <section className="py-14 bg-[#f8f9fe]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 relative inline-block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue via-primary-blue to-primary-red">What Our Students Say about Mains Mastery Program (MMP)</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
                </h2>
                <p className="text-neutral-600 mt-3">Authentic success stories from our MMP alumni</p>
              </div>

              {/* Student Success Stories Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                {/* Testimonial 1 - Rahul Raghavan */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-red to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      RR
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-blue">Rahul Raghavan</h3>
                      <p className="text-sm text-primary-red font-medium">UPSC AIR 404 - Mains Super Mentor</p>
                      <p className="text-xs text-gray-500">MMP Faculty</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 text-primary-red text-4xl opacity-20">"</div>
                    <p className="text-gray-700 italic pl-6 pr-2 leading-relaxed">
                      Having cleared mains 5 times with 2 selections to rank list, I understand the nuances of mains examination. MMP's approach focuses on systematic answer writing skills that are essential for UPSC success.
                    </p>
                    <div className="absolute bottom-0 right-0 text-primary-red text-4xl opacity-20">"</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full">Mains Super Mentor</span>
                    <span className="text-xs text-gray-400">Expert Faculty</span>
                  </div>
                </div>

                {/* Testimonial 2 - Vineeth Lohidakshan */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-blue mr-4 flex-shrink-0">
                      <img 
                        src="/attached_assets/Vishnu.png" 
                        alt="Vineeth Lohidakshan" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-blue">Vineeth Lohidakshan</h3>
                      <p className="text-sm text-primary-red font-medium">UPSC CSE - AIR 169</p>
                      <p className="text-xs text-gray-500">MMP Alumna</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 text-primary-red text-4xl opacity-20">"</div>
                    <p className="text-gray-700 italic pl-6 pr-2 leading-relaxed">
                      MMP's comprehensive coverage of governance and social justice topics, combined with regular masterclasses, gave me the edge I needed. The faculty guidance was exceptional throughout the program.
                    </p>
                    <div className="absolute bottom-0 right-0 text-primary-red text-4xl opacity-20">"</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full">Governance & Environment</span>
                    <span className="text-xs text-gray-400">2023</span>
                  </div>
                </div>

                {/* Testimonial 3 - Adithya Narayan H */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 mr-4 flex-shrink-0">
                      <img 
                        src="/attached_assets/Devika Priyadersini AIR 95.png" 
                        alt="Adithya Narayan H" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-blue">Adithya Narayan H</h3>
                      <p className="text-sm text-primary-red font-medium">UPSC CSE - AIR 357</p>
                      <p className="text-xs text-gray-500">MMP Alumni</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 text-primary-red text-4xl opacity-20">"</div>
                    <p className="text-gray-700 italic pl-6 pr-2 leading-relaxed">
                      The society paper preparation in MMP was thorough and well-structured. The daily answer writing practice with immediate feedback helped me understand the nuances of mains examination writing.
                    </p>
                    <div className="absolute bottom-0 right-0 text-primary-red text-4xl opacity-20">"</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full">Society Specialist</span>
                    <span className="text-xs text-gray-400">2022</span>
                  </div>
                </div>

                {/* Testimonial 4 - Adhil Shukoor */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 mr-4 flex-shrink-0">
                      <img 
                        src="/attached_assets/Adhil.png" 
                        alt="Adhil Shukoor" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-blue">Adhil Shukoor</h3>
                      <p className="text-sm text-primary-red font-medium">UPSC CSE - AIR 822</p>
                      <p className="text-xs text-gray-500">MMP Alumni</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 text-primary-red text-4xl opacity-20">"</div>
                    <p className="text-gray-700 italic pl-6 pr-2 leading-relaxed">
                      MMP's focus on international relations was comprehensive and current. The masterclasses by subject experts and regular test series helped me build confidence for the mains examination.
                    </p>
                    <div className="absolute bottom-0 right-0 text-primary-red text-4xl opacity-20">"</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full">International Relations</span>
                    <span className="text-xs text-gray-400">2021</span>
                  </div>
                </div>

                {/* Testimonial 5 - Current Student */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      MMP
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-blue">Current MMP Student</h3>
                      <p className="text-sm text-primary-red font-medium">Preparing for UPSC 2025</p>
                      <p className="text-xs text-gray-500">MMP 2025 Batch</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 text-primary-red text-4xl opacity-20">"</div>
                    <p className="text-gray-700 italic pl-6 pr-2 leading-relaxed">
                      The quality of teaching and the progressive skill development approach in MMP 2025 is exceptional. Every session adds value to our preparation journey. Highly recommend for serious aspirants.
                    </p>
                    <div className="absolute bottom-0 right-0 text-primary-red text-4xl opacity-20">"</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">Current Student</span>
                    <span className="text-xs text-gray-400">2025</span>
                  </div>
                </div>

                {/* Testimonial 6 - Success Story */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      SS
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-blue">Success Story</h3>
                      <p className="text-sm text-primary-red font-medium">Multiple Selections</p>
                      <p className="text-xs text-gray-500">MMP Alumni</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 text-primary-red text-4xl opacity-20">"</div>
                    <p className="text-gray-700 italic pl-6 pr-2 leading-relaxed">
                      MMP's systematic approach to mains preparation with daily answer writing and expert feedback is what sets it apart. The program duration is perfect for intensive preparation.
                    </p>
                    <div className="absolute bottom-0 right-0 text-primary-red text-4xl opacity-20">"</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-primary-red/10 text-primary-red px-3 py-1 rounded-full">Success Story</span>
                    <span className="text-xs text-gray-400">Various Years</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Program Video Testimonials - Similar to homepage */}
        <section className="py-14 bg-[#f8f9fe]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 relative inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue via-primary-blue to-primary-red">Student Testimonials</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
              </h2>
              <p className="text-neutral-600 mt-3">Success stories from {program.title} students</p>
            </div>

            {videoTestimonialsLoading ? (
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : videoTestimonials.length > 0 ? (
              <div className="relative">
                {/* Navigation buttons - Material Design 3 style */}
                <button 
                  onClick={() => {
                    const container = document.getElementById('program-video-testimonials-container');
                    if (container) {
                      container.scrollBy({ left: -300, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 hover:bg-white hover:-translate-x-0.5"
                  aria-label="Scroll left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-red">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                
                <div 
                  id="program-video-testimonials-container"
                  className="flex overflow-x-auto hide-scrollbar gap-6 py-4 px-6 md:px-8"
                >
                  {videoTestimonials
                    .filter((item: any, index: number, self: any[]) => 
                      // Remove duplicates by checking if this is the first occurrence of an item with this id
                      index === self.findIndex((t: any) => t.id === item.id)
                    )
                    // Sort by display order if available
                    .sort((a: any, b: any) => {
                      // Force displayOrder to be a number for comparison
                      const orderA = a.displayOrder !== null && a.displayOrder !== undefined ? Number(a.displayOrder) : Number.MAX_SAFE_INTEGER;
                      const orderB = b.displayOrder !== null && b.displayOrder !== undefined ? Number(b.displayOrder) : Number.MAX_SAFE_INTEGER;
                      
                      // Sort by display order (lower numbers first)
                      if (orderA !== orderB) {
                        return orderA - orderB;
                      }
                      
                      // If same display order or both null/undefined, fall back to creation date
                      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                      return dateB - dateA; // Newer items first as fallback
                    })
                    .map((testimonial: any) => {
                      // Determine if the video is portrait or landscape
                      const isPortrait = testimonial.type === 'portrait-video';
                      const aspectRatio = isPortrait ? 'portrait' : 'landscape';
                      
                      // Generate the YouTube thumbnail URL from the video URL
                      const videoUrl = testimonial.video || '';
                      const embedUrl = getYoutubeEmbedUrl(videoUrl) || videoUrl;
                      const thumbnailUrl = testimonial.image || '';
                      
                      // Material Design 3 elevation and surface styling
                      const elevationClass = "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md";
                      const transitionClass = "transition-all duration-300 hover:-translate-y-1 group relative cursor-pointer";
                      
                      // Standardized dimensions to match homepage
                      const STANDARD_CARD_HEIGHT = 320; // Total card height including image and info
                      const STANDARD_IMAGE_HEIGHT = 224; // Standard image height (h-56) for all cards
                      const INFO_HEIGHT = 96; // Height of the info section below the image
                      
                      // Calculate width based on aspect ratio while maintaining consistent height
                      const width = isPortrait ? Math.round(STANDARD_IMAGE_HEIGHT * (9/16)) : Math.round(STANDARD_IMAGE_HEIGHT * (16/9));
                      
                      // Get color based on video type
                      const playButtonColor = isPortrait ? '#E21A24' : '#20468D';
                      
                      return (
                        <div
                          key={testimonial.id}
                          className={`flex-shrink-0 ${elevationClass} ${transitionClass}`}
                          style={{ 
                            width: `${width}px`,
                            height: `${STANDARD_CARD_HEIGHT}px`,
                            overflow: 'hidden' 
                          }}
                          onClick={() => openVideoDialog(embedUrl, isPortrait)}
                        >
                          {/* Play button overlay (Material Design 3 style) */}
                          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={playButtonColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            </div>
                          </div>
                          
                          {/* Media thumbnail with fixed height and correct aspect ratio */}
                          <div 
                            className="relative overflow-hidden flex items-center justify-center"
                            style={{ height: `${STANDARD_IMAGE_HEIGHT}px` }}
                          >
                            {isPortrait ? (
                              <div 
                                className="w-full h-full relative overflow-hidden flex justify-center items-center bg-black"
                                style={{ aspectRatio: '9/16' }}  /* YouTube Shorts aspect ratio */
                              >
                                <img
                                  src={thumbnailUrl} 
                                  alt={`${testimonial.name}'s testimonial thumbnail`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                {/* Overlay gradient for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10"></div>
                              </div>
                            ) : (
                              <>
                                <img
                                  src={thumbnailUrl} 
                                  alt={`${testimonial.name}'s testimonial thumbnail`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                {/* Overlay gradient for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10"></div>
                              </>
                            )}
                          </div>
                          
                          {/* Info section with fixed height - Material Design 3 styled */}
                          <div 
                            className="p-5 bg-white flex flex-col justify-center"
                            style={{ height: `${INFO_HEIGHT}px` }}
                          >
                            <div className="mb-2">
                              <div className="bg-primary-blue/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white/80 rounded-full"></span>
                                <span>{testimonial.rank}</span>
                              </div>
                            </div>
                            <h3 className="font-semibold text-base text-neutral-800 line-clamp-2">{testimonial.name}</h3>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
                
                <button 
                  onClick={() => {
                    const container = document.getElementById('program-video-testimonials-container');
                    if (container) {
                      container.scrollBy({ left: 300, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 hover:bg-white hover:translate-x-0.5"
                  aria-label="Scroll right"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-red">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative">
                {/* Stylized empty state with horizontal carousel styling */}
                <div 
                  className="flex overflow-x-auto hide-scrollbar gap-6 py-4 px-6 md:px-8"
                >
                  <div className="flex items-center justify-center min-w-full">
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md mx-auto">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-primary-blue/10 rounded-full animate-pulse"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-primary-blue/40 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-primary-blue mb-3">No Video Testimonials Yet</h3>
                      <p className="text-neutral-600 mb-5">Video testimonials for this program will appear here in a horizontal carousel, just like on the homepage.</p>
                      <div className="flex justify-center">
                        <div className="bg-primary-blue/5 backdrop-blur-sm rounded-lg p-3 inline-block">
                          <div className="flex space-x-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-16 h-24 rounded-lg bg-gray-200 animate-pulse" style={{animationDelay: `${i * 150}ms`}}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visual indicator for empty carousel */}
                <div className="flex justify-center mt-4 gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300"></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        

        
        {/* FAQ Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-blue text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {program.faq.map((item: any, index: number) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-light-grey rounded-lg overflow-hidden border-none"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <h3 className="text-left font-medium text-base">{item.question}</h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-dark-grey">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 bg-light-grey">
          <div className="container mx-auto px-4">
            <div className="bg-primary-blue text-white rounded-lg p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="mb-6 max-w-3xl mx-auto opacity-90">
                Join {program.title} at iLearn IAS Academy and take the first step towards achieving your goal of becoming a civil servant.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact">
                  <Button className="bg-primary-red hover:bg-[#c01821] text-white px-8 py-6 h-auto font-medium">
                    Enroll Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-blue px-8 py-6 h-auto font-medium">
                    Contact for Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>

      {/* Video Dialog - Dynamically adapts to video type */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && closeVideoDialog()}>
        <DialogContent 
          className={`p-0 bg-black border-0 rounded-xl overflow-hidden ${selectedVideoType === 'portrait' ? 'max-w-md' : 'max-w-5xl'}`}
        >
          <DialogTitle className="sr-only">Video Testimonial</DialogTitle>
          {selectedVideo && (
            <div className={selectedVideoType === 'portrait' ? 'aspect-[9/16] w-full' : 'aspect-video w-full'}>
              <iframe 
                src={selectedVideo}
                title="Video testimonial"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* Close button */}
              <button
                onClick={closeVideoDialog}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                aria-label="Close video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgramDetailPage;

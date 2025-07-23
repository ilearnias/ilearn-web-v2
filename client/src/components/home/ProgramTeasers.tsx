import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Program } from '@/lib/constants';
import { truncateText } from '@/lib/utils';
import { ScrollLink } from '@/components/ui/scroll-link';

// Your specific program offerings
const iLearnPrograms: Program[] = [
  {
    id: 1,
    slug: 'prelims-cum-mains',
    title: 'Prelims Cum Mains (PCM) Program',
    description: 'Comprehensive classroom program covering both preliminary and main examinations with proven methodology and Kerala\'s highest success rate.',
    icon: 'ri-government-line',
    duration: '12 months',
    usp: [
      'Complete syllabus coverage',
      'Kerala\'s highest success rate',
      'Integrated classroom approach'
    ],
    fees: 'Contact for details',
    testimonials: [1, 4],
    faq: [
      {
        question: 'What makes this program special?',
        answer: 'Our PCM program has consistently delivered Kerala\'s best results with a proven classroom methodology and comprehensive coverage.'
      }
    ]
  },
  {
    id: 2,
    slug: 'current-affairs-news-analysis',
    title: 'Current Affairs and News Analysis (CANA)',
    description: 'Stay updated with the latest current affairs and develop analytical skills essential for UPSC examinations through our specialized program.',
    icon: 'ri-newspaper-line',
    duration: '6 months',
    usp: [
      'Daily news analysis',
      'Current affairs coverage',
      'UPSC-focused approach'
    ],
    fees: 'Contact for details',
    testimonials: [1, 2],
    faq: [
      {
        question: 'How current is the content?',
        answer: 'Our CANA program provides daily updates and analysis of current events with direct relevance to UPSC examination patterns.'
      }
    ]
  }
];

const ProgramTeasers = () => {
  // Use your specific programs directly
  const programs = iLearnPrograms;
  const isLoading = false;
  
  console.log('ProgramTeasers rendering with programs:', programs);

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Material Design 3 inspired background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-neutral-50 -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSIjZWVlZWVlIiAvPjwvc3ZnPg==')] opacity-50 -z-5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-48 h-48 bg-primary-blue-50 rounded-full opacity-70 blur-3xl -z-5"></div>
      <div className="absolute bottom-20 right-0 w-48 h-48 bg-primary-red-50 rounded-full opacity-70 blur-3xl -z-5"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 relative inline-block">
            <span className="text-primary-blue">Our</span> <span className="text-primary-red">Programs</span>
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
          </h2>
          <p className="text-neutral-600 mt-3 max-w-2xl mx-auto">
            Specialized training programs designed for your success in civil service examinations with proven results.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {programs.map((program: Program, index: number) => (
              <div 
                key={program.id} 
                className="program-card bg-white rounded-xl border border-neutral-100 transition-all duration-300 hover:border-neutral-200 overflow-hidden"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex flex-col h-full">
                  {/* Card header with MD3 styling */}
                  <div className="relative p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className={`${program.icon} text-primary-blue text-xl`}></i>
                      </div>
                      <h2 className="font-semibold text-lg leading-tight">
                        {program.title.includes('(') ? (
                          <>
                            {program.title.split(' (')[0]} 
                            <span className="text-primary-red font-medium">
                              {' '}({program.title.split(' (')[1].replace(')', '')})
                            </span>
                          </>
                        ) : program.title}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Card content - Material Design 3 style */}
                  <div className="px-5 pt-0 pb-5 flex-grow flex flex-col">
                    <div className="h-px bg-gray-100 w-full mb-4"></div>
                    <p className="text-neutral-700 text-sm mb-4">
                      {program.description.length > 100 ? 
                        `${program.description.substring(0, 100)}...` : 
                        program.description
                      }
                    </p>
                    
                    {/* Program details - Material Design 3 style - Streamlined display */}
                    <div className="flex justify-center items-center mb-4 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary-blue">
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </span>
                        <span className="text-sm font-medium">{program.duration}</span>
                      </div>
                    </div>
                    
                    {/* Call to action */}
                    <ScrollLink 
                      href={`/programs/${program.slug}`} 
                      className="w-full text-center bg-primary-blue-50 hover:bg-primary-blue-100 text-primary-blue font-medium rounded-full py-2.5 transition-colors text-sm"
                    >
                      View Program Details
                    </ScrollLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <ScrollLink href="/programs">
            <Button 
              variant="gradient" 
              className="group px-8 py-3 h-auto rounded-full shadow-md hover:shadow-lg flex items-center gap-2 text-base relative overflow-hidden"
            >
              <span className="relative z-10">Explore All Programs</span>
              {/* Material Design 3 style button with ripple effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-blue to-primary-red opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </ScrollLink>
        </div>
      </div>

      {/* Animation is already defined in index.css */}
    </section>
  );
};

export default ProgramTeasers;

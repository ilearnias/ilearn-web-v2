import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { Program } from '@/lib/constants';

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
      },
      {
        question: 'How many classes are conducted per week?',
        answer: 'We conduct regular classes with additional doubt clearing sessions and personalized guidance.'
      },
      {
        question: 'Do you provide study materials?',
        answer: 'Yes, comprehensive study materials for all subjects are provided as part of the program.'
      }
    ]
  },
  {
    id: 2,
    slug: 'current-affairs-news-analysis',
    title: 'Current Affairs and News Analysis (CANA)',
    description: 'Stay updated with the latest current affairs and develop analytical skills essential for UPSC examinations through our specialized program.',
    icon: 'ri-newspaper-line',
    duration: 'ongoing',
    usp: [
      'Daily news analysis',
      'Current affairs compilation',
      'Answer writing practice'
    ],
    fees: '₹25,000',
    testimonials: [2, 3],
    faq: [
      {
        question: 'How current is the content?',
        answer: 'Our content is updated daily with the latest news and current affairs from reliable sources, ensuring you stay ahead of current trends.'
      },
      {
        question: 'Do you provide monthly magazines?',
        answer: 'Yes, we provide comprehensive monthly current affairs magazines along with weekly compilations and daily updates.'
      },
      {
        question: 'Is this suitable for both prelims and mains?',
        answer: 'Absolutely! Our CANA program covers current affairs relevant for both prelims and mains with different approaches for each.'
      }
    ]
  },
  {
    id: 3,
    slug: 'mains-test-series',
    title: 'Mains Mastery Program (MMP)',
    description: 'Comprehensive Mains preparation program featuring daily answer writing practice, masterclasses by expert faculty, and guidance from successful UPSC toppers with proven track records.',
    icon: 'ri-file-text-line',
    duration: '3.5 months',
    usp: [
      'Daily answer writing sessions',
      'Masterclasses by toppers (AIR 81, 169, 357)',
      'Expert faculty mentorship',
      'Complete GS coverage',
      'Progressive skill development'
    ],
    fees: 'Contact for details',
    testimonials: [1, 2, 3, 4, 5],
    faq: [
      {
        question: 'What makes MMP different from other programs?',
        answer: 'MMP features daily answer writing practice with evaluation by expert faculty, masterclasses by subject specialists, and direct guidance from UPSC toppers with impressive ranks.'
      },
      {
        question: 'Who are the faculty members teaching in MMP?',
        answer: 'Our faculty includes Nikhil Lohithakshan, Reenu Anna Mathew (AIR 81), Vineeth Lohidakshan (AIR 169), Dr. Jayesh Khaddar, and other subject experts.'
      },
      {
        question: 'When does the program start?',
        answer: 'The MMP 2025 batch starts on May 28, 2025, with answer writing sessions beginning from June 8th onwards through August 2025.'
      }
    ]
  },
  {
    id: 4,
    slug: 'interview-guidance-program',
    title: 'Interview Guidance Program (IGP)',
    description: 'Specialized program for candidates who have cleared mains examination, focusing on personality development and interview preparation.',
    icon: 'ri-user-voice-line',
    duration: '2 months',
    usp: [
      'Mock interviews',
      'Personality development',
      'DAF analysis'
    ],
    fees: '₹15,000',
    testimonials: [4, 6],
    faq: [
      {
        question: 'When should I join this program?',
        answer: 'Ideally after clearing the mains examination, about 2-3 months before your expected interview date.'
      },
      {
        question: 'How many mock interviews are conducted?',
        answer: 'We conduct 6 comprehensive mock interviews with different panels including retired civil servants and subject experts.'
      },
      {
        question: 'Do you provide DAF analysis?',
        answer: 'Yes, we conduct detailed DAF analysis and prepare you for questions based on your educational and professional background.'
      }
    ]
  },
  {
    id: 5,
    slug: 'foundation-course',
    title: 'Foundation Course for Civil Services',
    description: 'Comprehensive foundation program for beginners starting their civil services preparation journey with basic concepts and fundamentals.',
    icon: 'ri-book-open-line',
    duration: '8 months',
    usp: [
      'Basic concepts clearing',
      'NCERT foundation',
      'Study plan guidance'
    ],
    fees: '₹35,000',
    testimonials: [3, 7],
    faq: [
      {
        question: 'Is this suitable for complete beginners?',
        answer: 'Yes, this program is specifically designed for students who are starting their civil services preparation from scratch.'
      },
      {
        question: 'What does the foundation cover?',
        answer: 'The course covers NCERT basics, fundamental concepts, study methodology, and preparation strategy for UPSC examinations.'
      },
      {
        question: 'Can I join other programs after foundation?',
        answer: 'Absolutely! Foundation course prepares you perfectly for our advanced programs like PCM or specialized courses.'
      }
    ]
  },
  {
    id: 6,
    slug: 'geography-optional',
    title: 'Geography Optional',
    description: 'Comprehensive coaching for Geography optional with physical and human geography coverage, map work, and case study analysis by expert faculty.',
    icon: 'ri-earth-line',
    duration: '6 months',
    usp: [
      'Physical & Human Geography',
      'Map work practice',
      'Case study analysis'
    ],
    fees: '₹28,000',
    testimonials: [2, 8],
    faq: [
      {
        question: 'Do you cover both papers of Geography?',
        answer: 'Yes, we provide complete coverage of both Paper I (Physical Geography) and Paper II (Human Geography) with detailed analysis.'
      },
      {
        question: 'Is map work included in the course?',
        answer: 'Absolutely! Map work is a crucial component and we provide extensive practice sessions for map-based questions.'
      },
      {
        question: 'What study materials are provided?',
        answer: 'We provide comprehensive notes, atlas, previous year papers, and practice maps along with regular test series.'
      }
    ]
  },
  {
    id: 7,
    slug: 'political-science-optional',
    title: 'Political Science & International Relations',
    description: 'Expert coaching for Political Science & IR optional covering Indian politics, comparative politics, and international relations with current affairs integration.',
    icon: 'ri-government-line',
    duration: '6 months',
    usp: [
      'Indian & Comparative Politics',
      'International Relations',
      'Current affairs integration'
    ],
    fees: '₹28,000',
    testimonials: [3, 9],
    faq: [
      {
        question: 'How is current affairs integrated?',
        answer: 'We seamlessly integrate current political developments and international events with theoretical concepts for better understanding.'
      },
      {
        question: 'Do you cover both Indian and Western thinkers?',
        answer: 'Yes, our curriculum covers both Indian political thought and Western political philosophy comprehensively.'
      },
      {
        question: 'Are case studies included?',
        answer: 'We include detailed case studies from Indian politics and international relations to enhance practical understanding.'
      }
    ]
  },
  {
    id: 8,
    slug: 'sociology-optional',
    title: 'Sociology Optional',
    description: 'Comprehensive Sociology optional coaching covering social theory, Indian society, and contemporary social issues with expert faculty guidance.',
    icon: 'ri-group-line',
    duration: '6 months',
    usp: [
      'Social theory mastery',
      'Indian society focus',
      'Contemporary issues'
    ],
    fees: '₹28,000',
    testimonials: [4, 10],
    faq: [
      {
        question: 'How do you make sociology concepts clear?',
        answer: 'We use real-world examples, case studies, and current social issues to make abstract sociological concepts easily understandable.'
      },
      {
        question: 'Is Indian society given special focus?',
        answer: 'Yes, we dedicate significant time to Indian social structure, caste, religion, and contemporary social challenges.'
      },
      {
        question: 'Do you provide answer writing practice?',
        answer: 'Regular answer writing sessions are conducted with focus on sociological analysis and evaluation techniques.'
      }
    ]
  },
  {
    id: 9,
    slug: 'malayalam-literature-optional',
    title: 'Malayalam Literature Optional',
    description: 'Specialized coaching for Malayalam Literature optional covering classical and modern literature, poetry, prose, and literary criticism by expert faculty.',
    icon: 'ri-book-2-line',
    duration: '6 months',
    usp: [
      'Classical & Modern Literature',
      'Poetry & Prose analysis',
      'Literary criticism'
    ],
    fees: '₹25,000',
    testimonials: [5, 11],
    faq: [
      {
        question: 'Do you cover both classical and modern literature?',
        answer: 'Yes, our syllabus comprehensively covers classical Malayalam literature as well as contemporary works and authors.'
      },
      {
        question: 'Is literary criticism taught in detail?',
        answer: 'We provide in-depth training in literary criticism, analysis techniques, and critical appreciation of Malayalam literature.'
      },
      {
        question: 'Are there regular tests for this optional?',
        answer: 'Yes, we conduct regular tests focusing on different literary periods, authors, and critical analysis techniques.'
      }
    ]
  }
];

const ProgramsPage = () => {
  const programs = iLearnPrograms;
  const isLoading = false;

  return (
    <>
      <Helmet>
        <title>Programs | iLearn IAS Academy</title>
        <meta name="description" content="Explore our specialized coaching programs for UPSC, KAS, and other civil service examinations designed to help you achieve top results." />
      </Helmet>
      
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-100 text-primary-blue py-4 md:py-6">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl md:text-4xl font-bold">
                <span className="text-primary-blue">Our</span>
                <span className="text-primary-red"> Programs</span>
              </h1>
            </div>
          </div>
        </section>
        
        {/* Programs Listing Section */}
        <section className="pt-2 pb-8 md:pt-3 md:pb-10 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-6 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-primary-blue mb-1">
                Find Your Perfect <span className="text-primary-red">Learning Path</span>
              </h2>
              <div className="w-20 h-1 bg-primary-red/50 mx-auto mb-2"></div>
              <p className="text-neutral-600 max-w-2xl mx-auto text-sm">
                Choose from our comprehensive range of programs tailored to different aspects of civil service examination preparation.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {programs.map((program: Program) => (
                  <div 
                    key={program.id} 
                    className="program-card bg-white rounded-xl border border-neutral-100 transition-all duration-300 hover:border-neutral-200 overflow-hidden"
                  >
                    <div className="flex flex-col h-full">
                      {/* Card header */}
                      <div className="relative p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-primary-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-primary-blue fill-none stroke-current stroke-2">
                              <path d="M2 22h20M12 2l8 4.5v2.5H4V6.5L12 2zM4 9h16v11H4V9zM9 14v6M15 14v6" />
                            </svg>
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
                      
                      {/* Card content */}
                      <div className="px-5 pt-0 pb-5 flex-grow flex flex-col">
                        <div className="h-px bg-gray-100 w-full mb-4"></div>
                        <p className="text-neutral-700 text-sm mb-4">
                          {program.description.length > 100 ? 
                            `${program.description.substring(0, 100)}...` : 
                            program.description
                          }
                        </p>
                        
                        {/* Program details */}
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
                        <Link 
                          to={`/programs/${program.slug}`} 
                          className="w-full block text-center bg-primary-blue-50 hover:bg-primary-blue-100 text-primary-blue font-medium rounded-full py-2.5 transition-colors text-sm"
                        >
                          View Program Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-primary-blue">Frequently Asked</span>
                <span className="text-primary-red"> Questions</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-blue to-primary-red mx-auto mb-4"></div>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Find answers to common questions about our programs and admission process.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-3">
                {[
                  {
                    question: "How do I enroll in a program?",
                    answer: "You can enroll by visiting our institute, calling our admission office, or filling the contact form on our website. We'll arrange a counseling session to help you choose the right program."
                  },
                  {
                    question: "Are there any scholarships available?",
                    answer: "Yes, we offer merit-based scholarships for deserving candidates. Eligibility is determined through an entrance test and interview."
                  },
                  {
                    question: "Do you offer online classes?",
                    answer: "Yes, all our programs are available in both offline and online formats. Online students get access to recorded lectures, live sessions, and digital study materials through our app."
                  },
                  {
                    question: "What is your batch size?",
                    answer: "We maintain small batch sizes of 30-40 students to ensure personalized attention and interactive learning environment."
                  }
                ].map((faq, index) => (
                  <details 
                    key={index} 
                    className="bg-white border border-gray-100 rounded-xl group overflow-hidden"
                  >
                    <summary className="flex items-center cursor-pointer list-none px-5 py-4">
                      <div className="w-8 h-8 flex items-center justify-center bg-primary-blue-50 text-primary-blue rounded-full mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                          <path d="M12 17h.01"></path>
                        </svg>
                      </div>
                      <h3 className="text-neutral-800 font-medium text-base flex-grow">{faq.question}</h3>
                      <div className="text-primary-blue w-6 h-6 flex items-center justify-center rounded-full group-open:rotate-180 transition-transform flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>
                    </summary>
                    <div className="px-5 pb-5 pt-2">
                      <div className="pl-11">
                        <p className="text-neutral-600 text-sm">{faq.answer}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Link to="/contact" className="inline-flex items-center gap-2 text-primary-blue hover:text-primary-blue-700 font-medium transition-colors">
                  <span>Contact us for more information</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </>
  );
};

export default ProgramsPage;
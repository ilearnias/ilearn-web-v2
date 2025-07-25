import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { Program } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/config/apiClient';
import { API } from '@/config/api';
import QUERY_KEY from '@/config/queryKeys';

// API response type for a program
type ProgramApi = {
  id: string;
  title: string;
  sub_title: string | null;
  description: string;
  status: string;
  order: number;
  route: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const ProgramsPage = () => {
  // Fetch programs from API
  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.PROGRAMS],
    queryFn: async () => {
      const response = await apiClient.get(API?.PROGRAMS);
      return response?.data;
    },
  });

  const programs: ProgramApi[] = (apiData?.data || []).slice().sort((a: ProgramApi, b: ProgramApi) => a.order - b.order);

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
            ) : isError ? (
              <div className="text-center text-red-500 py-8">Failed to load programs.</div>
            ) : programs.length === 0 ? (
              <div className="text-center text-neutral-500 py-8">No programs found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {programs.map((program: ProgramApi) => (
                  <div 
                    key={program?.id} 
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
                            {program?.title ?? ''}
                            {program?.sub_title && (
                              <span className="text-primary-red font-medium"> {program?.sub_title}</span>
                            )}
                          </h2>
                        </div>
                      </div>
                      {/* Card content */}
                      <div className="px-5 pt-0 pb-5 flex-grow flex flex-col">
                        <div className="h-px bg-gray-100 w-full mb-4"></div>
                        <p className="text-neutral-700 text-sm mb-4">
                          {program?.description?.length > 100 ? 
                            `${program?.description?.substring(0, 100) ?? ''}...` : 
                            program?.description ?? ''
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
                            <span className="text-sm font-medium">{program?.status ?? ''}</span>
                          </div>
                        </div>
                        {/* Call to action */}
                        {program?.route ? (
                          <Link 
                            to={`/${program.route}`}
                            className="w-full block text-center bg-primary-blue-50 hover:bg-primary-blue-100 text-primary-blue font-medium rounded-full py-2.5 transition-colors text-sm"
                          >
                            View Program Details
                          </Link>
                        ) : (
                          <button
                            className="w-full block text-center bg-primary-blue-50 hover:bg-primary-blue-100 text-primary-blue font-medium rounded-full py-2.5 transition-colors text-sm"
                            // disabled
                          >
                            View Program Details
                          </button>
                        )}
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
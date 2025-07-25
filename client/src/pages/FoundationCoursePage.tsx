import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

// Foundation course programs data
const foundationPrograms = [
  {
    id: 1,
    slug: 'foundation/ignite',
    title: 'iLearn IAS Ignite',
    description: 'An Exclusive UPSC Foundation Program for College Students',
    icon: 'ri-award-line',
    duration: '10 months',
    usp: [],
    features: []
  },
  {
    id: 2,
    slug: 'foundation/junior',
    title: 'iLearn IAS Junior',
    description: 'A Flagship IAS Skill Development Program for School Students',
    icon: 'ri-graduation-cap-line',
    duration: '10 months',
    usp: [],
    features: []
  }
];

const FoundationCoursePage = () => {
  return (
    <>
      <Helmet>
        <title>Foundation Courses | iLearn IAS Academy</title>
        <meta 
          name="description" 
          content="Start your civil services journey with iLearn's specialized foundation programs designed for both college students and high school students." 
        />
      </Helmet>
      
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Foundation Courses
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Begin your journey towards civil services with our specialized foundation programs
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary-red hover:bg-red-600 text-white px-8 py-4 h-auto">
                    Enroll Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-blue px-8 py-4 h-auto">
                    Get Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Programs Section */}
        <section className="pt-8 pb-12 md:pt-12 md:pb-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {foundationPrograms.map((program) => (
                <div 
                  key={program.id}
                  className="program-card bg-white rounded-xl border border-neutral-100 transition-all duration-300 hover:border-neutral-200 overflow-hidden"
                >
                  <div className="flex flex-col h-full">
                    {/* Card header */}
                    <div className="relative p-5">
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-11 h-11 bg-primary-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className={`${program.icon} text-xl text-primary-blue`}></i>
                        </div>
                        <h2 className="font-semibold text-lg leading-tight">
                          iLearn IAS{' '}
                          <span className="text-primary-red">
                            {program.title.split('iLearn IAS ')[1]}
                          </span>
                        </h2>
                      </div>
                    </div>
                    
                    {/* Card content */}
                    <div className="px-5 pt-0 pb-5 flex-grow flex flex-col">
                      <div className="h-px bg-gray-100 w-full mb-4"></div>
                      <p className="text-neutral-700 text-sm mb-4">
                        {program.description}
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
                        to={`/${program.slug}`}
                        className="w-full block text-center bg-primary-blue-50 hover:bg-primary-blue-100 text-primary-blue font-medium rounded-full py-2.5 transition-colors text-sm"
                      >
                        VIEW PROGRAM DETAILS
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {/* <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-primary-blue">Common</span>
                <span className="text-primary-red"> Questions</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-blue to-primary-red mx-auto mb-4"></div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-3">
                {[
                  {
                    question: "Who should join the Ignite Foundation Program?",
                    answer: "The Ignite Foundation Program is ideal for college students and recent graduates who are starting their civil services preparation journey. It helps build a strong foundation and systematic approach to UPSC preparation."
                  },
                  {
                    question: "Is the Junior Foundation Program suitable for school students?",
                    answer: "Yes, the Junior Foundation Program is specifically designed for students in Classes 11 & 12, helping them balance their academic studies while preparing for civil services in the future."
                  },
                  {
                    question: "How are the classes scheduled?",
                    answer: "Ignite Program has regular weekday classes, while the Junior Program offers weekend classes to accommodate school schedules. Both programs include flexible timing options."
                  },
                  {
                    question: "What study materials are provided?",
                    answer: "Both programs provide comprehensive study materials, including basic NCERT materials, current affairs magazines, and practice question banks tailored to the respective program levels."
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
            </div>
          </div>
        </section> */}
      </PageTransition>
    </>
  );
};

export default FoundationCoursePage; 
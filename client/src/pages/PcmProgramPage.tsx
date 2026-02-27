import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Trophy, Clock, CheckCircle, Star } from 'lucide-react';

const PcmProgramPage = () => {
  return (
    <>
      <Helmet>
        <title>UPSC Prelims Cum Mains (PCM) Coaching Kerala | iLearn IAS Academy</title>
        <meta name="description" content="iLearn IAS Academy's PCM Program — Kerala's highest UPSC success rate. Comprehensive 12-month classroom coaching for both Prelims &amp; Mains. AIR 12, AIR 21, AIR 57 selections. Enquire now!" />
        <link rel="canonical" href="https://www.ilearnias.com/programs/prelims-cum-mains" />
        <meta property="og:title" content="UPSC Prelims Cum Mains (PCM) Coaching Kerala | iLearn IAS Academy" />
        <meta property="og:url" content="https://www.ilearnias.com/programs/prelims-cum-mains" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Prelims Cum Mains (PCM) Program",
            "url": "https://www.ilearnias.com/programs/prelims-cum-mains",
            "description": "Comprehensive 12-month classroom program covering both UPSC Prelims and Mains examinations. Kerala's highest success rate with alumni including AIR 12.",
            "provider": {
              "@type": "EducationalOrganization",
              "name": "iLearn IAS Academy",
              "url": "https://www.ilearnias.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Thiruvananthapuram",
                "addressRegion": "Kerala",
                "addressCountry": "IN"
              }
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "onsite",
              "inLanguage": "en",
              "courseWorkload": "PT12M"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ilearnias.com/" },
                { "@type": "ListItem", "position": 2, "name": "Programs", "item": "https://www.ilearnias.com/programs" },
                { "@type": "ListItem", "position": 3, "name": "PCM Program", "item": "https://www.ilearnias.com/programs/prelims-cum-mains" }
              ]
            }
          }
        `}</script>
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
                Prelims Cum Mains (PCM) Program
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Comprehensive classroom program with proven methodology and Kerala's highest success rate
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

        {/* Program Overview */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Program Overview
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our flagship program designed to take you from basics to success in both UPSC Prelims and Mains examinations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">12 Months</h3>
                  <p className="text-gray-600">Comprehensive duration</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Faculty</h3>
                  <p className="text-gray-600">Experienced instructors</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Results</h3>
                  <p className="text-gray-600">Kerala's highest success rate</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Coverage</h3>
                  <p className="text-gray-600">Full syllabus included</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Program Features
                </h2>
                <p className="text-xl text-gray-600">
                  Everything you need to succeed in your UPSC journey
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Syllabus Coverage</h3>
                  <p className="text-gray-600">Comprehensive coverage of both Prelims and Mains syllabus with integrated approach</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Methodology</h3>
                  <p className="text-gray-600">Time-tested teaching methods that have consistently produced top results</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Regular Assessment</h3>
                  <p className="text-gray-600">Continuous evaluation through tests and mock examinations</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Attention</h3>
                  <p className="text-gray-600">Individual guidance and doubt clearing sessions</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Study Materials</h3>
                  <p className="text-gray-600">Comprehensive study materials and reference books</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Preparation</h3>
                  <p className="text-gray-600">Complete personality test and interview guidance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Our PCM program has consistently produced outstanding results
              </p>
              
              <div className="bg-primary-blue-50 rounded-lg p-8 mb-8">
                <div className="flex justify-center mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-primary-blue mb-3">
                  Athul Janardanan IFS - State Topper
                </h3>
                <p className="text-gray-700 text-lg">
                  "iLearn's PCM program provided me with the perfect foundation and guidance to achieve success in UPSC. The comprehensive approach and excellent faculty made all the difference."
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-blue mb-2">45+</div>
                  <p className="text-gray-600">UPSC Selections</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-blue mb-2">5</div>
                  <p className="text-gray-600">Women in Top 100</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-blue mb-2">#1</div>
                  <p className="text-gray-600">Success Rate in Kerala</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-20 bg-primary-blue text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your UPSC Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our PCM program and be part of Kerala's most successful civil service coaching institute
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary-red hover:bg-red-600 text-white px-8 py-4 h-auto">
                    Enroll Today
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-blue px-8 py-4 h-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </>
  );
};

export default PcmProgramPage;
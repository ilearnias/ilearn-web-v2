import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Trophy, Clock, CheckCircle, Star, Target, Award, FileText, Calendar, BookMarked, RefreshCw, Brain, BarChart3 } from 'lucide-react';

const IntegratedPrelimsTestSeries = () => {
  return (
    <>
      <Helmet>
        <title>Integrated Prelims Test Series (iPTS) | iLearn IAS Academy</title>
        <meta name="description" content="Comprehensive integrated prelims test series with expert evaluation and detailed analysis for UPSC CSE preparation." />
      </Helmet>
      
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Integrated Prelims Test Series (iPTS)
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Comprehensive test series designed to evaluate and enhance your prelims preparation with expert analysis
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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                    Program Overview
                  </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                iPTS is a meticulously designed test series program to help aspirants master the art of solving Prelims questions. Built on deep research and trend analysis, iPTS offers a structured test schedule, expert mentorship, and focused strategy sessions to boost your Prelims readiness.
                </p>
              </div>

                            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-8">
                  What You Get
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Self-Assessment Test</h3>
                    <p className="text-gray-600">Open to all aspirants</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">65 Daily Practice Tests </h3>
                    <p className="text-gray-600">Sharpen accuracy and consistency</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookMarked className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">11 Subject-wise Tests</h3>
                    <p className="text-gray-600">Strengthen static portions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">3 Current Affairs Tests </h3>
                    <p className="text-gray-600">Stay updated and relevant</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">2 Revision Tests </h3>
                    <p className="text-gray-600">Reinforce what you've learned</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">3 Topic-wise CSAT Tests</h3>
                    <p className="text-gray-600">Master aptitude and comprehension</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">10 Full-Length Tests</h3>
                    <p className="text-gray-600">Simulate the actual UPSC Prelims</p>
                  </div>
              </div>
              <div className="text-center ">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 mt-8">
                Theory of Prelims
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our Prelims Research Team has decoded the logic behind UPSC’s question framing. Through PYQ-based pattern recognition, strategic solving techniques, and intelligent guesswork, we train aspirants to think like UPSC and choose the right answers with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 ">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Program Features
                </h2>
                
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">General strategy sessions on approaching Prelims                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">Subject-wise strategy discussions for focused prep
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">PYQ analysis - subject-wise and year-wise</p>
                </div>
                
             
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">Revision classes for better recall</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">Live MCQ-solving sessions with mentors</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">Current affairs classes tailored for Prelims</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">Post-test discussions and doubt clearing</p>
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
                Ready to Ace Your Prelims?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our Integrated Prelims Test Series and be part of Kerala's most successful civil service coaching institute
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

export default IntegratedPrelimsTestSeries;

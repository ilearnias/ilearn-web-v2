import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Trophy, Clock, CheckCircle, Star, Target, Award, Brain, FileText, Globe } from 'lucide-react';

const PoliticalScienceIROptional = () => {
  return (
    <>
      <Helmet>
        <title>Political Science and International Relations Optional | iLearn IAS Academy</title>
        <meta name="description" content="Results-driven PSIR optional preparation program with expert guidance for UPSC CSE mains examination." />
      </Helmet>
      
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Political Science and International Relations Optional
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                A results-driven programme crafted to simplify the PSIR syllabus, strengthen conceptual clarity, and build mastery in answer writing
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
                  A results-driven programme crafted to simplify the PSIR syllabus, strengthen conceptual clarity, and build mastery in answer writing — all under expert mentorship.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Duration</h3>
                  <p className="text-gray-600">6 months</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Seasoned Faculty Panel</h3>
                  <p className="text-gray-600">Highly qualified mentors with rich subject expertise</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Results</h3>
                  <p className="text-gray-600">Top performers year after year</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thorough Syllabus Coverage</h3>
                  <p className="text-gray-600">Structured and complete coverage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Key Features
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  A focused and result-oriented programme that blends strong content, consistent practice, and expert guidance for PSIR success.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Holistic Approach</h3>
                  <p className="text-gray-600">Integrated with GS, intensive classroom sessions, and inclusive current affairs coverage.</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Syllabus Coverage</h3>
                  <p className="text-gray-600">Complete and in-depth treatment of both Paper I & II with thematic clarity.</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Well-Curated Study Materials</h3>
                  <p className="text-gray-600">Concise, structured handouts with value additions and interlinkages.</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Answer Writing Mastery</h3>
                  <p className="text-gray-600">Focus on PYQs, expected questions, and intensive writing sessions.</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">One-on-One Mentorship</h3>
                  <p className="text-gray-600">Personalised feedback and guidance to enhance individual performance.</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Current Affairs Integration</h3>
                  <p className="text-gray-600">Weekly discussions and content updation based on evolving global and national issues.</p>
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
                Ready to Master PSIR Optional?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our Political Science and International Relations optional program and be part of Kerala's most successful civil service coaching institute
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

export default PoliticalScienceIROptional; 
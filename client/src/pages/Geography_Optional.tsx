import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Trophy, Clock, CheckCircle, Star, Map, Globe, Award } from 'lucide-react';

const GeographyOptional = () => {
  return (
    <>
      <Helmet>
        <title>Geography Optional | iLearn IAS Academy</title>
        <meta name="description" content="Comprehensive Geography optional preparation program with expert guidance for UPSC CSE mains examination." />
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
                Geography Optional
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Master Geography optional with expert guidance and comprehensive study materials for UPSC CSE mains
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
                A structured and intensive programme designed for UPSC aspirants opting for Geography as their optional subject. Led by experienced mentors Mr. Nikhil Lohithakshan and Mr. Dias Jose, the course focuses on conceptual clarity, analytical skill-building, and exam-focused presentation techniques.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">6 Months</h3>
                  <p className="text-gray-600">Duration </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Renowned Faculties</h3>
                  <p className="text-gray-600">Subject Experts</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Results </h3>
                  <p className="text-gray-600">Numerous All India Top Ranks
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Holistic Approach</h3>
                  <p className="text-gray-600">Full syllabus covered</p>
                </div>
              </div>
            </div>
          </div>
        </section>

       

        {/* Key Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Key Features
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A result-driven programme designed to simplify concepts, sharpen map skills, and boost scores with expert guidance and strategic practice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Syllabus Coverage</h3>
                  <p className="text-gray-600"> Integrated coaching for both Paper I and II with clear focus on core concepts
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Map Work & Visual Aids</h3>
                  <p className="text-gray-600">Regular map practice, diagrams, and flowcharts to enhance presentation.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Answer Writing Focus</h3>
                  <p className="text-gray-600"> Classroom guidance on structuring answers and improving writing skills.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Study Materials</h3>
                  <p className="text-gray-600"> Curated handouts, case studies, and updated content from trusted mentors.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Test Series & Feedback</h3>
                  <p className="text-gray-600">Module-wise tests with detailed personal feedback for continuous improvement.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">.Experienced Mentorship</h3>
                  <p className="text-gray-600"> Guidance from experts with proven success in UPSC.</p>
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
                Ready to Master Geography Optional?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our Geography optional program and be part of Kerala's most successful civil service coaching institute
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

export default GeographyOptional;

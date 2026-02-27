import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Newspaper, TrendingUp, Calendar, Clock, CheckCircle, Target } from 'lucide-react';

const CanaProgramPage = () => {
  return (
    <>
      <Helmet>
        <title>UPSC Current Affairs Coaching Kerala (CANA) | iLearn IAS Academy</title>
        <meta name="description" content="iLearn IAS Academy's CANA program — daily current affairs &amp; news analysis for UPSC aspirants in Kerala. Expert analysis, answer writing practice. Join now from Trivandrum." />
        <link rel="canonical" href="https://www.ilearnias.com/programs/current-affairs-news-analysis" />
        <meta property="og:title" content="UPSC Current Affairs Coaching Kerala (CANA) | iLearn IAS Academy" />
        <meta property="og:url" content="https://www.ilearnias.com/programs/current-affairs-news-analysis" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Current Affairs and News Analysis (CANA)",
            "url": "https://www.ilearnias.com/programs/current-affairs-news-analysis",
            "description": "Ongoing daily current affairs and news analysis program for UPSC aspirants. Covers editorial analysis, answer writing practice, and monthly compilations.",
            "provider": {
              "@type": "EducationalOrganization",
              "name": "iLearn IAS Academy",
              "url": "https://www.ilearnias.com"
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "onsite",
              "inLanguage": "en"
            },
            "offers": {
              "@type": "Offer",
              "price": "25000",
              "priceCurrency": "INR"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ilearnias.com/" },
                { "@type": "ListItem", "position": 2, "name": "Programs", "item": "https://www.ilearnias.com/programs" },
                { "@type": "ListItem", "position": 3, "name": "CANA Program", "item": "https://www.ilearnias.com/programs/current-affairs-news-analysis" }
              ]
            }
          }
        `}</script>
      </Helmet>
      
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-red to-red-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Newspaper className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Current Affairs and News Analysis (CANA)
              </h1>
              <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
                Stay ahead with daily current affairs coverage and analytical skills for UPSC success
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary-blue hover:bg-blue-600 text-white px-8 py-4 h-auto">
                    Join CANA
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-red px-8 py-4 h-auto">
                    Learn More
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
                  Why CANA Matters
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Current affairs form the backbone of UPSC preparation. Our CANA program ensures you're always updated and analysis-ready.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ongoing</h3>
                  <p className="text-gray-600">Continuous program duration</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Updates</h3>
                  <p className="text-gray-600">Fresh content every day</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-primary-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Focus</h3>
                  <p className="text-gray-600">Deep analytical approach</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary-red" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">UPSC Focused</h3>
                  <p className="text-gray-600">Exam-specific content</p>
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
                  Comprehensive current affairs preparation tailored for UPSC aspirants
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Daily News Analysis</h3>
                  <p className="text-gray-600">Comprehensive analysis of important daily news events with UPSC relevance</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Monthly Compilations</h3>
                  <p className="text-gray-600">Organized monthly compilations for effective revision and quick reference</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Government Schemes</h3>
                  <p className="text-gray-600">Updated coverage of all government schemes and policy developments</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">International Relations</h3>
                  <p className="text-gray-600">Detailed analysis of international events and their implications</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Economic Updates</h3>
                  <p className="text-gray-600">Current economic developments with simplified explanations</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Questions</h3>
                  <p className="text-gray-600">Regular practice questions based on current affairs for both Prelims and Mains</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes CANA Special */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  What Makes Our CANA Special?
                </h2>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-6 h-6 text-primary-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Exam-Specific Approach</h3>
                    <p className="text-gray-600">Every piece of content is filtered through the lens of UPSC relevance, ensuring you focus only on what matters for your exam.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytical Framework</h3>
                    <p className="text-gray-600">Learn to analyze news events from multiple perspectives - political, economic, social, and international dimensions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Integration with Syllabus</h3>
                    <p className="text-gray-600">Current affairs seamlessly integrated with static portions of the syllabus for comprehensive understanding.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Impact */}
        <section className="py-16 md:py-20 bg-primary-red-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                CANA Success Impact
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Our current affairs program has been instrumental in our students' success
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary-red mb-2">90%</div>
                  <p className="text-gray-600">Students report improved confidence in current affairs</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary-red mb-2">Daily</div>
                  <p className="text-gray-600">Fresh content updates keeping you current</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary-red mb-2">100%</div>
                  <p className="text-gray-600">UPSC-relevant content coverage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-20 bg-primary-red text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Stay Ahead with CANA
              </h2>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Join our Current Affairs and News Analysis program and never miss an important development for your UPSC preparation
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary-blue hover:bg-blue-600 text-white px-8 py-4 h-auto">
                    Enroll in CANA
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-red px-8 py-4 h-auto">
                    Get More Info
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

export default CanaProgramPage;
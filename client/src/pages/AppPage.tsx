import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';

interface AppFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface AppRating {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock data for app features
const MockAppFeatures: AppFeature[] = [
  {
    id: 1,
    title: 'Daily Newspaper Reading Support',
    description: 'Stay informed with our guided newspaper reading support, highlighting key points relevant to civil service exams.',
    icon: 'ri-newspaper-line'
  },
  {
    id: 2,
    title: 'Daily Answer Writing Practice',
    description: 'Improve your writing skills with daily answer practice assignments and personalized feedback from expert faculty.',
    icon: 'ri-file-edit-line'
  },
  {
    id: 3,
    title: 'Comprehensive Materials for Prelims and Mains',
    description: 'Access complete and current study materials specifically curated for both Prelims and Mains examinations.',
    icon: 'ri-book-read-line'
  },
  {
    id: 4,
    title: 'Prelims Digital Question Bank',
    description: 'Practice with our extensive digital question bank that allows topic-wise revision and targeted preparation.',
    icon: 'ri-questionnaire-line'
  },
  {
    id: 5,
    title: 'AI-Powered Analytics',
    description: 'Track your progress with AI-powered analytics that identify weak areas and provide personalized recommendations.',
    icon: 'ri-line-chart-line'
  }
];

// Mock data for app ratings
const MockAppRatings: AppRating[] = [
  {
    id: 1,
    name: 'Rohan K.',
    rating: 5,
    comment: 'The best app for civil service preparation. Comprehensive study materials and regular updates make it invaluable.',
    date: '2023-07-15'
  },
  {
    id: 2,
    name: 'Anjali S.',
    rating: 4,
    comment: 'Great content and user interface. The daily current affairs section is extremely helpful. Could improve the quiz section.',
    date: '2023-06-22'
  },
  {
    id: 3,
    name: 'Vishnu P.',
    rating: 5,
    comment: 'Being able to access all study materials offline has been a game-changer. The performance tracking helps identify weak areas.',
    date: '2023-08-05'
  },
  {
    id: 4,
    name: 'Meera R.',
    rating: 5,
    comment: 'Perfect companion for UPSC preparation. The faculty responses to doubts are quick and detailed.',
    date: '2023-07-30'
  },
  {
    id: 5,
    name: 'Akshay T.',
    rating: 4,
    comment: 'Excellent content quality. The video lectures are concise and to the point. Would like more mock tests though.',
    date: '2023-08-12'
  }
];

const AppPage = () => {
  // Fetch app features
  const { data: appFeatures = MockAppFeatures, isLoading: featuresLoading } = useQuery({
    queryKey: ['/api/app/features'],
    queryFn: async () => {
      // Return mock data for now
      return Promise.resolve(MockAppFeatures);
    },
  });

  // Fetch app ratings
  const { data: appRatings = MockAppRatings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['/api/app/ratings'],
    queryFn: async () => {
      // Return mock data for now
      return Promise.resolve(MockAppRatings);
    },
  });

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="ri-star-fill text-yellow-400"></i>);
      } else {
        stars.push(<i key={i} className="ri-star-line text-gray-300"></i>);
      }
    }
    return stars;
  };

  return (
    <>
      <Helmet>
        <title>iLearn UPSC Preparation App | Study Anywhere | iLearn IAS Academy</title>
        <meta name="description" content="Access iLearn IAS Academy's study materials, daily current affairs, answer writing practice and more on the iLearn App. Learn UPSC on the go from Kerala's top institute." />
        <link rel="canonical" href="https://www.ilearnias.com/app" />
        <meta property="og:title" content="iLearn UPSC Preparation App | iLearn IAS Academy Kerala" />
        <meta property="og:url" content="https://www.ilearnias.com/app" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "iLearn IAS App",
            "url": "https://www.ilearnias.com/app",
            "applicationCategory": "EducationApplication",
            "operatingSystem": "Android, iOS",
            "description": "UPSC preparation app by iLearn IAS Academy with daily current affairs, study materials, and answer writing practice.",
            "provider": {
              "@type": "EducationalOrganization",
              "name": "iLearn IAS Academy",
              "url": "https://www.ilearnias.com"
            }
          }
        `}</script>
      </Helmet>
      
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-light-grey py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2">
                <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">
                  Prepare Anytime, Anywhere with <span className="text-primary-red">iLearn IAS App</span>
                </h1>
                <p className="text-dark-grey text-lg mb-6">
                  A comprehensive mobile learning platform designed specifically for civil service aspirants. Access study materials, take tests, and track your progress on the go.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://play.google.com/store" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <i className="ri-google-play-fill text-2xl mr-2"></i>
                    <div>
                      <div className="text-xs">GET IT ON</div>
                      <div className="font-medium">Google Play</div>
                    </div>
                  </a>
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <i className="ri-apple-fill text-2xl mr-2"></i>
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="font-medium">App Store</div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-blue rounded-3xl opacity-10 blur-xl transform translate-y-4 translate-x-4"></div>
                  <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-gray-200">
                    <img 
                      src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="iLearn IAS App on mobile phone" 
                      className="w-64 h-auto rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-2">
                App Features
              </h2>
              <p className="text-dark-grey max-w-3xl mx-auto">
                Designed with the aspirant's needs in mind, our app comes packed with features to enhance your preparation.
              </p>
            </div>
            
            {featuresLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appFeatures.map((feature) => (
                  <div 
                    key={feature.id} 
                    className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative"
                  >
                    {/* Material Design 3 style surface highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Material Design 3 style icon container with state layer */}
                    <div className="w-14 h-14 bg-primary-blue rounded-xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <i className={`${feature.icon} text-white text-xl`}></i>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold mb-2 text-primary-blue group-hover:text-primary-blue-700 transition-colors duration-300">{feature.title}</h3>
                      <p className="text-neutral-700">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* App Screenshots Section */}
        <section className="py-12 bg-light-grey">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-2">
                App Screenshots
              </h2>
              <p className="text-dark-grey max-w-3xl mx-auto">
                Take a look at the intuitive interface and features of the iLearn IAS App.
              </p>
            </div>
            
            <Tabs defaultValue="learn" className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white border border-neutral-100 p-1 rounded-full overflow-hidden shadow-sm">
                  <TabsTrigger 
                    value="learn" 
                    className="transition-all duration-300 data-[state=active]:bg-primary-blue data-[state=active]:text-white rounded-full px-6 py-2"
                  >
                    <i className="ri-book-open-line mr-2"></i>
                    Learn
                  </TabsTrigger>
                  <TabsTrigger 
                    value="practice" 
                    className="transition-all duration-300 data-[state=active]:bg-primary-blue data-[state=active]:text-white rounded-full px-6 py-2"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Practice
                  </TabsTrigger>
                  <TabsTrigger 
                    value="track" 
                    className="transition-all duration-300 data-[state=active]:bg-primary-blue data-[state=active]:text-white rounded-full px-6 py-2"
                  >
                    <i className="ri-line-chart-line mr-2"></i>
                    Track Progress
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="learn" className="mt-0">
                <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar px-2">
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      {/* Material Design 3 device frame */}
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      {/* Material Design 3 hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Learn section screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Course Materials</p>
                  </div>
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Video lecture screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Video Lectures</p>
                  </div>
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Study materials screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Digital Library</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="practice" className="mt-0">
                <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar px-2">
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1606326608690-4e0281b1e588?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Practice quiz screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Daily Quiz</p>
                  </div>
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Mock test screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Mock Tests</p>
                  </div>
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1584697964358-3e14ca23fc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Answer writing screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Answer Writing</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="track" className="mt-0">
                <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar px-2">
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Progress dashboard screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Dashboard</p>
                  </div>
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Analytics screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">AI Analytics</p>
                  </div>
                  <div className="shrink-0 snap-center group">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-8 border-white shadow-lg z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded-2xl"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Performance trends screenshot" 
                        className="h-[460px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-4 text-center font-medium text-primary-blue">Progress Reports</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Ratings & Reviews Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-2">
                User Reviews
              </h2>
              <p className="text-dark-grey max-w-3xl mx-auto">
                See what our users have to say about the iLearn IAS App.
              </p>
            </div>
            
            {ratingsLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {appRatings.map((rating) => (
                  <div 
                    key={rating.id} 
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 relative overflow-hidden group"
                  >
                    {/* Material Design 3 decorative corner */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary-blue-50 to-primary-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-blue-700 rounded-xl flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                          {rating.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary-blue-800">{rating.name}</h4>
                          <div className="flex mt-1">{renderStars(rating.rating)}</div>
                        </div>
                      </div>
                      <p className="text-neutral-700 mb-3 italic">"{rating.comment}"</p>
                      <p className="text-xs text-neutral-500 flex items-center">
                        <i className="ri-calendar-line mr-1"></i>
                        {new Date(rating.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-8">
              <div className="inline-flex items-center bg-light-grey px-4 py-2 rounded-full">
                <div className="flex mr-2">
                  {renderStars(4.8)}
                </div>
                <span className="font-semibold">4.8 / 5</span>
                <span className="text-gray-500 ml-2">(500+ reviews)</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Download CTA - Simplified Material Design 3 */}
        <section className="py-16 relative" id="download-app">
          {/* Material Design 3 subtle background and decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-blue-50/80 z-0"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-blue opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-primary-blue opacity-5 blur-2xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-blue-200 to-transparent opacity-50"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Content card with proper Material Design 3 elevation */}
              <div className="flex flex-col md:flex-row">
                {/* Left side - phone mockup */}
                <div className="md:w-1/3 bg-primary-blue-50 flex items-center justify-center py-8">
                  <div className="relative w-40 h-80">
                    <div className="absolute inset-0 rounded-3xl border-8 border-white shadow-lg"></div>
                    <div className="absolute inset-2 overflow-hidden rounded-2xl bg-primary-blue-100">
                      <img 
                        src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                        alt="iLearn IAS App mockup" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right side - download options */}
                <div className="md:w-2/3 p-8 md:p-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary-blue-800 mb-4">Download the App Today</h2>
                  <p className="text-neutral-600 mb-8">
                    Take your civil service preparation to the next level with the iLearn IAS App. Join thousands of aspirants who have already transformed their study routine.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="https://play.google.com/store" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center bg-white border border-neutral-200 text-primary-blue px-6 py-3 rounded-full hover:shadow hover:border-primary-blue/30 transition-all duration-300"
                    >
                      <i className="ri-google-play-fill text-2xl mr-2 text-primary-blue-700"></i>
                      <div>
                        <div className="text-xs text-neutral-500">GET IT ON</div>
                        <div className="font-medium">Google Play</div>
                      </div>
                    </a>
                    
                    <a 
                      href="https://apps.apple.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center bg-white border border-neutral-200 text-primary-blue px-6 py-3 rounded-full hover:shadow hover:border-primary-blue/30 transition-all duration-300"
                    >
                      <i className="ri-apple-fill text-2xl mr-2 text-primary-blue-700"></i>
                      <div>
                        <div className="text-xs text-neutral-500">DOWNLOAD ON THE</div>
                        <div className="font-medium">App Store</div>
                      </div>
                    </a>
                  </div>
                  
                  <div className="mt-6 flex items-center">
                    <div className="flex items-center text-neutral-500 text-sm">
                      <i className="ri-download-cloud-line text-primary-blue mr-2"></i>
                      <span>100,000+ downloads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white relative">
          {/* Material Design 3 subtle divider */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-neutral-200 rounded-full"></div>
          
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block bg-primary-blue-50 px-4 py-1.5 rounded-full text-primary-blue-700 text-sm font-medium mb-3">App Support</div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-blue-800 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Find answers to common questions about the iLearn IAS App.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-5">
                <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-primary-blue-800 group-hover:text-primary-blue transition-colors duration-300">
                    <div className="w-8 h-8 bg-primary-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-blue-100 transition-colors duration-300">
                      <i className="ri-download-line text-primary-blue"></i>
                    </div>
                    Is the app free to download?
                  </h3>
                  <p className="text-neutral-700 pl-11">
                    Yes, the app is free to download. However, some premium features and content may require a subscription or one-time purchase.
                  </p>
                </div>
                
                <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-primary-blue-800 group-hover:text-primary-blue transition-colors duration-300">
                    <div className="w-8 h-8 bg-primary-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-blue-100 transition-colors duration-300">
                      <i className="ri-login-circle-line text-primary-blue"></i>
                    </div>
                    Can I access my course content from the app?
                  </h3>
                  <p className="text-neutral-700 pl-11">
                    Yes, if you're enrolled in any of our programs, you can access all your course content through the app using your student credentials.
                  </p>
                </div>
                
                <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-primary-blue-800 group-hover:text-primary-blue transition-colors duration-300">
                    <div className="w-8 h-8 bg-primary-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-blue-100 transition-colors duration-300">
                      <i className="ri-wifi-off-line text-primary-blue"></i>
                    </div>
                    Does the app work offline?
                  </h3>
                  <p className="text-neutral-700 pl-11">
                    Yes, you can download study materials, videos, and tests for offline access. However, features like doubt resolution and performance sync require internet connectivity.
                  </p>
                </div>
                
                <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-primary-blue-800 group-hover:text-primary-blue transition-colors duration-300">
                    <div className="w-8 h-8 bg-primary-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-blue-100 transition-colors duration-300">
                      <i className="ri-refresh-line text-primary-blue"></i>
                    </div>
                    How often is the content updated?
                  </h3>
                  <p className="text-neutral-700 pl-11">
                    Current affairs are updated daily, while study materials and test papers are updated regularly based on the changing patterns of civil service examinations.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-10">
                <Link href="/contact">
                  <Button className="bg-primary-blue hover:bg-primary-blue-700 text-white rounded-full px-8 py-6 font-medium transition-all duration-300 hover:shadow-md">
                    <i className="ri-customer-service-2-line mr-2"></i>
                    Still Have Questions? Contact Us
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

export default AppPage;

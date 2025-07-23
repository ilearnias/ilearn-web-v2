import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-20 bg-white" id="join-now">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl shadow-lg bg-primary-red">
          <div className="p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
            <div className="md:w-7/12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 md:mb-6 text-white leading-tight">
                Ready to Begin Your <span className="text-white underline decoration-white decoration-4 underline-offset-4">Civil Service</span> Journey?
              </h2>
              
              <p className="text-white text-lg md:text-xl mb-8 md:mb-10 leading-relaxed">
                Join Kerala's most trusted civil service coaching institute. Schedule a free counseling session with our experts to discuss your preparation strategy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/contact">
                  <Button 
                    className="w-full sm:w-auto bg-white text-primary-red px-8 py-4 h-auto rounded-full text-base font-medium shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Book a Counselling Call
                  </Button>
                </Link>
                
                <Link href="/app">
                  <Button 
                    className="w-full sm:w-auto bg-primary-blue hover:bg-primary-blue text-white px-8 py-4 h-auto rounded-full text-base font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
                      <circle cx="17" cy="7" r="5"/>
                    </svg>
                    Download iLearn IAS App
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block md:w-5/12 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Student counseling session" 
                  className="w-full h-auto object-cover rounded-2xl"
                  width="500"
                  height="375"
                />
                
                <div className="absolute top-4 right-4 bg-white shadow-sm rounded-full px-4 py-2 text-sm font-medium text-primary-red">
                  Free Counselling
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center mt-5">
                <div className="bg-white rounded-full px-5 py-2 text-sm font-medium text-primary-red shadow-sm">
                  343+ Selections
                </div>
                <div className="bg-white rounded-full px-5 py-2 text-sm font-medium text-primary-red shadow-sm">
                  10+ Years Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

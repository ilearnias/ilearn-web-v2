import { API } from '@/config/api';
import apiClient from '@/config/apiClient';
import QUERY_KEY from '@/config/queryKeys';
import { Testimonial } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';

const TestimonialTicker = () => {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: [QUERY_KEY?.SUCCESS_STORIES],
    queryFn: async () => {
      const response = await apiClient.get(API?.SUCCESS_STORIES + "?isActive=true");
      // Add error logging to help debug API response
      console.log('API Response:', response.data);
      return response.data.data || []; // Return empty array if data is undefined
    },
  });

  // Scroll controls
  const scrollLeft = () => {
    const container = document.getElementById('testimonial-scroll-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('testimonial-scroll-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Render image testimonial card (Success Story)
  const renderImageTestimonial = (testimonial: Testimonial) => {
    return (
      <div 
        key={testimonial.id} 
        className="flex-shrink-0 w-[275px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative cursor-pointer transform hover:scale-105"
      >
        {/* Success Story image content */}
        <div className="relative overflow-hidden">
          {/* Image content - Portrait format (9:16) */}
          <div className="w-full aspect-[9/16] overflow-hidden bg-gray-100 relative">
            <img 
              src={testimonial.image}
              alt={`${testimonial.name} - ${testimonial.description || testimonial.rank}`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                console.log(`Failed to load image: ${testimonial.image} for ${testimonial.name}`);
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Gradient overlay always present for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            
            {/* Name and rank overlay - enhanced hover effects */}
            {testimonial.name && (testimonial.rank || testimonial.description) && (
              <div className="absolute inset-0 flex items-end justify-center p-4">
                <div className="text-white text-center w-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <div className="font-bold text-lg mb-1 drop-shadow-lg">{testimonial.name}</div>
                  <div className="text-sm font-medium text-gray-200 drop-shadow-lg">
                    {testimonial.rank || testimonial.description}
                  </div>
                  
                  {/* Quote appears on hover */}
                  {(testimonial.details || testimonial.quote) && (
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 mt-3">
                      <div className="text-xs text-gray-300 bg-black/30 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        {testimonial.details || testimonial.quote}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Success badge */}
            <div className="absolute top-4 right-4 bg-primary-red text-white px-2 py-1 rounded-full text-xs font-bold transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
              SUCCESS
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 relative my-6 mx-auto max-w-[1300px]">
      {/* Decorative frame that fits testimonial carousel better */}
      <div className="absolute top-0 left-0 right-0 mx-auto max-w-[1200px] h-[540px] border-2 border-primary-red rounded-xl z-0 opacity-10"></div>
      <div className="absolute top-0 left-4 w-12 h-12 border-t-2 border-l-2 border-primary-red -translate-x-2 -translate-y-2 rounded-tl-lg"></div>
      <div className="absolute top-0 right-4 w-12 h-12 border-t-2 border-r-2 border-primary-red translate-x-2 -translate-y-2 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-4 w-12 h-12 border-b-2 border-l-2 border-primary-red -translate-x-2 translate-y-2 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-4 w-12 h-12 border-b-2 border-r-2 border-primary-red translate-x-2 translate-y-2 rounded-br-lg"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 relative inline-block">
            <span className="text-primary-blue">Success</span> <span className="text-primary-red">Stories</span>
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
          </h2>
          <p className="text-neutral-600 mt-3 max-w-2xl mx-auto">See how our students achieved remarkable results in the civil services examination</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation buttons - Material Design 3 style */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-white hover:-translate-x-0.5"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-red">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <div 
              id="testimonial-scroll-container"
              className="flex overflow-x-auto hide-scrollbar gap-6 py-4 px-4 md:px-8 pb-6"
            >
              {testimonials.length > 0 ? (
                testimonials
                  .filter((testimonial: Testimonial) => testimonial.id !== 4)
                  .filter((testimonial: Testimonial, index: number, self: Testimonial[]) => 
                    index === self.findIndex((t: Testimonial) => t.name === testimonial.name)
                  )
                  .sort((a: Testimonial, b: Testimonial) => {
                    // Use the correct property names (lowercase)
                    const orderA = a.order !== null && a.order !== undefined ? Number(a.order) : Number.MAX_SAFE_INTEGER;
                    const orderB = b.order !== null && b.order !== undefined ? Number(b.order) : Number.MAX_SAFE_INTEGER;
                    
                    // Sort by display order (lower numbers first)
                    if (orderA !== orderB) {
                      return orderA - orderB;
                    }
                    
                    // If same display order or both null/undefined, fall back to creation date
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA; // Newer items first as fallback
                  })
                  .map((testimonial: Testimonial) => renderImageTestimonial(testimonial))
              ) : (
                <div className="text-center w-full py-4">No success stories available</div>
              )}
            </div>
            
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-white hover:translate-x-0.5"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-red">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialTicker;
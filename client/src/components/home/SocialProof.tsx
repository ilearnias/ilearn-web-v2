const SocialProof = () => {
  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-blue-50 via-blue-50 to-white relative border-t-4 border-b-4 border-primary-blue/30 shadow-md">
      {/* Top decorative elements */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary-blue/20"></div>
      <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary-red/20"></div>
      
      <div className="container mx-auto px-2 md:px-3">
        {/* Combined headline with gradient background */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-primary-blue to-primary-red p-5 rounded-lg shadow-lg mb-2">
            <h2 className="text-white font-extrabold text-xl md:text-2xl lg:text-3xl tracking-tight leading-tight">
              Civil Service Examination 2024
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl">Result Highlights</span>
            </h2>
          </div>
        </div>
        
        {/* Stats cards with aligned layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-lg border-2 border-primary-blue/20 p-4 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
            {/* Stripe accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-blue to-primary-red"></div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary-blue to-primary-red text-white shadow-md mr-4">
                <span className="text-2xl font-bold">6</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-primary-blue">Top 100 Ranks</h3>
                <p className="text-dark-grey text-sm">Five of our students secured positions in the top 100 ranks nationwide</p>
              </div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-lg border-2 border-primary-blue/20 p-4 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
            {/* Stripe accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-blue to-primary-red"></div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary-blue to-primary-red text-white shadow-md mr-4">
                <span className="text-2xl font-bold">22</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-primary-blue">Classroom Success</h3>
                <p className="text-dark-grey text-sm">Selections from our Prelims-cum-Mains & Classroom Program</p>
              </div>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white rounded-lg border-2 border-primary-blue/20 p-4 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
            {/* Stripe accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-blue to-primary-red"></div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary-blue to-primary-red text-white shadow-md mr-4">
                <span className="text-2xl font-bold">44</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-primary-blue">Total Selections</h3>
                <p className="text-dark-grey text-sm">Overall selections from our institute in <span className="font-bold">CSE 2024</span></p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative elements */}
        <div className="flex justify-center mt-6">
          <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-primary-blue to-primary-red rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

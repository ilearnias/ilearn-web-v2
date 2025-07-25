import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      {/* Light background with gentle gradient */}
      <div className="absolute inset-0 -z-10 bg-[#f8f9fe]"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left content - Text and buttons */}
          <motion.div 
            className="w-full md:w-1/2 z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main heading with two-color design */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-[#e21a24] block mb-1">
                  We don't claim
                </span>
                <span className="text-[#e21a24] block mb-1">
                  results,
                </span>
                <span className="text-[#20468D] block">
                  we make <span className="relative inline-block">
                    <span className="relative z-10">genuine</span>
                    <span className="absolute bottom-0 left-0 h-full  z-0"></span>
                  </span>
                </span>
                <span className="text-[#20468D] block">
                  results.
                </span>
              </h1>
            </motion.div>
            
            {/* Vertical info bar */}
            <motion.div 
              variants={itemVariants}
              className="relative pl-6 mb-8"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e21a24] rounded-full"></div>
              <p className="text-neutral-800 text-lg leading-relaxed">
                <span className="font-medium">Kerala's highest Prelims-cum-Mains & Classroom program success rate.</span>
                <br />
                <span className="font-bold text-[#e21a24] text-xl mt-2 inline-block">343 Selections in 10 years.</span>
              </p>
            </motion.div>
            
            {/* Action buttons */}
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link href="/programs">
                <Button className="group w-full sm:w-auto bg-[#e21a24] hover:bg-[#ef5350] text-white font-medium px-8 py-5 h-auto rounded-full shadow-md transition-all duration-300 text-base">
                  Explore Programs
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/about">
                <Button className="w-full sm:w-auto border-2 border-[#20468D] bg-transparent text-[#20468D] hover:bg-[#20468D] hover:text-white font-medium px-8 py-5 h-auto rounded-full transition-all duration-300 text-base">
                  About Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right content - White card */}
          <motion.div 
            className="w-full md:w-1/2 flex items-center justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.3,
              type: 'spring',
              stiffness: 100
            }}
          >
            <div className="w-full max-w-md aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe 
                src="https://www.youtube.com/embed/NVGwwVzTeJU?autoplay=1&loop=1&controls=0&showinfo=0&modestbranding=1&mute=1&playlist=NVGwwVzTeJU" 
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                frameBorder="0"
                title="iLearn IAS Video"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

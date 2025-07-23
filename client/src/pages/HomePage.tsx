import PageTransition from '@/components/layout/PageTransition';
import Hero from '@/components/home/Hero';
import ResultsCarousel from '@/components/home/ResultsCarousel';
import MediaShoutouts from '@/components/home/MediaShoutouts';
import TestimonialTicker from '@/components/home/TestimonialTicker';
import VideoTestimonials from '@/components/home/VideoTestimonials';
import ProgramTeasers from '@/components/home/ProgramTeasers';
import SocialProof from '@/components/home/SocialProof';
import CallToAction from '@/components/home/CallToAction';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>iLearn IAS Academy | Best Civil Service Coaching in Trivandrum</title>
        <meta name="description" content="Top civil service coaching institute in Trivandrum with best results in Kerala. Join our specialized programs for UPSC, KAS, and other competitive exams." />
        <meta name="keywords" content="UPSC coaching, KAS coaching, civil service exam, Trivandrum, Kerala, IAS academy" />
      </Helmet>
      
      <PageTransition>
        <Hero />
        <SocialProof />
        <ResultsCarousel />
        <MediaShoutouts />
        <VideoTestimonials />
        <TestimonialTicker />
        <ProgramTeasers />
        <CallToAction />
      </PageTransition>
    </>
  );
};

export default HomePage;

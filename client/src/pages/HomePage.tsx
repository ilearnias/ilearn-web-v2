import PageTransition from '@/components/layout/PageTransition';
import Hero from '@/components/home/Hero';
import ResultsCarousel from '@/components/home/ResultsCarousel';
import MediaShoutouts from '@/components/home/MediaShoutouts';
import TestimonialTicker from '@/components/home/TestimonialTicker';
import VideoTestimonials from '@/components/home/VideoTestimonials';
import ProgramTeasers from '@/components/home/ProgramTeasers';
import CallToAction from '@/components/home/CallToAction';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Best UPSC Coaching in Kerala | iLearn IAS Academy Trivandrum</title>
        <meta name="description" content="Kerala's #1 UPSC &amp; KAS coaching institute since 2015. 200+ top selections including AIR 12. Expert faculty, structured batches &amp; personal mentoring in Trivandrum. Enquire now!" />
        <meta name="keywords" content="UPSC coaching Kerala, best IAS coaching Trivandrum, IAS academy Kerala, KAS coaching Kerala, civil services coaching Trivandrum" />
        <link rel="canonical" href="https://www.ilearnias.com/" />
        <meta property="og:title" content="Best UPSC Coaching in Kerala | iLearn IAS Academy Trivandrum" />
        <meta property="og:description" content="Kerala's #1 UPSC &amp; KAS coaching institute since 2015. 200+ top selections including AIR 12. Expert faculty in Trivandrum." />
        <meta property="og:url" content="https://www.ilearnias.com/" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "EducationalOrganization",
                "@id": "https://www.ilearnias.com/#organization",
                "name": "iLearn IAS Academy",
                "alternateName": "iLearn IAS",
                "url": "https://www.ilearnias.com",
                "description": "Kerala's leading UPSC and KAS coaching institute in Thiruvananthapuram, founded in 2015 with 200+ top selections including AIR 12.",
                "foundingDate": "2015",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "1st Floor, Mullasery Towers, Vanross Junction, Punnen Rd",
                  "addressLocality": "Thiruvananthapuram",
                  "addressRegion": "Kerala",
                  "postalCode": "695001",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 8.5241,
                  "longitude": 76.9366
                },
                "sameAs": [
                  "https://www.instagram.com/ilearnias",
                  "https://t.me/iLearnIASacademy",
                  "https://www.linkedin.com/company/ilearn-ias-academy"
                ],
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.5",
                  "reviewCount": "300",
                  "bestRating": "5"
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://www.ilearnias.com/#website",
                "url": "https://www.ilearnias.com",
                "name": "iLearn IAS Academy",
                "publisher": { "@id": "https://www.ilearnias.com/#organization" }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is iLearn IAS Academy?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "iLearn IAS Academy is Kerala's leading UPSC and KAS coaching institute based in Thiruvananthapuram, founded in 2015. With 200+ top selections including AIR 12, we offer expert classroom coaching for civil services aspirants."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What courses does iLearn IAS Academy offer?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "iLearn IAS Academy offers the Prelims Cum Mains (PCM) Program, Current Affairs and News Analysis (CANA), and various optional subject programs for UPSC and KAS aspirants."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Where is iLearn IAS Academy located?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "iLearn IAS Academy is located at 1st Floor, Mullasery Towers, Vanross Junction, Punnen Road, Thiruvananthapuram, Kerala 695001."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What are the fees for UPSC coaching at iLearn IAS Academy?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "iLearn IAS Academy fees range from approximately Rs.79,000 to Rs.1,00,000 depending on the program. Contact us directly for the latest fee structure and batch details."
                    }
                  }
                ]
              }
            ]
          }
        `}</script>
      </Helmet>
      
      <PageTransition>
        <Hero />
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

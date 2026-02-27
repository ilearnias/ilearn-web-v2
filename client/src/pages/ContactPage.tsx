import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { COMPANY } from '@/lib/constants';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import ilearnBuildingImg from '@assets/iLearn image.webp';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact iLearn IAS Academy | UPSC Coaching Trivandrum Enquiry</title>
        <meta name="description" content="Contact iLearn IAS Academy, Thiruvananthapuram. Enquire about UPSC &amp; KAS coaching programs, batch schedules, fees &amp; admissions. Visit us at Mullasery Towers, Vanross Junction." />
        <link rel="canonical" href="https://www.ilearnias.com/contact" />
        <meta property="og:title" content="Contact iLearn IAS Academy | UPSC Coaching Enquiry Trivandrum" />
        <meta property="og:url" content="https://www.ilearnias.com/contact" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact iLearn IAS Academy",
            "url": "https://www.ilearnias.com/contact",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ilearnias.com/" },
                { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://www.ilearnias.com/contact" }
              ]
            },
            "mainEntity": {
              "@type": "EducationalOrganization",
              "name": "iLearn IAS Academy",
              "url": "https://www.ilearnias.com",
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
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "09:00",
                "closes": "18:00"
              }
            }
          }
        `}</script>
      </Helmet>
      
      <PageTransition>
        {/* Hero Section with Building Image - Material Design 3 style */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-blue-50 to-white opacity-60 -z-10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSIjMjA0NjhEIiAvPjwvc3ZnPg==')] opacity-10 -z-10"></div>
          
          {/* Material Design decorative elements */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary-red/10 -z-5"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-primary-blue/10 -z-5"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-primary-blue">Contact</span>
                <span className="text-primary-red"> Us</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-blue to-primary-red mx-auto mb-4"></div>
              <p className="text-neutral-700 max-w-2xl mx-auto text-lg">
                Get in touch with us for inquiries about our programs, admission process, or to schedule a counselling session.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-gray-100">
                {/* Card frame with Material Design 3 elevation */}
                <div className="absolute inset-0 bg-white -z-10"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-blue/10 via-transparent to-primary-red/10 -z-5"></div>
                
                <img 
                  src={ilearnBuildingImg} 
                  alt="iLearn IAS Building" 
                  className="w-full object-cover h-[300px] md:h-[450px]"
                />
                
                {/* No overlay text - clean MD3 approach */}
              </div>
            </div>
          </div>
        </section>
        
        {/* Map and Contact Info Section - Material Design 3 style */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                <span className="text-primary-blue">How to</span>
                <span className="text-primary-red"> Reach Us</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-blue to-primary-red mx-auto mb-4"></div>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Visit our campus for a personal consultation or reach out through any of our contact channels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Map section with Material Design 3 card */}
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl overflow-hidden border border-gray-100 h-[450px] relative">
                  {/* Card frame with Material Design 3 elevation */}
                  <div className="absolute inset-0 bg-white -z-10"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary-blue/5 to-primary-red/5 -z-5"></div>
                  
                  <iframe 
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=iLearn+IAS+Academy,Minchin+Road,Chakka,Thiruvananthapuram" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="iLearn IAS Academy Location"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="z-10"
                  ></iframe>
                  
                  {/* Floating action button - Material Design style */}
                  <a 
                    href={COMPANY.mapLink} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="absolute bottom-4 right-4 bg-primary-blue text-white border border-white rounded-full p-3 z-20 transition-all duration-300 hover:scale-105"
                    aria-label="Get directions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                    </svg>
                  </a>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <a 
                    href={COMPANY.mapLink} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-primary-blue hover:text-primary-red font-medium inline-flex items-center transition-colors"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Get directions on Google Maps
                  </a>
                  
                  <span className="bg-primary-blue-50 text-primary-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    Central Location
                  </span>
                </div>
              </div>
              
              {/* Contact Info Cards - Material Design 3 style */}
              <div className="order-1 lg:order-2">
                <div className="grid gap-5">
                  {/* Location card - Material Design 3 style */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-start gap-5 transition-colors hover:bg-gray-50">
                    <div className="w-14 h-14 bg-primary-red rounded-full flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-neutral-800">Our Location</h3>
                      <p className="text-neutral-600">{COMPANY.address}</p>
                      <div className="mt-3 text-sm text-neutral-500">
                        <p>Monday to Saturday: 9:00 AM - 8:00 PM</p>
                        <p>Sunday: Closed (Online support available)</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone card - Material Design 3 style */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-start gap-5 transition-colors hover:bg-gray-50">
                    <div className="w-14 h-14 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPhoneAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-neutral-800">Phone</h3>
                      <p className="text-neutral-600">{COMPANY.phone}</p>
                      <a 
                        href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`}
                        className="mt-3 inline-flex items-center gap-2 bg-primary-blue-50 text-primary-blue hover:bg-primary-blue hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        Call Now
                      </a>
                    </div>
                  </div>
                  
                  {/* WhatsApp card - Material Design 3 style */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-start gap-5 transition-colors hover:bg-gray-50">
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-neutral-800">WhatsApp</h3>
                      <p className="text-neutral-600">Chat with us for quick responses to your queries</p>
                      <div className="mt-3 flex gap-3">
                        <a 
                          href={`https://wa.me/${COMPANY.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                          <FaWhatsapp />
                          Chat Now
                        </a>
                        <a 
                          href={`https://wa.me/${COMPANY.whatsapp}?text=Hello%20iLearn%20IAS%2C%20I%20want%20to%20know%20more%20about%20your%20programs.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                          </svg>
                          Send Inquiry
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email card - Material Design 3 style */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-start gap-5 transition-colors hover:bg-gray-50">
                    <div className="w-14 h-14 bg-primary-red rounded-full flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-neutral-800">Email</h3>
                      <p className="text-neutral-600">{COMPANY.email}</p>
                      <a 
                        href={`mailto:${COMPANY.email}`}
                        className="mt-3 inline-flex items-center gap-2 bg-primary-red-50 text-primary-red hover:bg-primary-red hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        Send Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Social Media Section - Material Design 3 Compact Layout */}
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* YouTube - Compact MD3 Style */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaYoutube className="text-white text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">YouTube</h3>
                  <p className="text-neutral-600 text-sm mb-2 line-clamp-1">Video lessons & strategy sessions</p>
                  <a 
                    href={COMPANY.socialMedia.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-red-600 text-sm font-medium hover:underline"
                  >
                    <span>Subscribe Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Instagram - Compact MD3 Style */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaInstagram className="text-white text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">Instagram</h3>
                  <p className="text-neutral-600 text-sm mb-2 line-clamp-1">Daily updates & study tips</p>
                  <a 
                    href={COMPANY.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-pink-600 text-sm font-medium hover:underline"
                  >
                    <span>Follow Us</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Facebook - Compact MD3 Style */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaFacebook className="text-white text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">Facebook</h3>
                  <p className="text-neutral-600 text-sm mb-2 line-clamp-1">Community & announcements</p>
                  <a 
                    href={COMPANY.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
                  >
                    <span>Like Our Page</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Floating WhatsApp Button */}
        <FloatingWhatsApp 
          message="Hello! I'd like to know more about iLearn IAS programs and admission process." 
        />
      </PageTransition>
    </>
  );
}

export default ContactPage;
import { Link } from 'wouter';
import { COMPANY, NAV_LINKS } from '@/lib/constants';
import logoImage from '@/assets/uploaded/long-logo-white.png';

const Footer = () => {
  return (
    <footer className="bg-primary-blue text-white py-8">
      <div className="container mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex flex-col items-start mb-3">
              <div className="bg-transparent mb-2 flex items-center">
                <img src={logoImage} alt="iLearn IAS Logo" className="h-12" />
              </div>
              <div className="text-lg font-bold">{COMPANY.name}</div>
            </div>
            <p className="opacity-80 mb-3 text-sm">{COMPANY.tagline} —delivering the state's highest success rate through results-driven Prelims-cum-Mains & classroom programs.</p>
            <div className="flex space-x-4">
              <a 
                href={COMPANY.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="text-white hover:text-primary-red transition-colors"
              >
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a 
                href={COMPANY.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="text-white hover:text-primary-red transition-colors"
              >
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a 
                href={COMPANY.socialMedia.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube" 
                className="text-white hover:text-primary-red transition-colors"
              >
                <i className="ri-youtube-fill text-xl"></i>
              </a>
              {/* Twitter link removed */}
            </div>
          </div>
          
          <div>
            <div className="text-lg font-bold mb-3">Quick Links</div>
            <ul className="space-y-1.5 text-sm">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link 
                    href={link.path} 
                    className="opacity-80 hover:opacity-100 hover:text-primary-red transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="text-lg font-bold mb-3">Our Programs</div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link 
                  href="/programs/prelims-cum-mains" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Prelims-cum-Mains Program <span className="text-white font-medium">(PCM)</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/integrated-prelims-test-series" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Integrated Prelims Test Series <span className="text-white font-medium">(iPTS)</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/mains-test-series" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Mains Test Series & Answer Writing <span className="text-white font-medium">(MTS/MAP)</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/interview-guidance-program" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Interview Guidance Program <span className="text-white font-medium">(iGP)</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/current-affairs-news-analysis" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Current Affairs & News Analysis <span className="text-white font-medium">(CANA)</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="text-lg font-bold mb-3">Contact Info</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <i className="ri-map-pin-line text-primary-red mt-0.5"></i>
                <span className="opacity-80">{COMPANY.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-phone-line text-primary-red"></i>
                <a 
                  href={`tel:${COMPANY.phone}`} 
                  className="opacity-80 hover:opacity-100 transition-colors"
                >
                  {COMPANY.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-mail-line text-primary-red"></i>
                <a 
                  href={`mailto:${COMPANY.email}`} 
                  className="opacity-80 hover:opacity-100 transition-colors"
                >
                  {COMPANY.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-time-line text-primary-red"></i>
                <span className="opacity-80">{COMPANY.hours}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm opacity-80">
              © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="opacity-80 hover:opacity-100 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="opacity-80 hover:opacity-100 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="opacity-80 hover:opacity-100 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'wouter';
import { COMPANY, NAV_LINKS } from '@/lib/constants';

const Footer = () => {
  return (
    <footer className="bg-primary-blue text-white py-8">
      <div className="container mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex flex-col items-start mb-3">
              <div className="bg-transparent mb-2 flex items-center">
                <img src="/src/assets/uploaded/long-logo-white.png" alt="iLearn IAS Logo" className="h-12" />
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
                  href="/programs/current-affairs" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Current Affairs & News Analysis <span className="text-white font-medium">(CANA)</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/restart-program" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Restart Program
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/geography-optional" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Geography Optional
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/political-science-ir-optional" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Political Science & IR Optional
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/sociology-optional" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Sociology Optional
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/malayalam-optional" 
                  className="opacity-80 hover:opacity-100 hover:text-white transition-colors block"
                >
                  Malayalam Optional
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="text-lg font-bold mb-3">Contact Us</div>
            <address className="not-italic text-sm">
              <p className="flex items-start mb-1.5">
                <i className="ri-map-pin-line mr-1.5 mt-0.5"></i>
                <span className="opacity-80">{COMPANY.address}</span>
              </p>
              <p className="flex items-center mb-1.5">
                <i className="ri-phone-line mr-1.5"></i>
                <span className="opacity-80">{COMPANY.phone}</span>
              </p>
              <p className="flex items-center mb-1.5">
                <i className="ri-mail-line mr-1.5"></i>
                <span className="opacity-80">{COMPANY.email}</span>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-6 pt-4 text-center">
          <p className="opacity-70 text-xs">&copy; {new Date().getFullYear()} iLearn IAS Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/lib/constants';
import { FaWhatsapp } from 'react-icons/fa';

interface FloatingWhatsAppProps {
  message?: string;
  className?: string;
}

export const FloatingWhatsApp = ({ 
  message = "Hello! I'd like to know more about iLearn IAS programs.", 
  className = ""
}: FloatingWhatsAppProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Encode the message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?text=${encodedMessage}`;

  useEffect(() => {
    // Show button after scrolling down a bit
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Set visible by default on short pages or delayed appearance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 rounded-full p-4 shadow-lg flex items-center justify-center text-white"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-white text-2xl" />
        <span className="ml-2 sm:inline hidden">Chat with us</span>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
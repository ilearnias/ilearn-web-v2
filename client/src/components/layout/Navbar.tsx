import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/uploaded/new-logo.png';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollLink } from '@/components/ui/scroll-link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as Element).closest('#mobile-menu, #mobile-menu-btn')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Animation variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
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

  const mobileMenuVariants = {
    closed: { 
      x: '100%',
      opacity: 0.8,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: { 
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { 
      y: 20, 
      opacity: 0 
    },
    open: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    }
  };

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "py-2 bg-white shadow-[0_2px_20px_0_rgba(0,0,0,0.03)]" 
          : "py-3 bg-white"
      )}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <motion.div 
          whileHover="hover"
          initial="normal"
          animate="normal"
          variants={logoVariants}
          className="relative z-10"
        >
          <ScrollLink href="/" className="flex items-center gap-2">
            <img src={logoImage} alt="iLearn IAS Logo" className="h-12 md:h-14" />
          </ScrollLink>
          
          {/* Logo highlight effect */}
          <motion.div 
            className="absolute -inset-2 rounded-full bg-primary-blue/5 -z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        
        {/* Desktop Navigation - Material Design style */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <motion.div 
              key={link.path}
              className="relative px-1"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <ScrollLink 
                href={link.path}
                className={cn(
                  "px-4 py-2 font-medium text-[15px] rounded-full transition-colors relative block",
                  location === link.path 
                    ? "text-primary-blue" 
                    : "text-neutral-700 hover:text-primary-blue hover:bg-primary-blue/5"
                )}
              >
                {location === link.path && (
                  <motion.span 
                    className="absolute inset-0 bg-primary-blue/10 rounded-full -z-10"
                    layoutId="navbar-active-item"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {link.name}
              </ScrollLink>
            </motion.div>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="hidden md:block"
          >
            <ScrollLink href="/contact">
              <Button 
                className="bg-primary-red hover:bg-[#ef5350] text-white shadow-sm hover:shadow-md transition-all px-6 py-2 h-auto rounded-full text-[15px]"
              >
                <span className="mr-1">Join</span> Now
              </Button>
            </ScrollLink>
          </motion.div>
          
          {/* Mobile menu button with Material Design style */}
          <motion.button 
            id="mobile-menu-btn" 
            className="md:hidden flex items-center justify-center w-10 h-10 text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - Material Design style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id="mobile-menu" 
            className="fixed inset-0 bg-white z-50 md:hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Modern header design */}
            <div className="px-5 py-4 flex justify-between items-center border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="iLearn IAS Logo" className="h-12" />
                <div className="h-8 w-px bg-neutral-200"></div>
                <span className="text-lg font-medium text-primary-blue">Menu</span>
              </div>
              
              <motion.button 
                className="flex items-center justify-center w-10 h-10 text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close Menu"
                whileTap={{ scale: 0.92 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </motion.button>
            </div>
            
            {/* Modern nav links with active indicators */}
            <nav className="p-5 flex flex-col gap-1">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.path}
                  variants={menuItemVariants}
                  custom={index}
                  whileTap={{ scale: 0.98 }}
                >
                  <ScrollLink 
                    href={link.path}
                    onClick={(e) => {
                      // If we're already on this page, prevent navigation but close the menu
                      if (location === link.path) {
                        e.preventDefault();
                        setIsOpen(false);
                      }
                    }}
                    className={cn(
                      "font-medium text-base block py-3 px-4 rounded-lg relative",
                      location === link.path 
                        ? "text-primary-blue bg-primary-blue/5" 
                        : "text-neutral-700 hover:text-primary-blue hover:bg-neutral-50"
                    )}
                  >
                    {location === link.path && (
                      <motion.span 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary-blue rounded-r-full my-2"
                        layoutId="mobile-nav-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    {link.name}
                  </ScrollLink>
                </motion.div>
              ))}
            </nav>
            
            {/* Action buttons */}
            <div className="px-5 mt-4 space-y-3">
              <motion.div
                variants={menuItemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <ScrollLink 
                  href="/contact" 
                  className="bg-primary-red hover:bg-[#ef5350] text-white py-3.5 px-4 rounded-xl text-center font-medium block shadow-sm hover:shadow-md transition-all"
                >
                  Join Now
                </ScrollLink>
              </motion.div>
              <motion.div
                variants={menuItemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <ScrollLink 
                  href="/app" 
                  className="bg-primary-blue/10 hover:bg-primary-blue/15 text-primary-blue py-3.5 px-4 rounded-xl text-center font-medium mt-2 block transition-all border border-primary-blue/20"
                >
                  Download App
                </ScrollLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

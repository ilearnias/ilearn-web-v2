import { Link as WouterLink, useLocation } from 'wouter';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { ReactNode, MouseEvent } from 'react';

interface ScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  [key: string]: any; // Allow any other props
}

/**
 * Enhanced Link component that scrolls to top on navigation
 * Use this instead of regular wouter Link when page should scroll to top
 */
export function ScrollLink({ 
  href, 
  children, 
  className = '', 
  onClick,
  ...props 
}: ScrollLinkProps) {
  const scrollToTop = useScrollTop();
  const [_, navigate] = useLocation();
  
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    // Run the original onClick if provided
    if (onClick) {
      onClick(event);
    }
    
    // Navigate programmatically
    navigate(href);
    
    // Scroll to top after a small delay to ensure navigation happens first
    setTimeout(() => {
      scrollToTop();
    }, 50);
  };
  
  return (
    <span 
      className={`inline-block ${className}`} 
      onClick={handleClick}
      role="link"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {children}
    </span>
  );
}
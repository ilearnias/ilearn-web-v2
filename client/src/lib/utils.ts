import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function getYearRange(startYear: number): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function calculateScrollPercent(): number {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return (scrollTop / scrollHeight) * 100;
}

// SEO Helper
export function generateSeoMeta(
  title: string = 'iLearn IAS Academy | Best Civil Service Coaching in Trivandrum',
  description: string = 'Top civil service coaching institute in Trivandrum with best results in Kerala. Join our specialized programs for UPSC, KAS, and other competitive exams.',
  image: string = 'https://source.unsplash.com/random/1200x630/?students,education',
  url: string = 'https://www.ilearnias.com/'
) {
  return {
    title,
    description,
    image,
    url,
  };
}

/**
 * Extracts the video ID from a YouTube URL
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Regular YouTube watch URL (https://www.youtube.com/watch?v=VIDEO_ID)
  if (url.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch (e) {
      return null;
    }
  }
  
  // Short YouTube URL (https://youtu.be/VIDEO_ID)
  if (url.includes('youtu.be/')) {
    try {
      const parts = url.split('youtu.be/');
      if (parts.length < 2) return null;
      
      // Remove any query parameters
      return parts[1].split('?')[0].split('#')[0];
    } catch (e) {
      return null;
    }
  }
  
  // YouTube Shorts (https://www.youtube.com/shorts/VIDEO_ID)
  if (url.includes('youtube.com/shorts/')) {
    try {
      const parts = url.split('youtube.com/shorts/');
      if (parts.length < 2) return null;
      
      // Remove any query parameters
      return parts[1].split('?')[0].split('#')[0];
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

/**
 * Converts a YouTube URL to its embed version
 * This is useful for embedding the video in an iframe
 * @param url The YouTube URL to convert
 * @param isPortrait Optional parameter to force portrait mode 
 */
export function getYoutubeEmbedUrl(url: string, isPortrait?: boolean): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  // Check if this is a Shorts video (either from URL or explicitly passed as portrait)
  const isShorts = url.includes('youtube.com/shorts/') || isPortrait;
  
  if (isShorts) {
    // For YouTube Shorts (vertical videos), use parameters that work better in portrait mode
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&enablejsapi=1&fs=1&playsinline=0&loop=1&vq=hd1080`;
  }
  
  // For regular landscape YouTube videos
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&enablejsapi=1&fs=1&playsinline=0&vq=hd1080`;
}

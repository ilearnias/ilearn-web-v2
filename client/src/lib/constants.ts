// Color Constants
export const COLORS = {
  primaryRed: "#E21A24",
  primaryBlue: "#20468D",
  lightGrey: "#F4F5F7",
  darkGrey: "#333333",
  white: "#FFFFFF",
};

// Common Data
export const COMPANY = {
  name: "iLearn IAS Academy",
  shortName: "iLearn IAS",
  phone: "8089166792",
  email: "ilearnoffc@gmail.com",
  whatsapp: "918089166792",
  address:
    "First Floor, Corporate Building, Above Kerala Bank, Vanross Junction, Palayam Thiruvananthapuram, Kerala 695001",
  hours: "Mon-Sat: 9AM to 7PM",
  tagline: "Kerala's most successful Civil Services Training Academy",
  mapLink: "https://maps.app.goo.gl/1jgeErnbRM9zeZg19",
  socialMedia: {
    facebook: "https://www.facebook.com/iLearnIAS/",
    instagram: "https://www.instagram.com/ilearnias/",
    youtube: "https://www.youtube.com/@iLearnIAS",
  },
};

// NavLinks
export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Results", path: "/results" },
  { name: "Programs", path: "/programs" },
  { name: "Blog", path: "/blog" },
  { name: "iLearn App", path: "/app" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact Us", path: "/contact" },
];

// Store Types
export type Testimonial = {
  id: number;
  name: string;
  description: string;
  details: string;
  image?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  // Keep backward compatibility with existing fields
  rank?: string;
  program?: string;
  quote?: string;
  year?: number;
  video?: string;
  type?: "text" | "portrait-video" | "landscape-video";
  displayOrder?: number;
};

export type Topper = {
  id: number;
  name: string;
  rank: number;
  program: string;
  year: number;
  image: string;
  testimonial?: string;
  scorecard?: string;
  details?: string; // AIR or rank string
  description?: string; // e.g. 'UPSC CSE 2024'
};

export type Program = {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  usp: string[];
  video?: string;
  testimonials: number[];
  fees: string;
  faq: { question: string; answer: string }[];
};

export type MediaItem = {
  id: number;
  title: string;
  description?: string;
  type: "image" | "video";
  aspectRatio: "landscape" | "portrait" | "square";
  mediaUrl: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  displayOrder?: number;
  createdAt?: string;
  // Added to associate media with gallery events
  eventId?: number;
  // Legacy/compatibility fields
  url?: string;
  year?: number;
  event?: string;
  category?: string;
};

// Pure TypeScript types — no drizzle-orm dependency
// These types match the ilearn-server database schema

// Site Settings
export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  updatedAt: Date;
}

export type InsertSiteSetting = Omit<SiteSetting, 'id' | 'updatedAt'>;

// Users
export interface User {
  id: number;
  username: string;
  password: string;
}

export type InsertUser = Pick<User, 'username' | 'password'>;

// Testimonials
export interface Testimonial {
  id: number;
  name: string;
  rank: string;
  program: string;
  quote: string;
  year: number;
  image: string | null;
  video: string | null;
  type: string;
  displayOrder: number | null;
  createdAt: Date;
}

export type InsertTestimonial = Omit<Testimonial, 'id' | 'createdAt'>;

// Toppers/Results
export interface Topper {
  id: number;
  name: string;
  rank: number;
  program: string;
  year: number;
  image: string;
  testimonial: string | null;
  scorecard: string | null;
  displayOrder: number | null;
  createdAt: Date;
}

export type InsertTopper = Omit<Topper, 'id' | 'createdAt'>;

// Programs
export interface Program {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  usp: string[];
  video: string | null;
  videoTestimonials: number[] | null;
  studentTestimonials: number[] | null;
  resultYears: ResultYear[];
  fees: string;
  faq: any;
  displayOrder: number | null;
  createdAt: Date;
}

export type InsertProgram = Omit<Program, 'id' | 'createdAt'>;

// Gallery Events
export interface GalleryEvent {
  id: number;
  title: string;
  description: string | null;
  mediaIds: number[] | null;
  displayOrder: number | null;
  createdAt: Date;
}

export type InsertGalleryEvent = Omit<GalleryEvent, 'id' | 'createdAt'>;

// Media
export interface Media {
  id: number;
  title: string;
  description: string | null;
  type: string;
  aspectRatio: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  embedUrl: string | null;
  displayOrder: number | null;
  createdAt: Date;
}

export type InsertMedia = Omit<Media, 'id' | 'createdAt'>;

export const mediaTypeEnum = ["image", "video"] as const;
export const aspectRatioEnum = ["landscape", "portrait", "square"] as const;

// Contact Form Submissions
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export type InsertContact = Omit<Contact, 'id' | 'createdAt' | 'isRead'>;

// App Features
export interface AppFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  createdAt: Date;
}

export type InsertAppFeature = Omit<AppFeature, 'id' | 'createdAt'>;

// App Ratings
export interface AppRating {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: Date;
}

export type InsertAppRating = Omit<AppRating, 'id' | 'createdAt'>;

// Blog Categories
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

export type InsertBlogCategory = Omit<BlogCategory, 'id' | 'createdAt'>;

// Blog Posts
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  categoryIds: number[] | null;
  tags: string[] | null;
  authorId: number;
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertBlogPost = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

// About Page Images
export interface AboutPageImage {
  id: number;
  section: string;
  imageUrl: string;
  alt: string | null;
  displayOrder: number | null;
  createdAt: Date;
}

export type InsertAboutPageImage = Omit<AboutPageImage, 'id' | 'createdAt'>;

// Custom type for program result years
export interface ResultYear {
  year: string;
  imageUrl: string;
  displayOrder: number;
}

// Milestones
export interface Milestone {
  id: number;
  year: string;
  title: string;
  description: string;
  displayOrder: number | null;
  isDefault: boolean;
  createdAt: Date;
}

export type InsertMilestone = Omit<Milestone, 'id' | 'createdAt'>;

// Milestone Images
export interface MilestoneImage {
  id: number;
  milestoneId: number;
  imageUrl: string;
  alt: string | null;
  displayOrder: number | null;
  createdAt: Date;
}

export type InsertMilestoneImage = Omit<MilestoneImage, 'id' | 'createdAt'>;

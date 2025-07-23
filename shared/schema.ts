import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Site Settings
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rank: text("rank").notNull(),
  program: text("program").notNull(),
  quote: text("quote").notNull(),
  year: integer("year").notNull(),
  image: text("image"),
  video: text("video"),
  type: text("type").notNull(),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

// Toppers/Results
export const toppers = pgTable("toppers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rank: integer("rank").notNull(),
  program: text("program").notNull(),
  year: integer("year").notNull(),
  image: text("image").notNull(),
  testimonial: text("testimonial"),
  scorecard: text("scorecard"),
  displayOrder: integer("display_order").default(999),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTopperSchema = createInsertSchema(toppers).omit({
  id: true,
  createdAt: true,
});

// Programs
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  duration: text("duration").notNull(),
  usp: text("usp").array().notNull(),
  video: text("video"),
  videoTestimonials: integer("video_testimonials").array(), // Video testimonials like on homepage
  studentTestimonials: integer("student_testimonials").array(), // Image testimonials like success stories
  resultYears: jsonb("result_years").default('[]').notNull(), // Store years and images for result showcase
  fees: text("fees").notNull(),
  faq: jsonb("faq").notNull(),
  displayOrder: integer("display_order").default(999),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
});

// Gallery Events
export const galleryEvents = pgTable("gallery_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  mediaIds: integer("media_ids").array(), // Array of media item IDs
  displayOrder: integer("display_order").default(999), // For ordering events in the gallery
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGalleryEventSchema = createInsertSchema(galleryEvents).omit({
  id: true,
  createdAt: true,
});

// Media
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default("image"), // 'image' or 'video'
  aspectRatio: text("aspect_ratio").notNull().default("landscape"), // 'landscape', 'portrait', or 'square'
  mediaUrl: text("media_url").notNull(), // URL for YouTube video or direct image URL
  thumbnailUrl: text("thumbnail_url"), // Auto-generated from mediaUrl for videos, same as mediaUrl for images
  embedUrl: text("embed_url"), // For embedding videos in iframes (YouTube embed URL)
  displayOrder: integer("display_order").default(999), // For custom ordering in carousels
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export const mediaTypeEnum = ["image", "video"] as const;
export const aspectRatioEnum = ["landscape", "portrait", "square"] as const;

// Contact Form Submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// App Features
export const appFeatures = pgTable("app_features", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppFeatureSchema = createInsertSchema(appFeatures).omit({
  id: true,
  createdAt: true,
});

// App Ratings
export const appRatings = pgTable("app_ratings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppRatingSchema = createInsertSchema(appRatings).omit({
  id: true,
  createdAt: true,
});

// Blog Posts
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).omit({
  id: true,
  createdAt: true,
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  featuredImageAlt: text("featured_image_alt"),
  categoryIds: integer("category_ids").array(),
  tags: text("tags").array(),
  authorId: integer("author_id").notNull(),
  status: text("status").notNull().default("draft"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Topper = typeof toppers.$inferSelect;
export type InsertTopper = z.infer<typeof insertTopperSchema>;

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type AppFeature = typeof appFeatures.$inferSelect;
export type InsertAppFeature = z.infer<typeof insertAppFeatureSchema>;

export type AppRating = typeof appRatings.$inferSelect;
export type InsertAppRating = z.infer<typeof insertAppRatingSchema>;

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type GalleryEvent = typeof galleryEvents.$inferSelect;
export type InsertGalleryEvent = z.infer<typeof insertGalleryEventSchema>;

// About Page Images
export const aboutPageImages = pgTable("about_page_images", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // 'intro', 'journey', etc.
  imageUrl: text("image_url").notNull(),
  alt: text("alt"),
  displayOrder: integer("display_order").default(999),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAboutPageImageSchema = createInsertSchema(aboutPageImages).omit({
  id: true,
  createdAt: true,
});

export type AboutPageImage = typeof aboutPageImages.$inferSelect;
export type InsertAboutPageImage = z.infer<typeof insertAboutPageImageSchema>;

// Custom type for program result years
export type ResultYear = {
  year: string;
  imageUrl: string;
  displayOrder: number;
};

// Milestones
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  displayOrder: integer("display_order").default(999),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

// Milestone Images
export const milestoneImages = pgTable("milestone_images", {
  id: serial("id").primaryKey(),
  milestoneId: integer("milestone_id").notNull(),
  imageUrl: text("image_url").notNull(),
  alt: text("alt"),
  displayOrder: integer("display_order").default(999),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMilestoneImageSchema = createInsertSchema(milestoneImages).omit({
  id: true,
  createdAt: true,
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

export type MilestoneImage = typeof milestoneImages.$inferSelect;
export type InsertMilestoneImage = z.infer<typeof insertMilestoneImageSchema>;

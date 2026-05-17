import { 
  users, User, InsertUser,
  testimonials, Testimonial, InsertTestimonial,
  toppers, Topper, InsertTopper,
  programs, Program, InsertProgram,
  media, Media, InsertMedia,
  contacts, Contact, InsertContact,
  appFeatures, AppFeature, InsertAppFeature,
  appRatings, AppRating, InsertAppRating,
  siteSettings, SiteSetting, InsertSiteSetting,
  blogCategories, BlogCategory, InsertBlogCategory,
  blogPosts, BlogPost, InsertBlogPost,
  galleryEvents, GalleryEvent, InsertGalleryEvent,
  aboutPageImages, AboutPageImage, InsertAboutPageImage,
  milestones, Milestone, InsertMilestone,
  milestoneImages, MilestoneImage, InsertMilestoneImage
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // About Page Images
  getAboutPageImages(section?: string): Promise<AboutPageImage[]>;
  getAboutPageImageById(id: number): Promise<AboutPageImage | undefined>;
  createAboutPageImage(image: InsertAboutPageImage): Promise<AboutPageImage>;
  updateAboutPageImage(id: number, image: Partial<InsertAboutPageImage>): Promise<AboutPageImage | undefined>;
  deleteAboutPageImage(id: number): Promise<boolean>;
  updateAboutPageImageOrder(ids: number[]): Promise<boolean>;
  
  // Gallery Events
  getGalleryEvents(): Promise<GalleryEvent[]>;
  getGalleryEventById(id: number): Promise<GalleryEvent | undefined>;
  createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent>;
  updateGalleryEvent(id: number, event: Partial<InsertGalleryEvent>): Promise<GalleryEvent | undefined>;
  deleteGalleryEvent(id: number): Promise<boolean>;
  updateGalleryEventOrder(ids: number[]): Promise<boolean>;
  
  // Site Settings
  getSetting(key: string): Promise<SiteSetting | undefined>;
  getAllSettings(): Promise<SiteSetting[]>;
  updateSetting(key: string, value: string): Promise<SiteSetting>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonialsByType(type: string): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Toppers/Results
  getToppers(): Promise<Topper[]>;
  getTopperById(id: number): Promise<Topper | undefined>;
  getToppersByYear(year: number): Promise<Topper[]>;
  getToppersByProgram(program: string): Promise<Topper[]>;
  createTopper(topper: InsertTopper): Promise<Topper>;
  updateTopper(id: number, topper: Partial<InsertTopper>): Promise<Topper | undefined>;
  deleteTopper(id: number): Promise<boolean>;

  // Programs
  getPrograms(): Promise<Program[]>;
  getProgramBySlug(slug: string): Promise<Program | undefined>;
  getProgramById(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<boolean>;

  // Media
  getMediaItems(): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<boolean>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: number): Promise<boolean>;
  deleteContact(id: number): Promise<boolean>;

  // App Features
  getAppFeatures(): Promise<AppFeature[]>;
  getAppFeatureById(id: number): Promise<AppFeature | undefined>;
  createAppFeature(feature: InsertAppFeature): Promise<AppFeature>;
  updateAppFeature(id: number, feature: Partial<InsertAppFeature>): Promise<AppFeature | undefined>;
  deleteAppFeature(id: number): Promise<boolean>;

  // App Ratings
  getAppRatings(): Promise<AppRating[]>;
  getAppRatingById(id: number): Promise<AppRating | undefined>;
  createAppRating(rating: InsertAppRating): Promise<AppRating>;
  updateAppRating(id: number, rating: Partial<InsertAppRating>): Promise<AppRating | undefined>;
  deleteAppRating(id: number): Promise<boolean>;
  
  // Blog Categories
  getBlogCategories(): Promise<BlogCategory[]>;
  getBlogCategoryById(id: number): Promise<BlogCategory | undefined>;
  getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  updateBlogCategory(id: number, category: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined>;
  deleteBlogCategory(id: number): Promise<boolean>;
  
  // Blog Posts
  getBlogPosts(options?: { 
    limit?: number; 
    offset?: number; 
    categoryId?: number;
    categorySlug?: string;
    tag?: string;
    status?: string;
  }): Promise<{posts: BlogPost[], total: number}>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Gallery Events
  getGalleryEvents(): Promise<GalleryEvent[]>;
  getGalleryEventById(id: number): Promise<GalleryEvent | undefined>;
  createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent>;
  updateGalleryEvent(id: number, event: Partial<InsertGalleryEvent>): Promise<GalleryEvent | undefined>;
  updateGalleryEventOrder(ids: number[]): Promise<boolean>;
  deleteGalleryEvent(id: number): Promise<boolean>;
  
  // Milestones
  getMilestones(): Promise<Milestone[]>;
  getMilestoneById(id: number): Promise<Milestone | undefined>;
  getDefaultMilestone(): Promise<Milestone | undefined>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: number): Promise<boolean>;
  updateMilestoneOrder(ids: number[]): Promise<boolean>;
  setDefaultMilestone(id: number): Promise<boolean>;
  
  // Milestone Images
  getMilestoneImages(milestoneId: number): Promise<MilestoneImage[]>;
  getMilestoneImageById(id: number): Promise<MilestoneImage | undefined>;
  createMilestoneImage(image: InsertMilestoneImage): Promise<MilestoneImage>;
  updateMilestoneImage(id: number, image: Partial<InsertMilestoneImage>): Promise<MilestoneImage | undefined>;
  deleteMilestoneImage(id: number): Promise<boolean>;
  updateMilestoneImageOrder(ids: number[]): Promise<boolean>;
}

// Database storage implementation using Drizzle ORM
import { db } from "./db";
import { eq, and, like, desc, asc, count, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Milestones methods
  async getMilestones(): Promise<Milestone[]> {
    return await db.select().from(milestones).orderBy(asc(milestones.displayOrder));
  }

  async getMilestoneById(id: number): Promise<Milestone | undefined> {
    const [milestone] = await db.select().from(milestones).where(eq(milestones.id, id));
    return milestone;
  }

  async getDefaultMilestone(): Promise<Milestone | undefined> {
    const [defaultMilestone] = await db.select().from(milestones)
      .where(eq(milestones.isDefault, true))
      .limit(1);
    
    if (defaultMilestone) {
      return defaultMilestone;
    }
    
    // If no default is set, return the first milestone by display order
    const [firstMilestone] = await db.select().from(milestones)
      .orderBy(asc(milestones.displayOrder))
      .limit(1);
      
    return firstMilestone;
  }

  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    // If this milestone is marked as default, clear other defaults
    if (milestone.isDefault) {
      await db.update(milestones).set({ isDefault: false });
    }
    
    const [newMilestone] = await db.insert(milestones).values(milestone).returning();
    return newMilestone;
  }

  async updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    // If this milestone is being set as default, clear other defaults
    if (milestone.isDefault) {
      await db.update(milestones).set({ isDefault: false });
    }
    
    const [updatedMilestone] = await db
      .update(milestones)
      .set(milestone)
      .where(eq(milestones.id, id))
      .returning();
      
    return updatedMilestone;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    try {
      // First check if the milestone exists
      const [milestone] = await db.select().from(milestones).where(eq(milestones.id, id));
      
      if (!milestone) {
        return false;
      }
      
      // Then delete all associated images
      await db.delete(milestoneImages).where(eq(milestoneImages.milestoneId, id));
      
      // Then delete the milestone
      const result = await db.delete(milestones).where(eq(milestones.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error in deleteMilestone:', error);
      return false;
    }
  }

  async updateMilestoneOrder(ids: number[]): Promise<boolean> {
    try {
      await Promise.all(ids.map(async (id, index) => {
        await db
          .update(milestones)
          .set({ displayOrder: index })
          .where(eq(milestones.id, id));
      }));
      return true;
    } catch (error) {
      console.error('Error updating milestone order:', error);
      return false;
    }
  }

  async setDefaultMilestone(id: number): Promise<boolean> {
    try {
      // First clear all defaults
      await db.update(milestones).set({ isDefault: false });
      
      // Then set the new default
      const [milestone] = await db
        .update(milestones)
        .set({ isDefault: true })
        .where(eq(milestones.id, id))
        .returning();
        
      return !!milestone;
    } catch (error) {
      console.error('Error setting default milestone:', error);
      return false;
    }
  }

  // Milestone Images methods
  async getMilestoneImages(milestoneId: number): Promise<MilestoneImage[]> {
    return await db.select()
      .from(milestoneImages)
      .where(eq(milestoneImages.milestoneId, milestoneId))
      .orderBy(asc(milestoneImages.displayOrder));
  }

  async getMilestoneImageById(id: number): Promise<MilestoneImage | undefined> {
    const [image] = await db.select().from(milestoneImages).where(eq(milestoneImages.id, id));
    return image;
  }

  async createMilestoneImage(image: InsertMilestoneImage): Promise<MilestoneImage> {
    const [newImage] = await db.insert(milestoneImages).values(image).returning();
    return newImage;
  }

  async updateMilestoneImage(id: number, image: Partial<InsertMilestoneImage>): Promise<MilestoneImage | undefined> {
    const [updatedImage] = await db
      .update(milestoneImages)
      .set(image)
      .where(eq(milestoneImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteMilestoneImage(id: number): Promise<boolean> {
    try {
      // First check if the image exists
      const [image] = await db.select().from(milestoneImages).where(eq(milestoneImages.id, id));
      
      if (!image) {
        return false;
      }
      
      // Then delete it
      const result = await db.delete(milestoneImages).where(eq(milestoneImages.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error in deleteMilestoneImage:', error);
      return false;
    }
  }

  async updateMilestoneImageOrder(ids: number[]): Promise<boolean> {
    try {
      await Promise.all(ids.map(async (id, index) => {
        await db
          .update(milestoneImages)
          .set({ displayOrder: index })
          .where(eq(milestoneImages.id, id));
      }));
      return true;
    } catch (error) {
      console.error('Error updating milestone image order:', error);
      return false;
    }
  }
  // About Page Images methods
  async getAboutPageImages(section?: string): Promise<AboutPageImage[]> {
    if (section) {
      return await db.select().from(aboutPageImages)
        .where(eq(aboutPageImages.section, section))
        .orderBy(asc(aboutPageImages.displayOrder));
    }
    return await db.select().from(aboutPageImages).orderBy(asc(aboutPageImages.displayOrder));
  }

  async getAboutPageImageById(id: number): Promise<AboutPageImage | undefined> {
    const [image] = await db.select().from(aboutPageImages).where(eq(aboutPageImages.id, id));
    return image;
  }

  async createAboutPageImage(image: InsertAboutPageImage): Promise<AboutPageImage> {
    const [newImage] = await db.insert(aboutPageImages).values(image).returning();
    return newImage;
  }

  async updateAboutPageImage(id: number, image: Partial<InsertAboutPageImage>): Promise<AboutPageImage | undefined> {
    const [updatedImage] = await db
      .update(aboutPageImages)
      .set(image)
      .where(eq(aboutPageImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteAboutPageImage(id: number): Promise<boolean> {
    try {
      // First check if the image exists
      const [image] = await db.select().from(aboutPageImages).where(eq(aboutPageImages.id, id));
      
      if (!image) {
        return false;
      }
      
      // Then delete it
      const result = await db.delete(aboutPageImages).where(eq(aboutPageImages.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error in deleteAboutPageImage:', error);
      return false;
    }
  }

  async updateAboutPageImageOrder(ids: number[]): Promise<boolean> {
    // Update display order based on the order of ids
    try {
      await Promise.all(ids.map(async (id, index) => {
        await db
          .update(aboutPageImages)
          .set({ displayOrder: index })
          .where(eq(aboutPageImages.id, id));
      }));
      return true;
    } catch (error) {
      console.error('Error updating about page image order:', error);
      return false;
    }
  }
  
  // Gallery Events methods
  async getGalleryEvents(): Promise<GalleryEvent[]> {
    return await db.select().from(galleryEvents).orderBy(asc(galleryEvents.displayOrder));
  }

  async getGalleryEventById(id: number): Promise<GalleryEvent | undefined> {
    const [event] = await db.select().from(galleryEvents).where(eq(galleryEvents.id, id));
    return event;
  }

  async createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent> {
    const [newEvent] = await db.insert(galleryEvents).values(event).returning();
    return newEvent;
  }

  async updateGalleryEvent(id: number, event: Partial<InsertGalleryEvent>): Promise<GalleryEvent | undefined> {
    const [updatedEvent] = await db
      .update(galleryEvents)
      .set(event)
      .where(eq(galleryEvents.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteGalleryEvent(id: number): Promise<boolean> {
    console.log('In DatabaseStorage.deleteGalleryEvent with id:', id);
    try {
      // First check if the gallery event exists
      const [event] = await db.select().from(galleryEvents).where(eq(galleryEvents.id, id));
      console.log('Found event to delete?', !!event);
      
      if (!event) {
        return false;
      }
      
      // Then delete it
      const result = await db.delete(galleryEvents).where(eq(galleryEvents.id, id));
      console.log('Delete result:', result);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error in deleteGalleryEvent:', error);
      return false;
    }
  }

  async updateGalleryEventOrder(ids: number[]): Promise<boolean> {
    // Update display order based on the order of ids
    try {
      await Promise.all(ids.map(async (id, index) => {
        await db
          .update(galleryEvents)
          .set({ displayOrder: index })
          .where(eq(galleryEvents.id, id));
      }));
      return true;
    } catch (error) {
      console.error('Error updating gallery event order:', error);
      return false;
    }
  }

  // Site Settings methods
  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }
  
  async getAllSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }
  
  async updateSetting(key: string, value: string): Promise<SiteSetting> {
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      const [updatedSetting] = await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning();
      return updatedSetting;
    } else {
      // Create new setting if it doesn't exist
      const [newSetting] = await db
        .insert(siteSettings)
        .values({ key, value, updatedAt: new Date() })
        .returning();
      return newSetting;
    }
  }

  // Users methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Testimonials methods
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }
  
  async getTestimonialsByType(type: string): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.type, type));
  }
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }
  
  async updateTestimonial(id: number, partialTestimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set(partialTestimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return !!result;
  }

  // Toppers/Results methods
  async getToppers(): Promise<Topper[]> {
    return await db.select().from(toppers).orderBy(toppers.displayOrder);
  }
  
  async getTopperById(id: number): Promise<Topper | undefined> {
    const [topper] = await db.select().from(toppers).where(eq(toppers.id, id));
    return topper;
  }
  
  async getToppersByYear(year: number): Promise<Topper[]> {
    return await db.select().from(toppers).where(eq(toppers.year, year));
  }
  
  async getToppersByProgram(program: string): Promise<Topper[]> {
    return await db.select().from(toppers).where(eq(toppers.program, program));
  }
  
  async createTopper(insertTopper: InsertTopper): Promise<Topper> {
    const [topper] = await db.insert(toppers).values(insertTopper).returning();
    return topper;
  }
  
  async updateTopper(id: number, partialTopper: Partial<InsertTopper>): Promise<Topper | undefined> {
    const [updatedTopper] = await db
      .update(toppers)
      .set(partialTopper)
      .where(eq(toppers.id, id))
      .returning();
    return updatedTopper;
  }
  
  async deleteTopper(id: number): Promise<boolean> {
    const result = await db.delete(toppers).where(eq(toppers.id, id));
    return !!result;
  }

  // Programs methods
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs);
  }
  
  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.slug, slug));
    return program;
  }
  
  async getProgramById(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }
  
  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const [program] = await db.insert(programs).values(insertProgram).returning();
    return program;
  }
  
  async updateProgram(id: number, partialProgram: Partial<InsertProgram>): Promise<Program | undefined> {
    const [updatedProgram] = await db
      .update(programs)
      .set(partialProgram)
      .where(eq(programs.id, id))
      .returning();
    return updatedProgram;
  }
  
  async deleteProgram(id: number): Promise<boolean> {
    const result = await db.delete(programs).where(eq(programs.id, id));
    return !!result;
  }

  // Media methods
  async getMediaItems(): Promise<Media[]> {
    return await db.select().from(media).orderBy(asc(media.displayOrder), asc(media.createdAt));
  }
  
  async getMediaById(id: number): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem;
  }
  
  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const [mediaItem] = await db.insert(media).values(insertMedia).returning();
    return mediaItem;
  }
  
  async updateMedia(id: number, partialMedia: Partial<InsertMedia>): Promise<Media | undefined> {
    const [updatedMedia] = await db
      .update(media)
      .set(partialMedia)
      .where(eq(media.id, id))
      .returning();
    return updatedMedia;
  }
  
  async deleteMedia(id: number): Promise<boolean> {
    const result = await db.delete(media).where(eq(media.id, id));
    return !!result;
  }

  // Contacts methods
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }
  
  async getContactById(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
  
  async markContactAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id));
    return !!result;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return !!result;
  }

  // App Features methods
  async getAppFeatures(): Promise<AppFeature[]> {
    return await db.select().from(appFeatures);
  }
  
  async getAppFeatureById(id: number): Promise<AppFeature | undefined> {
    const [feature] = await db.select().from(appFeatures).where(eq(appFeatures.id, id));
    return feature;
  }
  
  async createAppFeature(insertFeature: InsertAppFeature): Promise<AppFeature> {
    const [feature] = await db.insert(appFeatures).values(insertFeature).returning();
    return feature;
  }
  
  async updateAppFeature(id: number, partialFeature: Partial<InsertAppFeature>): Promise<AppFeature | undefined> {
    const [updatedFeature] = await db
      .update(appFeatures)
      .set(partialFeature)
      .where(eq(appFeatures.id, id))
      .returning();
    return updatedFeature;
  }
  
  async deleteAppFeature(id: number): Promise<boolean> {
    const result = await db.delete(appFeatures).where(eq(appFeatures.id, id));
    return !!result;
  }

  // App Ratings methods
  async getAppRatings(): Promise<AppRating[]> {
    return await db.select().from(appRatings);
  }
  
  async getAppRatingById(id: number): Promise<AppRating | undefined> {
    const [rating] = await db.select().from(appRatings).where(eq(appRatings.id, id));
    return rating;
  }
  
  async createAppRating(insertRating: InsertAppRating): Promise<AppRating> {
    const [rating] = await db.insert(appRatings).values(insertRating).returning();
    return rating;
  }
  
  async updateAppRating(id: number, partialRating: Partial<InsertAppRating>): Promise<AppRating | undefined> {
    const [updatedRating] = await db
      .update(appRatings)
      .set(partialRating)
      .where(eq(appRatings.id, id))
      .returning();
    return updatedRating;
  }
  
  async deleteAppRating(id: number): Promise<boolean> {
    const result = await db.delete(appRatings).where(eq(appRatings.id, id));
    return !!result;
  }

  // Blog Categories methods
  async getBlogCategories(): Promise<BlogCategory[]> {
    return await db.select().from(blogCategories);
  }
  
  async getBlogCategoryById(id: number): Promise<BlogCategory | undefined> {
    const [category] = await db.select().from(blogCategories).where(eq(blogCategories.id, id));
    return category;
  }
  
  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    const [category] = await db.select().from(blogCategories).where(eq(blogCategories.slug, slug));
    return category;
  }
  
  async createBlogCategory(insertCategory: InsertBlogCategory): Promise<BlogCategory> {
    const [category] = await db.insert(blogCategories).values(insertCategory).returning();
    return category;
  }
  
  async updateBlogCategory(id: number, partialCategory: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined> {
    const [updatedCategory] = await db
      .update(blogCategories)
      .set(partialCategory)
      .where(eq(blogCategories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async deleteBlogCategory(id: number): Promise<boolean> {
    const result = await db.delete(blogCategories).where(eq(blogCategories.id, id));
    return !!result;
  }

  // Blog Posts methods
  async getBlogPosts(options?: { 
    limit?: number; 
    offset?: number; 
    categoryId?: number;
    categorySlug?: string;
    tag?: string;
    status?: string;
  }): Promise<{posts: BlogPost[], total: number}> {
    const { limit = 10, offset = 0, categoryId, categorySlug, tag, status } = options || {};
    
    let query = db.select().from(blogPosts);
    
    // Add filters
    if (categoryId) {
      query = query.where(sql`${blogPosts.categoryIds} @> ARRAY[${categoryId}]`);
    }
    
    if (categorySlug && !categoryId) {
      const category = await this.getBlogCategoryBySlug(categorySlug);
      if (category) {
        query = query.where(sql`${blogPosts.categoryIds} @> ARRAY[${category.id}]`);
      }
    }
    
    if (tag) {
      query = query.where(sql`${blogPosts.tags} @> ARRAY[${tag}]`);
    }
    
    if (status) {
      query = query.where(eq(blogPosts.status, status));
    }
    
    // Get total count for pagination
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(blogPosts);
    
    // Apply pagination
    query = query.limit(limit).offset(offset).orderBy(desc(blogPosts.publishedAt));
    
    const posts = await query;
    
    return { posts, total: Number(total) };
  }
  
  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.authorId, authorId));
  }
  
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }
  
  async updateBlogPost(id: number, partialPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(partialPost)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return !!result;
  }
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private testimonialItems: Map<number, Testimonial>;
  private topperItems: Map<number, Topper>;
  private programItems: Map<number, Program>;
  private mediaItems: Map<number, Media>;
  private contactItems: Map<number, Contact>;
  private appFeatureItems: Map<number, AppFeature>;
  private appRatingItems: Map<number, AppRating>;
  private siteSettingItems: Map<string, SiteSetting>;
  private blogCategoryItems: Map<number, BlogCategory>;
  private milestoneItems: Map<number, Milestone>;
  private milestoneImageItems: Map<number, MilestoneImage>;
  private blogPostItems: Map<number, BlogPost>;
  private galleryEventItems: Map<number, GalleryEvent>;
  private aboutPageImageItems: Map<number, AboutPageImage>;
  
  // Current IDs for auto-increment
  private currentIds: {
    users: number;
    testimonials: number;
    toppers: number;
    programs: number;
    media: number;
    contacts: number;
    appFeatures: number;
    appRatings: number;
    siteSettings: number;
    blogCategories: number;
    blogPosts: number;
    galleryEvents: number;
    aboutPageImages: number;
    milestones: number;
    milestoneImages: number;
  };

  constructor() {
    this.users = new Map();
    this.testimonialItems = new Map();
    this.topperItems = new Map();
    this.programItems = new Map();
    this.mediaItems = new Map();
    this.contactItems = new Map();
    this.appFeatureItems = new Map();
    this.appRatingItems = new Map();
    this.siteSettingItems = new Map();
    this.blogCategoryItems = new Map();
    this.blogPostItems = new Map();
    this.galleryEventItems = new Map();
    this.aboutPageImageItems = new Map();
    this.milestoneItems = new Map();
    this.milestoneImageItems = new Map();
    
    this.currentIds = {
      users: 1,
      testimonials: 1,
      toppers: 1,
      programs: 1,
      media: 1,
      contacts: 1,
      appFeatures: 1,
      appRatings: 1,
      siteSettings: 1,
      blogCategories: 1,
      blogPosts: 1,
      galleryEvents: 1,
      aboutPageImages: 1,
      milestones: 1,
      milestoneImages: 1
    };
    
    // Initialize with sample data for development
    this.initializeData();
  }
  
  // Site Settings methods
  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const settings = Array.from(this.siteSettingItems.values()).find(
      (setting) => setting.key === key
    );
    return settings;
  }
  
  async getAllSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettingItems.values());
  }
  
  async updateSetting(key: string, value: string): Promise<SiteSetting> {
    const existingSetting = Array.from(this.siteSettingItems.values()).find(
      (setting) => setting.key === key
    );
    
    if (existingSetting) {
      const updatedSetting: SiteSetting = {
        ...existingSetting,
        value,
        updatedAt: new Date()
      };
      this.siteSettingItems.set(existingSetting.id.toString(), updatedSetting);
      return updatedSetting;
    } else {
      // Create new setting if it doesn't exist
      const id = this.currentIds.siteSettings++;
      const now = new Date();
      const newSetting: SiteSetting = {
        id,
        key,
        value,
        updatedAt: now
      };
      this.siteSettingItems.set(id.toString(), newSetting);
      return newSetting;
    }
  }

  // Initialize with sample data
  private initializeData() {
    // Initialize site settings with default values
    this.updateSetting('hero_video_url', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    this.updateSetting('hero_video_poster', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80');
    
    // Initialize sample blog categories
    this.createBlogCategory({
      name: "General",
      slug: "general",
      description: "General strategies and advice for UPSC preparation"
    });
    
    this.createBlogCategory({
      name: "Aspirant Life",
      slug: "aspirant-life",
      description: "Tips for balancing life as a UPSC aspirant, managing stress, and staying motivated"
    });
    
    this.createBlogCategory({
      name: "Prelims",
      slug: "prelims",
      description: "Strategies, resources, and tips specifically for UPSC Preliminary examination"
    });
    
    this.createBlogCategory({
      name: "Mains",
      slug: "mains",
      description: "Answer writing techniques, subject-specific strategies, and preparation tips for UPSC Mains"
    });
    
    this.createBlogCategory({
      name: "Optionals",
      slug: "optionals",
      description: "Guidance on choosing and preparing for optional subjects in UPSC examination"
    });
    
    this.createBlogCategory({
      name: "Interview",
      slug: "interview",
      description: "Preparation strategies and tips for the UPSC Personality Test/Interview stage"
    });
    
    // Initialize sample blog posts
    this.createBlogPost({
      title: "How to Prepare for Ethics Paper in UPSC Civil Services Examination",
      slug: "how-to-prepare-for-ethics-paper",
      excerpt: "A comprehensive guide to approach the Ethics, Integrity and Aptitude paper (GS Paper 4) in the UPSC Civil Services Mains Examination.",
      content: `
# How to Prepare for Ethics Paper in UPSC Civil Services Examination

The Ethics, Integrity and Aptitude paper (GS Paper 4) was introduced in the UPSC Civil Services Examination in 2013. Since then, it has become one of the most scoring yet challenging papers in the UPSC Mains examination.

## Understanding the Paper

The Ethics paper tests a candidate's attitude and approach towards issues related to integrity and probity in public life. It also examines the candidate's ability to apply ethical frameworks to solve administrative and governance-related dilemmas.

### Key Areas Covered:

1. **Theoretical Concepts**: Ethics and Human Interface, Attitude, Aptitude, Emotional Intelligence, etc.
2. **Thinkers and Philosophers**: Contributions of moral thinkers and philosophers from India and the world.
3. **Case Studies**: Practical application of ethical theories to real-life situations.

## Preparation Strategy

### 1. Build a Strong Foundation

Start with basic concepts of ethics, integrity, aptitude, emotional intelligence, and public service values. Understand different ethical theories like:

- Deontological ethics (Kant's theory)
- Utilitarianism (Jeremy Bentham and John Stuart Mill)
- Virtue ethics (Aristotle)
- Indian ethical traditions (Bhagavad Gita, Buddhist ethics, etc.)

### 2. Practice Case Studies Regularly

The case study section carries substantial marks (typically 120-150 marks out of 250). Practice solving ethical dilemmas by:

- Identifying the ethical issues involved
- Analyzing stakeholders and their interests
- Applying ethical frameworks
- Suggesting practical solutions

### 3. Develop an Ethical Vocabulary

Use appropriate ethical terminology in your answers to demonstrate understanding:

- Integrity, probity, transparency, accountability
- Moral courage, moral turpitude, moral compass
- Public service values, code of conduct
- Corporate governance, organizational ethics

### 4. Prepare Notes on Thinkers and Philosophers

Create concise notes on key ethical thinkers like:

- Indian thinkers: Gandhi, Swami Vivekananda, Thiruvalluvar
- Western philosophers: Aristotle, Kant, John Stuart Mill
- Contemporary thinkers: Peter Singer, Amartya Sen

## Recommended Resources

1. **Books**:
   - Lexicon for Ethics, Integrity & Aptitude by Niraj Kumar
   - Ethics, Integrity & Aptitude for Civil Services Examination by Subba Rao & P.N. Roy Chowdhury
   - Ethics, Integrity & Aptitude by G. Subba Rao

2. **Newspapers and Magazines**:
   - The Hindu - for ethical issues in governance
   - Yojana and Kurukshetra - for development ethics

## Concluding Tips

1. **Be balanced in your approach** - avoid extreme positions
2. **Use real-life examples** - from administration, governance, and your personal experiences
3. **Practice writing answers regularly** - time management is crucial
4. **Review previous years' questions** - understand the pattern and expectation

Remember, the Ethics paper is not just about knowledge but also about application. Develop an ethical mindset that reflects in your answers.
      `,
      authorId: 1,
      categoryIds: [4], // Mains
      tags: ["ethics", "integrity", "upsc", "civil services", "mains"],
      status: "published",
      metaTitle: "Ethics Paper Preparation Strategy for UPSC CSE | iLearn IAS Academy",
      metaDescription: "Learn how to approach and score well in the Ethics, Integrity and Aptitude paper (GS Paper 4) in the UPSC Civil Services Mains Examination.",
      featuredImage: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
      featuredImageAlt: "Person studying with books on ethics and philosophy",
      publishedAt: new Date("2025-04-25T09:00:00Z")
    });
    
    this.createBlogPost({
      title: "Current Affairs: Understanding the Russia-Ukraine Conflict and Its Global Implications",
      slug: "russia-ukraine-conflict-global-implications",
      excerpt: "A detailed analysis of the Russia-Ukraine conflict, its historical context, and its implications for global geopolitics and the international order.",
      content: `
# Current Affairs: Understanding the Russia-Ukraine Conflict and Its Global Implications

The Russia-Ukraine conflict represents one of the most significant geopolitical crises in recent decades, with far-reaching implications for international relations, security, and the global economic order.

## Historical Context

The roots of the current conflict can be traced back to multiple historical factors:

1. **Post-Soviet Dynamics**: Following the collapse of the Soviet Union in 1991, Ukraine declared independence, creating new geopolitical realities.

2. **NATO Expansion**: The eastward expansion of NATO has been viewed by Russia as a security threat and encroachment on its traditional sphere of influence.

3. **2014 Ukrainian Revolution**: The Euromaidan protests led to the ousting of pro-Russian President Viktor Yanukovych, followed by Russia's annexation of Crimea.

## The Current Conflict

The current phase of the conflict escalated in February 2022 when Russia launched a military operation against Ukraine. The key aspects include:

- Russian objectives of "demilitarization" and "denazification" of Ukraine
- Western response through economic sanctions
- Military aid to Ukraine from NATO countries
- Humanitarian crisis with millions of refugees

## Global Implications

### 1. Geopolitical Reshaping

- Strengthening of NATO and Western unity
- Closer Russia-China alignment
- Emergence of new global alignments and divisions

### 2. Economic Impact

- Energy crisis in Europe
- Global food security challenges due to disruption in grain exports
- Sanctions and counter-sanctions creating new trade patterns
- Inflationary pressures worldwide

### 3. International Law and Order

- Challenges to the UN system and international dispute resolution
- Questions about the effectiveness of economic sanctions
- Debates about sovereignty and the principles of non-intervention

## India's Position

India has maintained a balanced approach to the conflict:

- Calling for peaceful resolution through dialogue
- Abstaining from UN resolutions condemning Russia
- Continuing trade with Russia while expressing concern over the humanitarian situation
- Evacuating Indian nationals from conflict zones

## UPSC Perspective

From the UPSC examination perspective, candidates should analyze:

1. **Historical factors** leading to the conflict
2. **Legal aspects** under international law
3. **Economic implications** for global trade and energy security
4. **India's strategic interests** and diplomatic position
5. **Concepts of sovereignty** and international security

## Important Questions to Consider

1. How has the Russia-Ukraine conflict affected the post-Cold War international order?
2. Analyze India's position on the Russia-Ukraine conflict in light of its strategic autonomy doctrine.
3. Discuss the implications of economic sanctions as a tool of international diplomacy, using the Russia-Ukraine conflict as a case study.
4. How has the conflict impacted global food security and what are its implications for developing nations?

## Conclusion

The Russia-Ukraine conflict represents a watershed moment in contemporary international relations. Its resolution or prolongation will significantly shape the emerging world order, power dynamics between major nations, and the future of international institutions.

For UPSC aspirants, a nuanced understanding of this conflict, its historical context, and global ramifications is essential for both the Prelims and Mains examinations, particularly for papers on International Relations, Current Affairs, and Essay writing.
      `,
      authorId: 1,
      categoryIds: [1], // General
      tags: ["current affairs", "international relations", "russia", "ukraine", "geopolitics"],
      status: "published",
      metaTitle: "Russia-Ukraine Conflict Analysis for UPSC | Global Implications Explained",
      metaDescription: "An in-depth analysis of the Russia-Ukraine conflict, its historical context, geopolitical implications, and relevance for UPSC Civil Services Examination.",
      featuredImage: "https://images.unsplash.com/photo-1646933149121-3613202f20d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
      featuredImageAlt: "Flags of Russia and Ukraine with a globe in the background",
      publishedAt: new Date("2025-04-23T10:30:00Z")
    });
    
    this.createBlogPost({
      title: "Mastering Indian History for UPSC Prelims: Key Dates and Events",
      slug: "mastering-indian-history-upsc-prelims",
      excerpt: "A chronological guide to the most important dates, events, and personalities in Indian history that are commonly asked in the UPSC Prelims examination.",
      content: `
# Mastering Indian History for UPSC Prelims: Key Dates and Events

Indian history constitutes a significant portion of the UPSC Prelims syllabus. This comprehensive guide covers the most important dates, events, and personalities that frequently appear in the examination.

## Ancient India (Up to 700 CE)

### Indus Valley Civilization (2600-1900 BCE)
- **Major Sites**: Harappa, Mohenjo-daro, Dholavira, Lothal, Kalibangan
- **Key Features**: Grid pattern towns, Great Bath, drainage system, seals, script

### Vedic Period (1500-600 BCE)
- **Early Vedic/Rig Vedic Period**: Tribal kingdoms, pastoral economy
- **Later Vedic Period**: Emergence of territorial states, agricultural economy
- **Texts**: Four Vedas, Brahmanas, Aranyakas, Upanishads

### Rise of Mahajanapadas (600-325 BCE)
- **16 Mahajanapadas**: Magadha, Kosala, Vatsa, Avanti, etc.
- **First Urbanization**: Second phase of urbanization after Indus Valley
- **Religious Movements**: Jainism (Mahavira) and Buddhism (Gautama Buddha)

### Mauryan Empire (322-185 BCE)
- **Chandragupta Maurya**: Founder, mentored by Chanakya
- **Ashoka (273-232 BCE)**: Kalinga War (261 BCE), spread of Buddhism
- **Edicts**: Major and Minor Rock Edicts, Pillar Edicts

### Post-Mauryan Period (185 BCE-300 CE)
- **Indo-Greeks**: Menander (Milinda), Hellenistic influence
- **Kushanas**: Kanishka, cultural synthesis, trade
- **Satavahanas**: Deccan rule, Gautamiputra Satakarni

### Gupta Empire (320-550 CE)
- **Chandragupta I**: Marriage alliance with Lichchhavis
- **Samudragupta**: "Indian Napoleon", military campaigns
- **Chandragupta II (Vikramaditya)**: Golden Age, Kalidasa's works

## Medieval India (700-1757 CE)

### Delhi Sultanate (1206-1526 CE)
- **Five Dynasties**: Mamluk/Slave, Khalji, Tughlaq, Sayyid, Lodi
- **Alauddin Khalji**: Market reforms, defense against Mongols
- **Muhammad bin Tughlaq**: Transfer of capital, token currency
- **Firoz Shah Tughlaq**: Irrigation works, low taxation

### Vijayanagara Empire (1336-1646 CE)
- **Founders**: Harihara and Bukka
- **Krishna Deva Raya**: Golden age, literature, architecture
- **Battle of Talikota (1565)**: Defeat by Deccan Sultanates

### Mughal Empire (1526-1857 CE)
- **Babur**: First Battle of Panipat (1526)
- **Akbar (1556-1605)**: Din-i-Ilahi, Mansabdari system, revenue reforms
- **Shah Jahan**: Taj Mahal, Red Fort, economic prosperity
- **Aurangzeb**: Religiosity, Deccan campaigns, decline begins

## Modern India (1757-1947)

### British East India Company (1757-1858)
- **Battle of Plassey (1757)**: Defeat of Siraj-ud-Daulah
- **Battle of Buxar (1764)**: Company's control over Bengal
- **Subsidiary Alliance**: Lord Wellesley's expansion policy
- **Doctrine of Lapse**: Lord Dalhousie's annexation policy

### Revolt of 1857
- **Immediate Cause**: Greased cartridges
- **Leaders**: Mangal Pandey, Rani Lakshmibai, Tantia Tope, Bahadur Shah Zafar
- **Result**: End of Company rule, beginning of Crown rule

### Indian National Movement
- **Formation of INC (1885)**: A.O. Hume
- **Partition of Bengal (1905)**: Swadeshi Movement
- **Home Rule Movement (1916)**: Annie Besant, Bal Gangadhar Tilak
- **Non-Cooperation Movement (1920-22)**: Response to Rowlatt Act, Jallianwala Bagh
- **Civil Disobedience Movement (1930-34)**: Salt Satyagraha
- **Quit India Movement (1942)**: "Do or Die"
- **Cabinet Mission Plan (1946)**: Last attempt at united India
- **Independence and Partition (1947)**: Mountbatten Plan

## Exam Tips

1. **Focus on chronology**: Create a timeline of major events
2. **Connect events with personalities**: Associate each event with key figures
3. **Understand cause-effect relationships**: Link events with their consequences
4. **Pay attention to art, architecture and cultural developments**: These are frequently asked
5. **Practice with previous years' questions**: Identify patterns and recurring themes

Remember, UPSC often asks questions that connect different periods of history or relate historical events to contemporary issues, so develop a holistic understanding rather than memorizing isolated facts.
      `,
      authorId: 1,
      categoryIds: [3], // Prelims
      tags: ["indian history", "ancient india", "medieval india", "modern india", "freedom struggle", "upsc prelims"],
      status: "published",
      metaTitle: "Indian History Timeline for UPSC Prelims | Key Events and Dates",
      metaDescription: "A comprehensive chronological guide to important dates, events, and personalities in Indian history for UPSC Prelims preparation.",
      featuredImage: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
      featuredImageAlt: "Ancient Indian monuments and historical manuscripts",
      publishedAt: new Date("2025-04-20T08:15:00Z")
    });
    // Initialize sample testimonials
    this.createTestimonial({
      name: "Raj Sharma",
      rank: "AIR 25",
      program: "Comprehensive Program",
      quote: "iLearn IAS coaching was instrumental in my success. The faculty's guidance and structured study plan helped me secure AIR 25.",
      year: 2023,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      type: "text"
    });
    
    this.createTestimonial({
      name: "Sneha Patel",
      rank: "AIR 42",
      program: "Prelims-cum-Mains",
      quote: "The mentorship and mock interview sessions at iLearn IAS were exceptional. They prepared me thoroughly for every stage of the exam.",
      year: 2023,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      type: "text"
    });

    // Initialize media items - Instagram Reels
    this.createMedia({
      title: "CSE 2024 Topper Interview",
      description: "Interview with the UPSC CSE 2024 topper sharing insights and strategies",
      mediaUrl: "https://www.instagram.com/p/C8-dNY8vV3J/",
      thumbnailUrl: "https://images.unsplash.com/photo-1633068587634-4280dabf12ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    });

    this.createMedia({
      title: "Tips for UPSC Prelims",
      description: "Quick tips to boost your UPSC Prelims preparation in the final days",
      mediaUrl: "https://www.instagram.com/p/C8-XRvgvP1R/",
      thumbnailUrl: "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    });

    this.createMedia({
      title: "Current Affairs Daily Update",
      description: "Daily current affairs summary for UPSC aspirants",
      mediaUrl: "https://www.instagram.com/p/C8-OP4svZ2M/",
      thumbnailUrl: "https://images.unsplash.com/photo-1606103920295-9a091650dbaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    });

    this.createMedia({
      title: "Student Success Story",
      description: "UPSC aspirant shares their journey from preparation to selection",
      mediaUrl: "https://www.instagram.com/p/C8-PSwQvX3N/",
      thumbnailUrl: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    });

    // Initialize programs
    this.createProgram({
      slug: "prelims-cum-mains",
      title: "Prelims-cum-Mains Program (PCM)",
      description: "Comprehensive coaching for both Prelims and Mains examination with personalized mentoring and regular assessments.",
      icon: "ri-graduation-cap-line",
      duration: "12 months",
      usp: ["Comprehensive coverage", "Regular mock tests", "Personalized feedback"],
      testimonials: [1, 2],
      fees: "₹1,25,000",
      faq: [
        { question: "Is the course available online?", answer: "Yes, we offer both offline and online modes." },
        { question: "How many tests are included?", answer: "The program includes 24 prelims tests and 16 mains tests." }
      ]
    });
    
    this.createProgram({
      slug: "integrated-prelims-test-series",
      title: "Integrated Prelims Test Series (iPTS)",
      description: "Extensive test series focusing on UPSC Prelims preparation with detailed solution discussions and performance analysis.",
      icon: "ri-file-list-3-line",
      duration: "6 months",
      usp: ["All India Ranking", "Detailed explanations", "Performance analytics"],
      testimonials: [1],
      fees: "₹15,000",
      faq: [
        { question: "How many tests are included?", answer: "The program includes 38 sectional and full-length tests." },
        { question: "Are previous year questions covered?", answer: "Yes, we provide analysis of previous years' patterns and questions." }
      ]
    });
    
    this.createProgram({
      slug: "mains-test-series",
      title: "Mains Test Series & Answer Writing (MTS/MAP)",
      description: "Focused on UPSC Mains preparation with detailed evaluation of written answers and personalized feedback.",
      icon: "ri-pen-nib-line",
      duration: "5 months",
      usp: ["Answer evaluation", "One-on-one feedback", "Model answers"],
      testimonials: [2],
      fees: "₹20,000",
      faq: [
        { question: "How are the answers evaluated?", answer: "Each answer is evaluated by subject experts who provide detailed feedback." },
        { question: "Is GS + Essay covered?", answer: "Yes, the program covers all GS papers, essays, and optional subjects if opted for." }
      ]
    });
    
    // Initialize media items - YouTube Videos
    this.createMedia({
      title: "Understanding UPSC Pattern Changes",
      description: "Expert analysis of the recent changes in UPSC exam patterns and how to adapt",
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    });

    this.createMedia({
      title: "Economy for UPSC - Full Session",
      description: "Complete economics session covering all important topics for UPSC preparation",
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    });

    this.createMedia({
      title: "Interview Preparation Workshop",
      description: "Complete workshop on interview preparation for UPSC aspirants",
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    });
    
    // Initialize media items - Image Gallery
    this.createMedia({
      title: "Campus Infrastructure",
      description: "State-of-the-art study facilities at our main campus",
      mediaUrl: "https://images.unsplash.com/photo-1562774053-701939374585",
      thumbnailUrl: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    });
  }

  // Users methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Testimonials methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonialItems.values());
  }

  async getTestimonialsByType(type: string): Promise<Testimonial[]> {
    return Array.from(this.testimonialItems.values()).filter(
      (testimonial) => testimonial.type === type
    );
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonialItems.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentIds.testimonials++;
    const now = new Date();
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      createdAt: now
    };
    this.testimonialItems.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, partialTestimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existingTestimonial = this.testimonialItems.get(id);
    if (!existingTestimonial) return undefined;

    const updatedTestimonial: Testimonial = {
      ...existingTestimonial,
      ...partialTestimonial
    };
    
    this.testimonialItems.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonialItems.delete(id);
  }

  // Toppers/Results methods
  async getToppers(): Promise<Topper[]> {
    return Array.from(this.topperItems.values());
  }

  async getTopperById(id: number): Promise<Topper | undefined> {
    return this.topperItems.get(id);
  }

  async getToppersByYear(year: number): Promise<Topper[]> {
    return Array.from(this.topperItems.values()).filter(
      (topper) => topper.year === year
    );
  }

  async getToppersByProgram(program: string): Promise<Topper[]> {
    return Array.from(this.topperItems.values()).filter(
      (topper) => topper.program === program
    );
  }

  async createTopper(insertTopper: InsertTopper): Promise<Topper> {
    const id = this.currentIds.toppers++;
    const now = new Date();
    const topper: Topper = { 
      ...insertTopper, 
      id,
      createdAt: now
    };
    this.topperItems.set(id, topper);
    return topper;
  }

  async updateTopper(id: number, partialTopper: Partial<InsertTopper>): Promise<Topper | undefined> {
    const existingTopper = this.topperItems.get(id);
    if (!existingTopper) return undefined;

    const updatedTopper: Topper = {
      ...existingTopper,
      ...partialTopper
    };
    
    this.topperItems.set(id, updatedTopper);
    return updatedTopper;
  }

  async deleteTopper(id: number): Promise<boolean> {
    return this.topperItems.delete(id);
  }

  // Programs methods
  async getPrograms(): Promise<Program[]> {
    return Array.from(this.programItems.values());
  }

  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    return Array.from(this.programItems.values()).find(
      (program) => program.slug === slug
    );
  }

  async getProgramById(id: number): Promise<Program | undefined> {
    return this.programItems.get(id);
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = this.currentIds.programs++;
    const now = new Date();
    const program: Program = { 
      ...insertProgram, 
      id,
      createdAt: now
    };
    this.programItems.set(id, program);
    return program;
  }

  async updateProgram(id: number, partialProgram: Partial<InsertProgram>): Promise<Program | undefined> {
    const existingProgram = this.programItems.get(id);
    if (!existingProgram) return undefined;

    const updatedProgram: Program = {
      ...existingProgram,
      ...partialProgram
    };
    
    this.programItems.set(id, updatedProgram);
    return updatedProgram;
  }

  async deleteProgram(id: number): Promise<boolean> {
    return this.programItems.delete(id);
  }

  // Media methods
  async getMediaItems(): Promise<Media[]> {
    return Array.from(this.mediaItems.values())
      .sort((a, b) => {
        // First sort by displayOrder (if it exists)
        if (a.displayOrder !== null && b.displayOrder !== null) {
          return a.displayOrder - b.displayOrder;
        }
        // If one has displayOrder and the other doesn't, prioritize the one with displayOrder
        if (a.displayOrder !== null) return -1;
        if (b.displayOrder !== null) return 1;
        // Finally fall back to created date
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    return this.mediaItems.get(id);
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = this.currentIds.media++;
    const now = new Date();
    const media: Media = { 
      ...insertMedia, 
      id,
      createdAt: now
    };
    this.mediaItems.set(id, media);
    return media;
  }

  async updateMedia(id: number, partialMedia: Partial<InsertMedia>): Promise<Media | undefined> {
    const existingMedia = this.mediaItems.get(id);
    if (!existingMedia) return undefined;

    const updatedMedia: Media = {
      ...existingMedia,
      ...partialMedia
    };
    
    this.mediaItems.set(id, updatedMedia);
    return updatedMedia;
  }

  async deleteMedia(id: number): Promise<boolean> {
    return this.mediaItems.delete(id);
  }

  // Contacts methods
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contactItems.values());
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    return this.contactItems.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentIds.contacts++;
    const now = new Date();
    const contact: Contact = { 
      ...insertContact, 
      id,
      createdAt: now,
      isRead: false
    };
    this.contactItems.set(id, contact);
    return contact;
  }

  async markContactAsRead(id: number): Promise<boolean> {
    const existingContact = this.contactItems.get(id);
    if (!existingContact) return false;

    existingContact.isRead = true;
    this.contactItems.set(id, existingContact);
    return true;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contactItems.delete(id);
  }

  // App Features methods
  async getAppFeatures(): Promise<AppFeature[]> {
    return Array.from(this.appFeatureItems.values());
  }

  async getAppFeatureById(id: number): Promise<AppFeature | undefined> {
    return this.appFeatureItems.get(id);
  }

  async createAppFeature(insertFeature: InsertAppFeature): Promise<AppFeature> {
    const id = this.currentIds.appFeatures++;
    const now = new Date();
    const feature: AppFeature = { 
      ...insertFeature, 
      id,
      createdAt: now
    };
    this.appFeatureItems.set(id, feature);
    return feature;
  }

  async updateAppFeature(id: number, partialFeature: Partial<InsertAppFeature>): Promise<AppFeature | undefined> {
    const existingFeature = this.appFeatureItems.get(id);
    if (!existingFeature) return undefined;

    const updatedFeature: AppFeature = {
      ...existingFeature,
      ...partialFeature
    };
    
    this.appFeatureItems.set(id, updatedFeature);
    return updatedFeature;
  }

  async deleteAppFeature(id: number): Promise<boolean> {
    return this.appFeatureItems.delete(id);
  }

  // App Ratings methods
  async getAppRatings(): Promise<AppRating[]> {
    return Array.from(this.appRatingItems.values());
  }

  async getAppRatingById(id: number): Promise<AppRating | undefined> {
    return this.appRatingItems.get(id);
  }

  async createAppRating(insertRating: InsertAppRating): Promise<AppRating> {
    const id = this.currentIds.appRatings++;
    const now = new Date();
    const rating: AppRating = { 
      ...insertRating, 
      id,
      createdAt: now
    };
    this.appRatingItems.set(id, rating);
    return rating;
  }

  async updateAppRating(id: number, partialRating: Partial<InsertAppRating>): Promise<AppRating | undefined> {
    const existingRating = this.appRatingItems.get(id);
    if (!existingRating) return undefined;

    const updatedRating: AppRating = {
      ...existingRating,
      ...partialRating
    };
    
    this.appRatingItems.set(id, updatedRating);
    return updatedRating;
  }

  async deleteAppRating(id: number): Promise<boolean> {
    return this.appRatingItems.delete(id);
  }

  // Blog Categories methods
  async getBlogCategories(): Promise<BlogCategory[]> {
    return Array.from(this.blogCategoryItems.values());
  }

  async getBlogCategoryById(id: number): Promise<BlogCategory | undefined> {
    return this.blogCategoryItems.get(id);
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    return Array.from(this.blogCategoryItems.values()).find(
      (category) => category.slug === slug
    );
  }

  async createBlogCategory(insertCategory: InsertBlogCategory): Promise<BlogCategory> {
    const id = this.currentIds.blogCategories++;
    const now = new Date();
    const category: BlogCategory = {
      ...insertCategory,
      id,
      createdAt: now
    };
    this.blogCategoryItems.set(id, category);
    return category;
  }

  async updateBlogCategory(id: number, partialCategory: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined> {
    const existingCategory = this.blogCategoryItems.get(id);
    if (!existingCategory) return undefined;

    const updatedCategory: BlogCategory = {
      ...existingCategory,
      ...partialCategory
    };
    
    this.blogCategoryItems.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteBlogCategory(id: number): Promise<boolean> {
    return this.blogCategoryItems.delete(id);
  }

  // Blog Posts methods
  async getBlogPosts(options?: { 
    limit?: number;
    offset?: number; 
    categoryId?: number;
    categorySlug?: string;
    tag?: string;
    status?: string;
  }): Promise<{posts: BlogPost[], total: number}> {
    let filteredPosts = Array.from(this.blogPostItems.values());
    
    // Filter by category ID if provided
    if (options?.categoryId !== undefined) {
      filteredPosts = filteredPosts.filter(post => 
        post.categoryIds?.includes(options.categoryId!)
      );
    }
    
    // Filter by category slug if provided
    if (options?.categorySlug !== undefined) {
      const category = this.getBlogCategoryBySlug(options.categorySlug);
      if (category) {
        filteredPosts = filteredPosts.filter(post => 
          post.categoryIds?.includes(category.id)
        );
      }
    }
    
    // Filter by tag if provided
    if (options?.tag !== undefined) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.includes(options.tag!)
      );
    }
    
    // Filter by status if provided (published, draft, etc.)
    if (options?.status !== undefined) {
      filteredPosts = filteredPosts.filter(post => 
        post.status === options.status
      );
    } else {
      // By default, only return published posts
      filteredPosts = filteredPosts.filter(post => 
        post.status === 'published'
      );
    }
    
    // Get total count before pagination
    const total = filteredPosts.length;
    
    // Sort by published date (newest first)
    filteredPosts.sort((a, b) => {
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    
    // Apply pagination if provided
    if (options?.limit !== undefined || options?.offset !== undefined) {
      const offset = options?.offset || 0;
      const limit = options?.limit || 10;
      filteredPosts = filteredPosts.slice(offset, offset + limit);
    }
    
    return { posts: filteredPosts, total };
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPostItems.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostItems.values()).find(
      (post) => post.slug === slug
    );
  }

  async getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]> {
    return Array.from(this.blogPostItems.values()).filter(
      (post) => post.authorId === authorId
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentIds.blogPosts++;
    const now = new Date();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.blogPostItems.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, partialPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPostItems.get(id);
    if (!existingPost) return undefined;

    const now = new Date();
    const updatedPost: BlogPost = {
      ...existingPost,
      ...partialPost,
      updatedAt: now
    };
    
    this.blogPostItems.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPostItems.delete(id);
  }

  // About Page Images methods
  async getAboutPageImages(section?: string): Promise<AboutPageImage[]> {
    let images = Array.from(this.aboutPageImageItems.values());
    if (section) {
      images = images.filter(image => image.section === section);
    }
    return images.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getAboutPageImageById(id: number): Promise<AboutPageImage | undefined> {
    return this.aboutPageImageItems.get(id);
  }

  async createAboutPageImage(image: InsertAboutPageImage): Promise<AboutPageImage> {
    const id = this.currentIds.aboutPageImages++;
    const now = new Date();
    
    const newImage: AboutPageImage = {
      id,
      section: image.section,
      imageUrl: image.imageUrl,
      alt: image.alt || null,
      displayOrder: image.displayOrder !== undefined ? image.displayOrder : this.aboutPageImageItems.size,
      createdAt: now
    };
    
    this.aboutPageImageItems.set(id, newImage);
    return newImage;
  }

  async updateAboutPageImage(id: number, image: Partial<InsertAboutPageImage>): Promise<AboutPageImage | undefined> {
    const existingImage = this.aboutPageImageItems.get(id);
    if (!existingImage) return undefined;

    const updatedImage: AboutPageImage = {
      ...existingImage,
      section: image.section ?? existingImage.section,
      imageUrl: image.imageUrl ?? existingImage.imageUrl,
      alt: image.alt !== undefined ? image.alt : existingImage.alt,
      displayOrder: image.displayOrder ?? existingImage.displayOrder
    };

    this.aboutPageImageItems.set(id, updatedImage);
    return updatedImage;
  }

  async deleteAboutPageImage(id: number): Promise<boolean> {
    return this.aboutPageImageItems.delete(id);
  }

  async updateAboutPageImageOrder(ids: number[]): Promise<boolean> {
    try {
      // Update displayOrder based on the position in the ids array
      ids.forEach((id, index) => {
        const image = this.aboutPageImageItems.get(id);
        if (image) {
          image.displayOrder = index;
          this.aboutPageImageItems.set(id, image);
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating about page image order:', error);
      return false;
    }
  }

  // Gallery Events methods
  async getGalleryEvents(): Promise<GalleryEvent[]> {
    const events = Array.from(this.galleryEventItems.values());
    return events.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getGalleryEventById(id: number): Promise<GalleryEvent | undefined> {
    return this.galleryEventItems.get(id);
  }

  async createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent> {
    // Use currentIds['galleryEvents'] to access property with bracket notation
    const id = this.currentIds['galleryEvents']++;
    const now = new Date();
    
    const newEvent: GalleryEvent = {
      id,
      title: event.title,
      description: event.description || null,
      mediaIds: event.mediaIds || null,
      displayOrder: event.displayOrder || this.galleryEventItems.size,
      createdAt: now
    };
    
    this.galleryEventItems.set(id, newEvent);
    return newEvent;
  }

  async updateGalleryEvent(id: number, event: Partial<InsertGalleryEvent>): Promise<GalleryEvent | undefined> {
    const existingEvent = this.galleryEventItems.get(id);
    if (!existingEvent) return undefined;

    const updatedEvent: GalleryEvent = {
      ...existingEvent,
      title: event.title ?? existingEvent.title,
      description: event.description !== undefined ? event.description : existingEvent.description,
      mediaIds: event.mediaIds !== undefined ? event.mediaIds : existingEvent.mediaIds,
      displayOrder: event.displayOrder ?? existingEvent.displayOrder
    };

    this.galleryEventItems.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteGalleryEvent(id: number): Promise<boolean> {
    return this.galleryEventItems.delete(id);
  }

  async updateGalleryEventOrder(ids: number[]): Promise<boolean> {
    try {
      // Update displayOrder based on the position in the ids array
      ids.forEach((id, index) => {
        const event = this.galleryEventItems.get(id);
        if (event) {
          event.displayOrder = index;
          this.galleryEventItems.set(id, event);
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating gallery event order:', error);
      return false;
    }
  }
  
  // Milestones methods
  async getMilestones(): Promise<Milestone[]> {
    const milestones = Array.from(this.milestoneItems.values());
    return milestones.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getMilestoneById(id: number): Promise<Milestone | undefined> {
    return this.milestoneItems.get(id);
  }

  async getDefaultMilestone(): Promise<Milestone | undefined> {
    // First try to find a milestone marked as default
    const defaultMilestone = Array.from(this.milestoneItems.values()).find(
      milestone => milestone.isDefault
    );
    
    if (defaultMilestone) {
      return defaultMilestone;
    }
    
    // If no default is set, return the first milestone by display order
    const milestones = await this.getMilestones();
    return milestones.length > 0 ? milestones[0] : undefined;
  }

  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    // If this milestone is marked as default, clear other defaults
    if (milestone.isDefault) {
      Array.from(this.milestoneItems.values()).forEach(m => {
        m.isDefault = false;
        this.milestoneItems.set(m.id, m);
      });
    }
    
    const id = this.currentIds.milestones++;
    const now = new Date();
    
    const newMilestone: Milestone = {
      id,
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
      displayOrder: milestone.displayOrder || this.milestoneItems.size,
      isDefault: milestone.isDefault || false,
      createdAt: now
    };
    
    this.milestoneItems.set(id, newMilestone);
    return newMilestone;
  }

  async updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const existingMilestone = this.milestoneItems.get(id);
    if (!existingMilestone) return undefined;

    // If this milestone is being set as default, clear other defaults
    if (milestone.isDefault) {
      Array.from(this.milestoneItems.values()).forEach(m => {
        if (m.id !== id) {
          m.isDefault = false;
          this.milestoneItems.set(m.id, m);
        }
      });
    }
    
    const updatedMilestone: Milestone = {
      ...existingMilestone,
      year: milestone.year ?? existingMilestone.year,
      title: milestone.title ?? existingMilestone.title,
      description: milestone.description ?? existingMilestone.description,
      displayOrder: milestone.displayOrder ?? existingMilestone.displayOrder,
      isDefault: milestone.isDefault ?? existingMilestone.isDefault
    };
    
    this.milestoneItems.set(id, updatedMilestone);
    return updatedMilestone;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    // First delete all associated images
    Array.from(this.milestoneImageItems.values()).forEach(image => {
      if (image.milestoneId === id) {
        this.milestoneImageItems.delete(image.id);
      }
    });
    
    return this.milestoneItems.delete(id);
  }

  async updateMilestoneOrder(ids: number[]): Promise<boolean> {
    try {
      ids.forEach((id, index) => {
        const milestone = this.milestoneItems.get(id);
        if (milestone) {
          milestone.displayOrder = index;
          this.milestoneItems.set(id, milestone);
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating milestone order:', error);
      return false;
    }
  }

  async setDefaultMilestone(id: number): Promise<boolean> {
    const milestone = this.milestoneItems.get(id);
    if (!milestone) return false;
    
    // Clear all defaults
    Array.from(this.milestoneItems.values()).forEach(m => {
      m.isDefault = m.id === id;
      this.milestoneItems.set(m.id, m);
    });
    
    return true;
  }
  
  // Milestone Images methods
  async getMilestoneImages(milestoneId: number): Promise<MilestoneImage[]> {
    const images = Array.from(this.milestoneImageItems.values())
      .filter(image => image.milestoneId === milestoneId);
    
    return images.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getMilestoneImageById(id: number): Promise<MilestoneImage | undefined> {
    return this.milestoneImageItems.get(id);
  }

  async createMilestoneImage(image: InsertMilestoneImage): Promise<MilestoneImage> {
    const id = this.currentIds.milestoneImages++;
    const now = new Date();
    
    const newImage: MilestoneImage = {
      id,
      milestoneId: image.milestoneId,
      imageUrl: image.imageUrl,
      alt: image.alt || null,
      displayOrder: image.displayOrder || this.milestoneImageItems.size,
      createdAt: now
    };
    
    this.milestoneImageItems.set(id, newImage);
    return newImage;
  }

  async updateMilestoneImage(id: number, image: Partial<InsertMilestoneImage>): Promise<MilestoneImage | undefined> {
    const existingImage = this.milestoneImageItems.get(id);
    if (!existingImage) return undefined;
    
    const updatedImage: MilestoneImage = {
      ...existingImage,
      milestoneId: image.milestoneId ?? existingImage.milestoneId,
      imageUrl: image.imageUrl ?? existingImage.imageUrl,
      alt: image.alt !== undefined ? image.alt : existingImage.alt,
      displayOrder: image.displayOrder ?? existingImage.displayOrder
    };
    
    this.milestoneImageItems.set(id, updatedImage);
    return updatedImage;
  }

  async deleteMilestoneImage(id: number): Promise<boolean> {
    return this.milestoneImageItems.delete(id);
  }

  async updateMilestoneImageOrder(ids: number[]): Promise<boolean> {
    try {
      ids.forEach((id, index) => {
        const image = this.milestoneImageItems.get(id);
        if (image) {
          image.displayOrder = index;
          this.milestoneImageItems.set(id, image);
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating milestone image order:', error);
      return false;
    }
  }


}

// Switch from MemStorage to DatabaseStorage to use PostgreSQL database
// export const storage = new DatabaseStorage();
export const storage = new MemStorage();

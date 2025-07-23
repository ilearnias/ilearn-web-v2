import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTopperSchema, 
  insertTestimonialSchema, 
  insertProgramSchema, 
  insertMediaSchema, 
  insertContactSchema,
  insertAppFeatureSchema,
  insertAppRatingSchema,
  insertSiteSettingSchema,
  insertBlogCategorySchema,
  insertBlogPostSchema,
  mediaTypeEnum,
  aspectRatioEnum
} from "@shared/schema";
import { ZodError } from "zod";

// Simple auth middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // For development, use hardcoded credentials
      // In production, replace with proper authentication
      if (username === "admin" && password === "admin") {
        if (req.session) {
          req.session.authenticated = true;
          req.session.userId = 1; // mock admin user ID
        }
        return res.json({ message: "Authentication successful" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (user && user.password === password) {
        if (req.session) {
          req.session.authenticated = true;
          req.session.userId = user.id;
        }
        return res.json({ message: "Authentication successful" });
      }
      
      res.status(401).json({ message: "Invalid credentials" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  
  app.get("/api/auth/check", (req, res) => {
    if (req.session && req.session.authenticated) {
      return res.json({ authenticated: true });
    }
    res.status(401).json({ authenticated: false });
  });
  
  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Not logged in" });
    }
  });

  // Error handler for validation
  const handleValidationError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: err.errors 
      });
    }
    console.error("API Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  };

  // TESTIMONIALS ROUTES
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/text", async (_req, res) => {
    try {
      const textTestimonials = await storage.getTestimonialsByType("text");
      res.json(textTestimonials);
    } catch (err) {
      console.error("Error fetching text testimonials:", err);
      res.status(500).json({ message: "Failed to fetch text testimonials" });
    }
  });

  app.get("/api/testimonials/video", async (_req, res) => {
    try {
      const portraitVideos = await storage.getTestimonialsByType("portrait-video");
      const landscapeVideos = await storage.getTestimonialsByType("landscape-video");
      const videoTestimonials = [...portraitVideos, ...landscapeVideos];
      res.json(videoTestimonials);
    } catch (err) {
      console.error("Error fetching video testimonials:", err);
      res.status(500).json({ message: "Failed to fetch video testimonials" });
    }
  });

  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const testimonial = await storage.getTestimonialById(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (err) {
      console.error("Error fetching testimonial:", err);
      res.status(500).json({ message: "Failed to fetch testimonial" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(newTestimonial);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const testimonialData = insertTestimonialSchema.partial().parse(req.body);
      const updatedTestimonial = await storage.updateTestimonial(id, testimonialData);
      
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(updatedTestimonial);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteTestimonial(id);
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // TOPPERS/RESULTS ROUTES
  app.get("/api/toppers", async (req, res) => {
    try {
      const { year, program } = req.query;
      
      let toppers;
      if (year && !isNaN(Number(year))) {
        toppers = await storage.getToppersByYear(Number(year));
      } else if (program && typeof program === 'string') {
        toppers = await storage.getToppersByProgram(program);
      } else {
        toppers = await storage.getToppers();
      }
      
      res.json(toppers);
    } catch (err) {
      console.error("Error fetching toppers:", err);
      res.status(500).json({ message: "Failed to fetch toppers" });
    }
  });

  app.get("/api/toppers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const topper = await storage.getTopperById(id);
      if (!topper) {
        return res.status(404).json({ message: "Topper not found" });
      }
      
      res.json(topper);
    } catch (err) {
      console.error("Error fetching topper:", err);
      res.status(500).json({ message: "Failed to fetch topper" });
    }
  });

  app.post("/api/toppers", async (req, res) => {
    try {
      const topperData = insertTopperSchema.parse(req.body);
      const newTopper = await storage.createTopper(topperData);
      res.status(201).json(newTopper);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/toppers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const topperData = insertTopperSchema.partial().parse(req.body);
      const updatedTopper = await storage.updateTopper(id, topperData);
      
      if (!updatedTopper) {
        return res.status(404).json({ message: "Topper not found" });
      }
      
      res.json(updatedTopper);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/toppers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteTopper(id);
      if (!success) {
        return res.status(404).json({ message: "Topper not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting topper:", err);
      res.status(500).json({ message: "Failed to delete topper" });
    }
  });

  // PROGRAMS ROUTES
  app.get("/api/programs", async (_req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (err) {
      console.error("Error fetching programs:", err);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Check if parameter is a number (id) or string (slug)
      const id = parseInt(slug);
      let program;
      
      if (!isNaN(id)) {
        program = await storage.getProgramById(id);
      } else {
        program = await storage.getProgramBySlug(slug);
      }
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(program);
    } catch (err) {
      console.error("Error fetching program:", err);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.get("/api/programs/:slug/testimonials", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // First, get the program to access its testimonial IDs
      let program;
      const id = parseInt(slug);
      
      if (!isNaN(id)) {
        program = await storage.getProgramById(id);
      } else {
        program = await storage.getProgramBySlug(slug);
      }
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      // Now get all testimonials
      const allTestimonials = await storage.getTestimonials();
      
      // Filter testimonials by the program's testimonial IDs
      const programTestimonials = allTestimonials.filter(
        testimonial => program?.testimonials?.includes(testimonial.id)
      );
      
      res.json(programTestimonials);
    } catch (err) {
      console.error("Error fetching program testimonials:", err);
      res.status(500).json({ message: "Failed to fetch program testimonials" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const programData = insertProgramSchema.parse(req.body);
      const newProgram = await storage.createProgram(programData);
      res.status(201).json(newProgram);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const programData = insertProgramSchema.partial().parse(req.body);
      const updatedProgram = await storage.updateProgram(id, programData);
      
      if (!updatedProgram) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.json(updatedProgram);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteProgram(id);
      if (!success) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting program:", err);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  // MEDIA ROUTES
  app.get("/api/media", async (_req, res) => {
    try {
      const mediaItems = await storage.getMediaItems();
      res.json(mediaItems);
    } catch (err) {
      console.error("Error fetching media items:", err);
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const mediaItem = await storage.getMediaById(id);
      if (!mediaItem) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      res.json(mediaItem);
    } catch (err) {
      console.error("Error fetching media item:", err);
      res.status(500).json({ message: "Failed to fetch media item" });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      
      // Auto-detect media type and aspect ratio if not provided
      if (!mediaData.type || !mediaData.aspectRatio) {
        // YouTube video detection
        if (mediaData.mediaUrl.includes('youtube.com/watch') || 
            mediaData.mediaUrl.includes('youtu.be') || 
            mediaData.mediaUrl.includes('youtube.com/shorts')) {
          
          // Set media type to video
          mediaData.type = 'video';
          
          // YouTube shorts have vertical/portrait aspect ratio
          if (mediaData.mediaUrl.includes('youtube.com/shorts')) {
            mediaData.aspectRatio = 'portrait';
          } else {
            // Regular YouTube videos are landscape by default
            mediaData.aspectRatio = mediaData.aspectRatio || 'landscape';
          }
        }
        // Image detection (if URL ends with image extension)
        else if (/\.(jpeg|jpg|gif|png|webp)$/i.test(mediaData.mediaUrl)) {
          mediaData.type = 'image';
          mediaData.aspectRatio = mediaData.aspectRatio || 'landscape';
        }
        // Default fallback
        else {
          mediaData.type = mediaData.type || 'image';
          mediaData.aspectRatio = mediaData.aspectRatio || 'landscape';
        }
      }
      
      // Auto-generate thumbnail if not provided
      if (!mediaData.thumbnailUrl && mediaData.mediaUrl) {
        // YouTube video
        if (mediaData.type === 'video' && 
            (mediaData.mediaUrl.includes('youtube.com/watch') || 
             mediaData.mediaUrl.includes('youtu.be') || 
             mediaData.mediaUrl.includes('youtube.com/shorts'))) {
          
          let videoId = '';
          
          if (mediaData.mediaUrl.includes('youtube.com/watch')) {
            // Format: https://www.youtube.com/watch?v=VIDEO_ID
            const urlParams = new URL(mediaData.mediaUrl).searchParams;
            videoId = urlParams.get('v') || '';
          } else if (mediaData.mediaUrl.includes('youtu.be')) {
            // Format: https://youtu.be/VIDEO_ID
            videoId = mediaData.mediaUrl.split('/').pop() || '';
            // Remove any query parameters
            videoId = videoId?.split('?')[0] || '';
          } else if (mediaData.mediaUrl.includes('youtube.com/shorts')) {
            // Format: https://www.youtube.com/shorts/VIDEO_ID
            const shortsPath = mediaData.mediaUrl.split('/shorts/');
            if (shortsPath.length > 1) {
              videoId = shortsPath[1].split('?')[0]; // Remove query parameters
            }
          }
          
          // Set thumbnail URL for YouTube video
          if (videoId) {
            mediaData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }
        // Image - use the same URL for thumbnail
        else if (mediaData.type === 'image' && /\.(jpeg|jpg|gif|png|webp)$/i.test(mediaData.mediaUrl)) {
          mediaData.thumbnailUrl = mediaData.mediaUrl;
        }
      }
      
      const newMedia = await storage.createMedia(mediaData);
      res.status(201).json(newMedia);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const mediaData = insertMediaSchema.partial().parse(req.body);
      
      // Get existing media to check if we need to update thumbnail
      const existingMedia = await storage.getMediaById(id);
      if (!existingMedia) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      // If mediaUrl or type/aspectRatio is updated and no new thumbnail is provided
      if ((mediaData.mediaUrl || mediaData.type || mediaData.aspectRatio) && !mediaData.thumbnailUrl) {
        const updatedUrl = mediaData.mediaUrl || existingMedia.mediaUrl;
        const updatedType = mediaData.type || existingMedia.type;
        
        // YouTube video
        if (updatedType === 'video' && 
            (updatedUrl.includes('youtube.com/watch') || 
             updatedUrl.includes('youtu.be') || 
             updatedUrl.includes('youtube.com/shorts'))) {
          
          let videoId = '';
          
          if (updatedUrl.includes('youtube.com/watch')) {
            // Format: https://www.youtube.com/watch?v=VIDEO_ID
            const urlParams = new URL(updatedUrl).searchParams;
            videoId = urlParams.get('v') || '';
          } else if (updatedUrl.includes('youtu.be')) {
            // Format: https://youtu.be/VIDEO_ID
            videoId = updatedUrl.split('/').pop() || '';
            // Remove any query parameters
            videoId = videoId?.split('?')[0] || '';
          } else if (updatedUrl.includes('youtube.com/shorts')) {
            // Format: https://www.youtube.com/shorts/VIDEO_ID
            const shortsPath = updatedUrl.split('/shorts/');
            if (shortsPath.length > 1) {
              videoId = shortsPath[1].split('?')[0]; // Remove query parameters
            }
          }
          
          // Set thumbnail URL for YouTube video
          if (videoId) {
            mediaData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }
        // Image - use the same URL for thumbnail
        else if (updatedType === 'image' && /\.(jpeg|jpg|gif|png|webp)$/i.test(updatedUrl)) {
          mediaData.thumbnailUrl = updatedUrl;
        }
      }
      
      const updatedMedia = await storage.updateMedia(id, mediaData);
      res.json(updatedMedia);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteMedia(id);
      if (!success) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting media item:", err);
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  // CONTACT FORM ROUTES
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const newContact = await storage.createContact(contactData);
      res.status(201).json({ 
        message: "Your message has been sent successfully!",
        contactId: newContact.id
      });
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Admin routes for contact management
  app.get("/api/contact", async (_req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // APP FEATURES ROUTES
  app.get("/api/features", async (_req, res) => {
    try {
      const features = await storage.getAppFeatures();
      res.json(features);
    } catch (err) {
      console.error("Error fetching app features:", err);
      res.status(500).json({ message: "Failed to fetch app features" });
    }
  });

  app.post("/api/features", async (req, res) => {
    try {
      const featureData = insertAppFeatureSchema.parse(req.body);
      const newFeature = await storage.createAppFeature(featureData);
      res.status(201).json(newFeature);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // APP RATINGS ROUTES
  app.get("/api/ratings", async (_req, res) => {
    try {
      const ratings = await storage.getAppRatings();
      res.json(ratings);
    } catch (err) {
      console.error("Error fetching app ratings:", err);
      res.status(500).json({ message: "Failed to fetch app ratings" });
    }
  });

  app.post("/api/ratings", async (req, res) => {
    try {
      const ratingData = insertAppRatingSchema.parse(req.body);
      const newRating = await storage.createAppRating(ratingData);
      res.status(201).json(newRating);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // SITE SETTINGS ROUTES
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (err) {
      console.error("Error fetching settings:", err);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.json(setting);
    } catch (err) {
      console.error("Error fetching setting:", err);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });
  
  app.put("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      
      if (value === undefined) {
        return res.status(400).json({ message: "Setting value is required" });
      }
      
      const updatedSetting = await storage.updateSetting(key, value);
      res.json(updatedSetting);
    } catch (err) {
      console.error("Error updating setting:", err);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });
  
  // BLOG ROUTES
  // Categories
  app.get("/api/blog/categories", async (_req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (err) {
      console.error("Error fetching blog categories:", err);
      res.status(500).json({ message: "Failed to fetch blog categories" });
    }
  });
  
  app.post("/api/blog/categories", async (req, res) => {
    try {
      const categoryData = insertBlogCategorySchema.parse(req.body);
      const newCategory = await storage.createBlogCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  // Posts
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { categoryId, slug, limit, offset } = req.query;
      let posts;
      
      if (categoryId && !isNaN(Number(categoryId))) {
        posts = await storage.getBlogPostsByCategoryId(Number(categoryId));
      } else if (slug && typeof slug === 'string') {
        const category = await storage.getBlogCategoryBySlug(slug);
        if (category) {
          posts = await storage.getBlogPostsByCategoryId(category.id);
        } else {
          posts = [];
        }
      } else {
        const limitNumber = limit && !isNaN(Number(limit)) ? Number(limit) : undefined;
        const offsetNumber = offset && !isNaN(Number(offset)) ? Number(offset) : undefined;
        posts = await storage.getBlogPosts(limitNumber, offsetNumber);
      }
      
      res.json(posts);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  
  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Check if parameter is a number (id) or string (slug)
      const id = parseInt(slug);
      let post;
      
      if (!isNaN(id)) {
        post = await storage.getBlogPostById(id);
      } else {
        post = await storage.getBlogPostBySlug(slug);
      }
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (err) {
      console.error("Error fetching blog post:", err);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  
  app.post("/api/blog/posts", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const newPost = await storage.createBlogPost(postData);
      res.status(201).json(newPost);
    } catch (err) {
      handleValidationError(err, res);
    }
  });
  
  app.put("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updateBlogPost(id, postData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(updatedPost);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // Create an HTTP server
  const server = createServer(app);
  
  return server;
}

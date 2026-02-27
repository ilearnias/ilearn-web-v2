import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { videoUpload, imageUpload, handleUploadError, getPublicUrl } from "./upload-handler";
import path from "path";
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
  insertGalleryEventSchema,
  insertAboutPageImageSchema,
  insertMilestoneSchema,
  insertMilestoneImageSchema,
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
  // Serve static files from public directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // File upload route for videos
  app.post('/api/upload/video', videoUpload.single('video'), handleUploadError, (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get the file path and generate public URL
    const filename = req.file.filename;
    const fileUrl = getPublicUrl(filename);
    
    // Return the file details including public URL
    res.status(201).json({
      url: fileUrl,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename
    });
  });
  
  // File upload route for images
  app.post('/api/upload/image', imageUpload.single('image'), handleUploadError, (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get the file path and generate public URL
    const filename = req.file.filename;
    const fileUrl = getPublicUrl(filename);
    
    // Return the file details including public URL
    res.status(201).json({
      url: fileUrl,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename
    });
  });

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
  app.get("/api/testimonials", async (req, res) => {
    try {
      // Set headers to prevent caching to ensure fresh data
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Vary', 'Origin, Accept-Encoding');
      
      const type = req.query.type as string;
      
      if (type) {
        // Filter by type if provided
        let testimonials;
        
        if (type === 'video') {
          // Special case to return all video types
          const portraitVideos = await storage.getTestimonialsByType("portrait-video");
          const landscapeVideos = await storage.getTestimonialsByType("landscape-video");
          testimonials = [...portraitVideos, ...landscapeVideos];
        } else {
          // Specific type filtering
          testimonials = await storage.getTestimonialsByType(type);
        }
        
        return res.json(testimonials);
      }
      
      // No type filter, return all testimonials
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
      
      // If there's a programId in the request, associate this testimonial with the program
      const programId = req.body.programId;
      if (programId && !isNaN(parseInt(programId))) {
        const program = await storage.getProgramById(parseInt(programId));
        if (program) {
          // Determine if this is a video or student testimonial based on type
          const isVideo = newTestimonial.type.includes('video');
          
          // Update the program with this testimonial ID
          if (isVideo) {
            // For video testimonials
            const videoTestimonials = program.videoTestimonials || [];
            await storage.updateProgram(program.id, {
              videoTestimonials: [...videoTestimonials, newTestimonial.id]
            });
          } else {
            // For student testimonials (with image)
            const studentTestimonials = program.studentTestimonials || [];
            await storage.updateProgram(program.id, {
              studentTestimonials: [...studentTestimonials, newTestimonial.id]
            });
          }
        }
      }
      
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
  // SEO: Sitemap
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://www.ilearnias.com";
    const today = new Date().toISOString().split("T")[0];
    const staticRoutes = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/about", priority: "0.8", changefreq: "monthly" },
      { url: "/results", priority: "0.9", changefreq: "monthly" },
      { url: "/programs", priority: "0.9", changefreq: "monthly" },
      { url: "/programs/prelims-cum-mains", priority: "0.9", changefreq: "monthly" },
      { url: "/programs/current-affairs-news-analysis", priority: "0.8", changefreq: "monthly" },
      { url: "/blog", priority: "0.8", changefreq: "weekly" },
      { url: "/gallery", priority: "0.6", changefreq: "monthly" },
      { url: "/app", priority: "0.7", changefreq: "monthly" },
      { url: "/contact", priority: "0.7", changefreq: "yearly" },
    ];
    const urlTags = staticRoutes
      .map(
        (r) => `  <url>
    <loc>${baseUrl}${r.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
      )
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  });

  // SEO: Robots.txt (also served via static file, this is a fallback)
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://www.ilearnias.com/sitemap.xml`);
  });

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
      
      // Try database first, fallback to static data if database is unavailable
      try {
        if (!isNaN(id)) {
          program = await storage.getProgramById(id);
        } else {
          program = await storage.getProgramBySlug(slug);
        }
      } catch (dbError) {
        console.log("Database unavailable, using static program data");
        
        // Fallback program data - using the updated Mains Mastery Program data
        const staticPrograms = [
          {
            id: 3,
            slug: 'mains-test-series',
            title: 'Mains Mastery Program (MMP)',
            description: 'Comprehensive Mains preparation program featuring daily answer writing practice, masterclasses by expert faculty, and guidance from successful UPSC toppers with proven track records.',
            icon: 'ri-file-text-line',
            duration: '3.5 months (May - August)',
            usp: [
              'Daily Answer Writing Sessions with expert evaluation',
              'Masterclasses by highly qualified faculty',
              'Sessions by UPSC toppers (AIR 81, 169, 357, 822)',
              'Complete coverage of all GS papers and Essay',
              'Specialized sessions on Ethics, Current Affairs, and Optional subjects',
              'Subject-wise expert mentorship',
              'Progressive skill development from basics to advanced',
              'Regular feedback and performance tracking',
              'Comprehensive study materials and resources',
              'Small batch sizes for personalized attention'
            ],
            video: 'https://youtu.be/8Nk4JuCarU4?si=3bl402h0xelqtoA0',
            fees: 'Contact for details',
            testimonials: [1, 2, 3, 4, 5],
            faq: [
              {
                question: 'What makes MMP different from other mains programs?',
                answer: 'MMP features daily answer writing practice with evaluation by expert faculty, masterclasses by subject specialists, and direct guidance from UPSC toppers with impressive ranks like AIR 81, 169, 357, and 822.'
              },
              {
                question: 'Who are the faculty members teaching in MMP?',
                answer: 'Our faculty includes Nikhil Lohithakshan (Answer Writing & Geography), Reenu Anna Mathew (AIR 81 - Economic Development), Vineeth Lohidakshan (AIR 169 - Governance & Environment), Dr. Jayesh Khaddar (Essay), and other subject experts.'
              },
              {
                question: 'How is the daily answer writing structured?',
                answer: 'The program includes daily answer writing sessions starting from June 9th, with masterclasses complementing the practice. Each session focuses on specific topics with immediate feedback and improvement techniques.'
              },
              {
                question: 'What subjects are covered in the program?',
                answer: 'Complete coverage includes History, Geography, Polity & Constitution, Economic Development, Science & Technology, Environment & Disaster Management, Ethics, International Relations, Internal Security, Governance, Social Justice, Art & Culture, and Essay writing.'
              },
              {
                question: 'When does the MMP 2025 batch commence?',
                answer: 'The program starts on May 28, 2025, with answer writing sessions beginning from June 8th onwards. The comprehensive schedule runs through August 2025.'
              }
            ]
          }
        ];
        
        if (!isNaN(id)) {
          program = staticPrograms.find(p => p.id === id);
        } else {
          program = staticPrograms.find(p => p.slug === slug);
        }
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
      const type = req.query.type as string; // 'video' or 'student'
      
      // Try database first, fallback to static data if database is unavailable
      try {
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
        
        if (type === 'video') {
          // Filter video testimonials by the program's videoTestimonials IDs
          const videoTestimonials = allTestimonials.filter(
            testimonial => program?.videoTestimonials?.includes(testimonial.id)
          );
          return res.json(videoTestimonials);
        } else if (type === 'student') {
          // Filter student testimonials by the program's studentTestimonials IDs
          const studentTestimonials = allTestimonials.filter(
            testimonial => program?.studentTestimonials?.includes(testimonial.id)
          );
          return res.json(studentTestimonials);
        } else {
          // If no type is specified, return both types combined
          const videoTestimonials = allTestimonials.filter(
            testimonial => program?.videoTestimonials?.includes(testimonial.id)
          );
          const studentTestimonials = allTestimonials.filter(
            testimonial => program?.studentTestimonials?.includes(testimonial.id)
          );
          return res.json([...videoTestimonials, ...studentTestimonials]);
        }
      } catch (dbError) {
        console.log("Database unavailable, using static testimonial data");
        
        // Fallback testimonial data for Mains Mastery Program
        if (slug === 'mains-test-series') {
          const staticTestimonials = [
            {
              id: 1001,
              name: 'MMP Student Success Story',
              type: 'landscape-video',
              video: 'https://youtu.be/Vl3yvMlcsa4?si=qMR6ZCm0DTp3OS27',
              image: 'https://img.youtube.com/vi/Vl3yvMlcsa4/hqdefault.jpg',
              aspectRatio: 'landscape',
              displayOrder: 1,
              createdAt: new Date().toISOString()
            }
          ];
          
          if (type === 'video') {
            return res.json(staticTestimonials);
          } else {
            return res.json(staticTestimonials);
          }
        }
        
        // For other programs, return empty array
        return res.json([]);
      }
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

  // Update program display order
  app.patch("/api/programs/order", async (req, res) => {
    try {
      const { programs } = req.body;
      
      if (!Array.isArray(programs)) {
        return res.status(400).json({ message: "Programs must be an array" });
      }
      
      // Validate that each item has id and displayOrder
      const validPrograms = programs.every(item => 
        typeof item === 'object' && 
        item !== null && 
        'id' in item && 
        'displayOrder' in item && 
        !isNaN(Number(item.id)) &&
        !isNaN(Number(item.displayOrder))
      );
      
      if (!validPrograms) {
        return res.status(400).json({ 
          message: "Each program must have a valid id and displayOrder" 
        });
      }
      
      // Update each program's display order
      const updatePromises = programs.map(item => 
        storage.updateProgram(item.id, { displayOrder: item.displayOrder })
      );
      
      await Promise.all(updatePromises);
      
      res.json({ success: true });
    } catch (err) {
      console.error("Error updating program order:", err);
      res.status(500).json({ message: "Failed to update program order" });
    }
  });

  // MEDIA ROUTES
  app.get("/api/media", async (_req, res) => {
    try {
      // Set headers to prevent caching so clients always get fresh data
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Vary', 'Origin, Accept-Encoding');
      // Set a random ETag to force clients to consider the response as new
      res.setHeader('ETag', Date.now().toString());
      
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
      let mediaData = insertMediaSchema.parse(req.body);
      
      // Import the media helpers
      const { processMediaItem } = await import('./media-helpers');
      
      // Process the media item to ensure it has all required fields
      mediaData = processMediaItem(mediaData);
      
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
      
      // Set headers to prevent caching
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Vary', 'Origin, Accept-Encoding');
      res.setHeader('ETag', Date.now().toString());
      
      let mediaData = insertMediaSchema.partial().parse(req.body);
      
      // Get existing media to check if we need to update thumbnail
      const existingMedia = await storage.getMediaById(id);
      if (!existingMedia) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      // If media URL, type or aspect ratio is changing, use our helper functions to update
      if (mediaData.mediaUrl || mediaData.type || mediaData.aspectRatio) {
        // Import the media helpers
        const { processMediaItem } = await import('./media-helpers');
        
        // Create a complete media object by merging existing data with updates
        const mergedData = {
          ...existingMedia,
          ...mediaData,
        };
        
        // Process the merged data to ensure all fields are consistent
        const processedData = processMediaItem(mergedData);
        
        // Only update thumbnail if one wasn't explicitly provided
        if (!mediaData.thumbnailUrl && processedData.thumbnailUrl !== existingMedia.thumbnailUrl) {
          mediaData.thumbnailUrl = processedData.thumbnailUrl;
        }
        
        // Update type and aspectRatio if they were auto-detected and different
        if (!mediaData.type && processedData.type !== existingMedia.type) {
          mediaData.type = processedData.type;
        }
        
        if (!mediaData.aspectRatio && processedData.aspectRatio !== existingMedia.aspectRatio) {
          mediaData.aspectRatio = processedData.aspectRatio;
        }
      }
      
      const updatedMedia = await storage.updateMedia(id, mediaData);
      res.json(updatedMedia);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  // GALLERY EVENTS ROUTES
  app.get("/api/gallery-events", async (_req, res) => {
    try {
      console.log('Fetching gallery events');
      const events = await storage.getGalleryEvents();
      console.log('Gallery events:', events);
      res.json(events);
    } catch (err) {
      console.error("Error fetching gallery events:", err);
      res.status(500).json({ message: "Failed to fetch gallery events" });
    }
  });

  app.get("/api/gallery-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const event = await storage.getGalleryEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Gallery event not found" });
      }
      
      res.json(event);
    } catch (err) {
      console.error("Error fetching gallery event:", err);
      res.status(500).json({ message: "Failed to fetch gallery event" });
    }
  });

  app.get("/api/gallery-events/:id/media", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const event = await storage.getGalleryEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Gallery event not found" });
      }
      
      // If event has no media, return empty array
      if (!event.mediaIds || event.mediaIds.length === 0) {
        return res.json([]);
      }
      
      // Fetch all media items for this event
      const allMedia = await storage.getMediaItems();
      const eventMedia = allMedia.filter(item => event.mediaIds?.includes(item.id));
      
      // Sort by display order if available
      eventMedia.sort((a, b) => {
        if (a.displayOrder !== null && b.displayOrder !== null) {
          return a.displayOrder - b.displayOrder;
        }
        return 0;
      });
      
      res.json(eventMedia);
    } catch (err) {
      console.error("Error fetching event media:", err);
      res.status(500).json({ message: "Failed to fetch event media" });
    }
  });

  app.post("/api/gallery-events", authMiddleware, async (req, res) => {
    try {
      const eventData = insertGalleryEventSchema.parse(req.body);
      const newEvent = await storage.createGalleryEvent(eventData);
      res.status(201).json(newEvent);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/gallery-events/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const eventData = insertGalleryEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateGalleryEvent(id, eventData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Gallery event not found" });
      }
      
      res.json(updatedEvent);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/gallery-events-order", authMiddleware, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "IDs must be an array" });
      }
      
      const success = await storage.updateGalleryEventOrder(ids);
      if (!success) {
        return res.status(500).json({ message: "Failed to update order" });
      }
      
      console.log("Successfully updated gallery event order with ids:", ids);
      res.json({ message: "Order updated successfully" });
    } catch (err) {
      console.error("Error updating gallery events order:", err);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete("/api/gallery-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      console.log('Attempting to delete gallery event with ID:', id);
      
      // Get the event first to verify it exists
      const event = await storage.getGalleryEventById(id);
      console.log('Event to delete:', event);
      
      if (!event) {
        console.log('Gallery event not found in database');
        return res.status(404).json({ message: "Gallery event not found" });
      }
      
      const success = await storage.deleteGalleryEvent(id);
      console.log('Delete operation result:', success);
      
      if (!success) {
        return res.status(404).json({ message: "Gallery event not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting gallery event:", err);
      res.status(500).json({ message: "Failed to delete gallery event" });
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

  // YouTube video endpoint for gallery events
  app.post("/api/media/youtube", authMiddleware, async (req, res) => {
    try {
      const { youtubeUrl, galleryEventId, aspectRatio = null } = req.body;
      
      if (!youtubeUrl) {
        return res.status(400).json({ message: "YouTube URL is required" });
      }
      
      // Extract YouTube video information
      const { extractYoutubeVideoId, getYoutubeThumbnailUrl, getYoutubeEmbedUrl } = await import('./media-helpers');
      const videoId = extractYoutubeVideoId(youtubeUrl);
      if (!videoId) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }
      
      // Determine if this is a Shorts video
      const isShort = youtubeUrl.includes('/shorts/');
      const detectedAspectRatio = isShort ? 'portrait' : 'landscape';
      
      // Create media entry
      const mediaData = {
        title: req.body.title || 'YouTube Video', // Use provided title or default
        description: req.body.description || '',
        type: 'video',
        aspectRatio: aspectRatio || detectedAspectRatio,
        mediaUrl: youtubeUrl,
        thumbnailUrl: getYoutubeThumbnailUrl(youtubeUrl),
        embedUrl: getYoutubeEmbedUrl(youtubeUrl),
      };
      
      // Process and insert the new media
      const newMedia = await storage.createMedia(mediaData);
      
      // If a gallery event ID was provided, associate this media with that event
      if (galleryEventId) {
        const events = await storage.getGalleryEvents();
        const galleryEvent = events.find(e => e.id === parseInt(galleryEventId));
        
        if (galleryEvent) {
          // Get current media IDs or initialize empty array
          const currentMediaIds = galleryEvent.mediaIds || [];
          
          // Add the new media ID
          const updatedMediaIds = [...currentMediaIds, newMedia.id];
          
          // Update the gallery event with the new media ID
          await storage.updateGalleryEvent(galleryEvent.id, { mediaIds: updatedMediaIds });
        }
      }
      
      res.status(201).json(newMedia);
    } catch (err) {
      console.error("Error adding YouTube video:", err);
      res.status(500).json({ message: "Failed to add YouTube video" });
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
        const { posts: categoryPosts } = await storage.getBlogPosts({
          categoryId: Number(categoryId)
        });
        posts = categoryPosts;
      } else if (slug && typeof slug === 'string') {
        const { posts: categoryPosts } = await storage.getBlogPosts({
          categorySlug: slug
        });
        posts = categoryPosts;
      } else {
        const limitNumber = limit && !isNaN(Number(limit)) ? Number(limit) : undefined;
        const offsetNumber = offset && !isNaN(Number(offset)) ? Number(offset) : undefined;
        const { posts: allPosts } = await storage.getBlogPosts({
          limit: limitNumber,
          offset: offsetNumber
        });
        posts = allPosts;
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

  // ABOUT PAGE IMAGES ROUTES
  app.get("/api/about-page-images", async (req, res) => {
    try {
      const section = req.query.section as string;
      let images;
      
      if (section) {
        images = await storage.getAboutPageImages(section);
      } else {
        images = await storage.getAboutPageImages();
      }
      
      res.json(images);
    } catch (err) {
      console.error("Error fetching about page images:", err);
      res.status(500).json({ message: "Failed to fetch about page images" });
    }
  });

  app.get("/api/about-page-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const image = await storage.getAboutPageImageById(id);
      if (!image) {
        return res.status(404).json({ message: "About page image not found" });
      }
      
      res.json(image);
    } catch (err) {
      console.error("Error fetching about page image:", err);
      res.status(500).json({ message: "Failed to fetch about page image" });
    }
  });

  app.post("/api/about-page-images", authMiddleware, async (req, res) => {
    try {
      const imageData = insertAboutPageImageSchema.parse(req.body);
      const newImage = await storage.createAboutPageImage(imageData);
      res.status(201).json(newImage);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/about-page-images/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const imageData = insertAboutPageImageSchema.partial().parse(req.body);
      const updatedImage = await storage.updateAboutPageImage(id, imageData);
      
      if (!updatedImage) {
        return res.status(404).json({ message: "About page image not found" });
      }
      
      res.json(updatedImage);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.delete("/api/about-page-images/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteAboutPageImage(id);
      if (!success) {
        return res.status(404).json({ message: "About page image not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting about page image:", err);
      res.status(500).json({ message: "Failed to delete about page image" });
    }
  });

  // Update display order of about page images
  app.post("/api/about-page-images-order", authMiddleware, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "Invalid request format. Expected 'ids' array." });
      }
      
      const success = await storage.updateAboutPageImageOrder(ids);
      if (!success) {
        return res.status(500).json({ message: "Failed to update about page image order" });
      }
      
      res.json({ message: "About page image order updated successfully" });
    } catch (err) {
      console.error("Error updating about page image order:", err);
      res.status(500).json({ message: "Failed to update about page image order" });
    }
  });

  // MILESTONES ROUTES
  app.get("/api/milestones", async (_req, res) => {
    try {
      const milestones = await storage.getMilestones();
      res.json(milestones);
    } catch (err) {
      console.error("Error fetching milestones:", err);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  app.get("/api/milestones/default", async (_req, res) => {
    try {
      const defaultMilestone = await storage.getDefaultMilestone();
      if (!defaultMilestone) {
        return res.status(404).json({ message: "No default milestone found" });
      }
      res.json(defaultMilestone);
    } catch (err) {
      console.error("Error fetching default milestone:", err);
      res.status(500).json({ message: "Failed to fetch default milestone" });
    }
  });

  app.get("/api/milestones/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const milestone = await storage.getMilestoneById(id);
      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      res.json(milestone);
    } catch (err) {
      console.error("Error fetching milestone:", err);
      res.status(500).json({ message: "Failed to fetch milestone" });
    }
  });

  app.post("/api/milestones", authMiddleware, async (req, res) => {
    try {
      const milestoneData = insertMilestoneSchema.parse(req.body);
      const newMilestone = await storage.createMilestone(milestoneData);
      res.status(201).json(newMilestone);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/milestones/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const milestoneData = insertMilestoneSchema.partial().parse(req.body);
      const updatedMilestone = await storage.updateMilestone(id, milestoneData);
      
      if (!updatedMilestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      res.json(updatedMilestone);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.patch("/api/milestones/order", authMiddleware, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.some(id => isNaN(parseInt(id)))) {
        return res.status(400).json({ message: "Invalid IDs format" });
      }
      
      const success = await storage.updateMilestoneOrder(ids.map(id => parseInt(id)));
      if (!success) {
        return res.status(500).json({ message: "Failed to update milestone order" });
      }
      
      res.json({ message: "Milestone order updated successfully" });
    } catch (err) {
      console.error("Error updating milestone order:", err);
      res.status(500).json({ message: "Failed to update milestone order" });
    }
  });

  app.patch("/api/milestones/:id/default", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.setDefaultMilestone(id);
      if (!success) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      res.json({ message: "Default milestone set successfully" });
    } catch (err) {
      console.error("Error setting default milestone:", err);
      res.status(500).json({ message: "Failed to set default milestone" });
    }
  });

  app.delete("/api/milestones/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteMilestone(id);
      if (!success) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting milestone:", err);
      res.status(500).json({ message: "Failed to delete milestone" });
    }
  });

  // MILESTONE IMAGES ROUTES
  app.get("/api/milestones/:milestoneId/images", async (req, res) => {
    try {
      const milestoneId = parseInt(req.params.milestoneId);
      if (isNaN(milestoneId)) {
        return res.status(400).json({ message: "Invalid milestone ID format" });
      }
      
      const images = await storage.getMilestoneImages(milestoneId);
      res.json(images);
    } catch (err) {
      console.error("Error fetching milestone images:", err);
      res.status(500).json({ message: "Failed to fetch milestone images" });
    }
  });

  app.get("/api/milestone-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const image = await storage.getMilestoneImageById(id);
      if (!image) {
        return res.status(404).json({ message: "Milestone image not found" });
      }
      
      res.json(image);
    } catch (err) {
      console.error("Error fetching milestone image:", err);
      res.status(500).json({ message: "Failed to fetch milestone image" });
    }
  });

  app.post("/api/milestone-images", authMiddleware, async (req, res) => {
    try {
      const imageData = insertMilestoneImageSchema.parse(req.body);
      const newImage = await storage.createMilestoneImage(imageData);
      res.status(201).json(newImage);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.put("/api/milestone-images/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const imageData = insertMilestoneImageSchema.partial().parse(req.body);
      const updatedImage = await storage.updateMilestoneImage(id, imageData);
      
      if (!updatedImage) {
        return res.status(404).json({ message: "Milestone image not found" });
      }
      
      res.json(updatedImage);
    } catch (err) {
      handleValidationError(err, res);
    }
  });

  app.patch("/api/milestone-images/order", authMiddleware, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.some(id => isNaN(parseInt(id)))) {
        return res.status(400).json({ message: "Invalid IDs format" });
      }
      
      const success = await storage.updateMilestoneImageOrder(ids.map(id => parseInt(id)));
      if (!success) {
        return res.status(500).json({ message: "Failed to update milestone image order" });
      }
      
      res.json({ message: "Milestone image order updated successfully" });
    } catch (err) {
      console.error("Error updating milestone image order:", err);
      res.status(500).json({ message: "Failed to update milestone image order" });
    }
  });

  app.delete("/api/milestone-images/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteMilestoneImage(id);
      if (!success) {
        return res.status(404).json({ message: "Milestone image not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting milestone image:", err);
      res.status(500).json({ message: "Failed to delete milestone image" });
    }
  });

  // Create an HTTP server
  const server = createServer(app);
  
  return server;
}

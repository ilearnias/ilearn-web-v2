export const API = {
  BASEURL: import.meta.env.VITE_API_BASE_URL || "https://ilearn-server-production.up.railway.app/v1/",

  // Auth
  AUTH_LOGIN: "auth/login",
  AUTH_VALIDATE: "auth/validate",
  AUTH_LOGOUT: "auth/logout",
  AUTH_REFRESH: "auth/refresh-token",

  // Existing endpoints (already on ilearn-server)
  TOP_ACHIEVERS: "admin/achievers",
  MEDIA: "media",
  SUCCESS_STORIES: "admin/success-stories",
  JOURNEY: "journey",
  TEAM_MEMBERS: "admin/team",
  PROGRAMS: "admin/programs",
  RESULT_SUMMARY: "result-summary",
  RESULT: "admin/results",
  GALLERY: "admin/gallery",
  BLOG: "admin/blog/posts",
  BLOG_CATEGORIES: "admin/blog/categories",

  // New endpoints (added to ilearn-server)
  TESTIMONIALS: "testimonials",
  SITE_SETTINGS: "site-settings",
  ABOUT_PAGE_IMAGES: "about-page-images",
  MILESTONES: "milestones",
  MILESTONE_IMAGES: "milestone-images",
  APP_FEATURES: "app-features",
  APP_RATINGS: "app-ratings",
  CONTACTS: "contacts",

  // Upload
  UPLOAD_IMAGE: "upload/image",
  UPLOAD_VIDEO: "upload/video",
  UPLOAD_FILE: "upload/file",
}

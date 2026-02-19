# iLearn IAS Academy - Web v2

A full-stack web application for iLearn IAS Academy, a UPSC/KAS civil services coaching institute. Built with React, Express, PostgreSQL, and TypeScript with a fully integrated admin CMS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5.6, Wouter (routing) |
| **Styling** | Tailwind CSS 3.4, Radix UI primitives, Framer Motion |
| **Data Fetching** | TanStack React Query 5 |
| **Forms** | React Hook Form + Zod validation |
| **Backend** | Node.js 20, Express 4 |
| **Database** | PostgreSQL 16 (Neon Serverless) |
| **ORM** | Drizzle ORM + Drizzle-Zod |
| **Auth** | Express Session + Passport.js (local strategy) |
| **File Uploads** | Multer (images: 2MB, videos: 50MB) |
| **Build Tool** | Vite 5 (dev) + ESBuild (server bundle) |
| **SEO** | React Helmet |
| **Icons** | Lucide React, React Icons |
| **Misc** | Embla Carousel, Recharts, React Beautiful DnD, React Markdown |

---

## Project Structure

```
ilearn-web-v2/
├── client/                        # React frontend
│   ├── index.html                 # HTML entry point
│   ├── public/                    # Static assets (uploads, images)
│   └── src/
│       ├── main.tsx               # React DOM mount
│       ├── App.tsx                # Router + global layout
│       ├── index.css              # Global styles + Tailwind directives
│       ├── pages/                 # Route-level page components
│       ├── components/
│       │   ├── home/              # Homepage sections (Hero, Testimonials, etc.)
│       │   ├── about/             # About page components (Timeline, Carousel)
│       │   ├── admin/             # Admin CMS editors
│       │   ├── common/            # Shared components (VideoPlayer, Lightbox)
│       │   ├── layout/            # Navbar, Footer, FloatingWhatsApp, ProgressBar
│       │   └── ui/                # Radix UI component library (30+ components)
│       ├── hooks/                 # Custom hooks (use-mobile, use-toast, use-scroll-top)
│       ├── lib/                   # Utilities (queryClient, api helpers, constants)
│       └── assets/                # Static imports
│
├── server/                        # Express backend
│   ├── index.ts                   # App bootstrap, middleware, session config
│   ├── routes.ts                  # All REST API route definitions
│   ├── db.ts                      # Drizzle + Neon database connection
│   ├── storage.ts                 # DatabaseStorage class (all DB operations)
│   ├── upload-handler.ts          # Multer config for image/video uploads
│   ├── vite.ts                    # Vite dev server integration
│   ├── media-helpers.ts           # Media processing utilities
│   └── youtube-helper.ts          # YouTube URL/thumbnail extraction
│
├── shared/                        # Shared between frontend & backend
│   └── schema.ts                  # Drizzle table schemas + Zod validators + TS types
│
├── migrations/                    # Auto-generated Drizzle migration SQL files
├── public/                        # Static files served by Express (/uploads, /assets)
│
├── vite.config.ts                 # Vite build config (aliases, plugins)
├── tailwind.config.ts             # Tailwind theme (colors, fonts)
├── drizzle.config.ts              # Database migration config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies & scripts
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Hero banner, social proof, results carousel, video testimonials, program teasers, CTA |
| `/about` | AboutPage | Academy story, milestone timeline, media carousel |
| `/results` | ResultsPage | Toppers carousel, success stories filterable by year |
| `/programs` | ProgramsPage | All coaching programs listing |
| `/programs/:slug` | ProgramDetailPage | Individual program with USPs, FAQ, fees, testimonials |
| `/programs/prelims-cum-mains` | PcmProgramPage | Dedicated Prelims-cum-Mains program page |
| `/programs/current-affairs-news-analysis` | CanaProgramPage | Dedicated Current Affairs program page |
| `/gallery` | GalleryPage | Media gallery organized by events |
| `/blog` | BlogPage | Blog listing with category/tag filters |
| `/blog/category/:categorySlug` | BlogPage | Blog filtered by category |
| `/blog/tag/:tag` | BlogPage | Blog filtered by tag |
| `/blog/:slug` | BlogPostPage | Individual blog post (Markdown rendered) |
| `/app` | AppPage | Mobile app features and ratings |
| `/contact` | ContactPage | Contact form submission |
| `/admin` | AdminPage | CMS admin panel (auth required) |

---

## Data Flow Architecture

```
┌─────────────┐     fetch + React Query     ┌──────────────┐     Drizzle ORM     ┌──────────────┐
│   React UI   │  ◄──────────────────────►  │  Express API  │  ◄───────────────►  │  PostgreSQL   │
│  (Frontend)  │     JSON over HTTP         │   (Backend)   │    Type-safe SQL    │   (Neon DB)   │
└─────────────┘                             └──────────────┘                      └──────────────┘
       │                                           │
       │  useQuery(['/api/programs'])               │  storage.getPrograms()
       │  apiRequest({ url, method, data })         │  db.select().from(programs)
       │                                           │
       ▼                                           ▼
  React Query Cache                        DatabaseStorage class
  (10 min stale time)                      (implements IStorage)
```

### Frontend Data Fetching

All data fetching uses **TanStack React Query** with a centralized `apiRequest()` function:

```typescript
// Simple GET (query key IS the URL)
const { data, isLoading } = useQuery({
  queryKey: ['/api/programs'],
});

// Mutations with cache invalidation
const mutation = useMutation({
  mutationFn: (data) => apiRequest({ url: '/api/programs', method: 'POST', data }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/programs'] }),
});
```

**Query Client Config:**
- Stale time: 10 minutes
- No refetch on window focus
- No automatic retries
- Credentials included on all requests (session cookies)

### Backend Storage Layer

All database operations go through `DatabaseStorage` in `server/storage.ts`, which implements a unified `IStorage` interface. This gives a single point of access for all DB queries using Drizzle ORM:

```typescript
class DatabaseStorage implements IStorage {
  async getPrograms()                    // SELECT with ORDER BY displayOrder
  async createProgram(data)              // INSERT ... RETURNING
  async updateProgram(id, data)          // UPDATE ... WHERE id = ? RETURNING
  async deleteProgram(id)                // DELETE ... WHERE id = ?
  // ... methods for all entities
}
```

---

## Database Schema

Defined in `shared/schema.ts` using Drizzle ORM with auto-generated Zod validators and TypeScript types.

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | Admin accounts | username, password |
| `site_settings` | Key-value global config | key, value |
| `programs` | Coaching programs | slug, title, description, usp[], fees, faq (JSONB), resultYears (JSONB) |
| `testimonials` | Student testimonials | name, rank, program, quote, type (text/image/video), year |
| `toppers` | Results/toppers showcase | name, rank, program, year, image, scorecard |
| `media` | Images & videos | type, mediaUrl, thumbnailUrl, embedUrl, aspectRatio |
| `gallery_events` | Gallery event groups | title, description, mediaIds[] |
| `contacts` | Contact form submissions | name, email, phone, message, isRead |
| `blog_posts` | Blog articles | title, slug, content (Markdown), categoryIds[], tags[], status |
| `blog_categories` | Blog categories | name, slug |
| `about_page_images` | About page images | section, imageUrl, displayOrder |
| `milestones` | Timeline milestones | year, title, description |
| `milestone_images` | Milestone photos | milestoneId, imageUrl |
| `app_features` | Mobile app features | title, description, icon |
| `app_ratings` | App store reviews | name, rating, comment |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with username/password, creates session |
| `GET` | `/api/auth/check` | Check if currently authenticated |
| `POST` | `/api/auth/logout` | Destroy session |

### Programs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/programs` | No | List all programs |
| `GET` | `/api/programs/:slug` | No | Get program by slug or ID |
| `GET` | `/api/programs/:slug/testimonials` | No | Get program's testimonials |
| `POST` | `/api/programs` | Yes | Create program |
| `PUT` | `/api/programs/:id` | Yes | Update program |
| `DELETE` | `/api/programs/:id` | Yes | Delete program |

### Testimonials
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/testimonials` | No | List all (filter by `?type=video`) |
| `GET` | `/api/testimonials/:id` | No | Get single testimonial |
| `POST` | `/api/testimonials` | Yes | Create testimonial |
| `PUT` | `/api/testimonials/:id` | Yes | Update testimonial |
| `DELETE` | `/api/testimonials/:id` | Yes | Delete testimonial |

### Toppers / Results
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/toppers` | No | List all (filter by `?year=2024`) |
| `POST/PUT/DELETE` | `/api/toppers[/:id]` | Yes | CRUD operations |

### Media & Gallery
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/media` | No | List all media items |
| `POST` | `/api/media` | Yes | Create media entry |
| `POST` | `/api/media/youtube` | Yes | Add YouTube video |
| `GET` | `/api/gallery-events` | No | List gallery events |
| `GET` | `/api/gallery-events/:id/media` | No | Get event's media items |
| `POST/PUT/DELETE` | `/api/gallery-events[/:id]` | Yes | CRUD operations |

### File Uploads
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload/image` | Upload image (max 2MB) |
| `POST` | `/api/upload/video` | Upload video (max 50MB) |

### Blog
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/blog/posts` | No | List published posts |
| `GET` | `/api/blog/posts/:slug` | No | Get post by slug |
| `GET` | `/api/blog/categories` | No | List categories |
| `POST/PUT/DELETE` | `/api/blog/posts[/:id]` | Yes | CRUD operations |
| `POST/PUT/DELETE` | `/api/blog/categories[/:id]` | Yes | CRUD operations |

### Site Settings & Contacts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/settings` | No | Get all settings |
| `GET` | `/api/settings/:key` | No | Get single setting |
| `PUT` | `/api/settings/:key` | Yes | Update setting |
| `GET` | `/api/contacts` | Yes | List contact submissions |
| `POST` | `/api/contacts` | No | Submit contact form |

---

## Authentication

- **Session-based** using `express-session` with in-memory store
- Protected routes use `authMiddleware` that checks `req.session.authenticated`
- Session cookie expires after 24 hours
- Admin panel at `/admin` requires login

---

## Admin CMS

The `/admin` page provides a full content management system with these editors:

- **Hero Section Editor** - Edit homepage banner content
- **Programs Editor** - Create/edit/reorder coaching programs
- **Toppers Carousel Editor** - Manage results showcase
- **Video Testimonials Editor** - Manage student video testimonials
- **Image Testimonials Editor** - Manage text/image testimonials
- **Gallery Event Editor** - Organize media into event galleries
- **Media Library** - Browse, upload, and manage all images/videos
- **About Page Image Editor** - Manage about page visuals
- **Blog Editor** - Write and publish blog posts (Markdown)
- **Site Settings Editor** - Global key-value configuration
- **Contact Submissions** - View submitted contact forms

All editors support drag-and-drop reordering via `react-beautiful-dnd`.

---

## Styling & Theme

- **Tailwind CSS** with custom color tokens:
  - Primary Red: `#E21A24`
  - Primary Blue: `#20468D`
- **Radix UI** primitives styled with Tailwind (Shadcn/ui pattern)
- **Fonts**: Inter, Poppins, Montserrat, Google Sans
- **Animations**: Framer Motion page transitions, Embla Carousel, custom CSS keyframes
- **Dark mode** support via `next-themes`

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon) |
| `SESSION_SECRET` | Yes | Express session encryption secret |
| `NODE_ENV` | No | `development` or `production` |

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or a Neon account)

### Installation

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The app runs on **port 3024** in development with Vite HMR.

### Production Build

```bash
# Build frontend (Vite) + backend (ESBuild)
npm run build

# Start production server
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema changes to database |

---

## Key Architectural Decisions

- **Shared schema** (`shared/schema.ts`) - Single source of truth for DB tables, Zod validators, and TypeScript types across frontend and backend
- **React Query as state manager** - No Redux/Zustand; all server state managed through React Query's cache with 10-min stale time
- **Storage abstraction** - All DB operations go through `DatabaseStorage` class implementing `IStorage` interface, making the data layer swappable
- **Monorepo-style** - Frontend and backend live in the same repo with shared types, built and served together
- **Wouter over React Router** - Lightweight ~2KB router for simpler client-side routing

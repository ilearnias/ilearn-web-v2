import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ChevronRight, Calendar, User, Tag, Clock } from "lucide-react";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Types
import type { BlogPost, BlogCategory } from "@shared/schema";

// Utility function to format date
const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM d, yyyy");
};

// Excerpts should be limited in length
const truncateExcerpt = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Blog list page component
export default function BlogPage() {
  const [location] = useLocation();
  const params = useParams();
  const { categorySlug, tag } = params;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug, tag]);
  
  // Fetch blog categories for sidebar
  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['/api/blog/categories'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch blog posts with filters and pagination
  const { 
    data: postData, 
    isLoading: postsLoading,
    isFetching
  } = useQuery({
    queryKey: ['/api/blog/posts', { category_slug: categorySlug, tag, limit: postsPerPage, offset: (currentPage - 1) * postsPerPage }],
    staleTime: 60 * 1000, // 1 minute
  });
  
  const posts = postData?.posts || [];
  const totalPosts = postData?.total || 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Build page title based on filters
  let pageTitle = "Blog";
  if (categorySlug && categories) {
    const category = categories.find((cat: BlogCategory) => cat.slug === categorySlug);
    if (category) pageTitle = `${category.name} - Blog`;
  } else if (tag) {
    pageTitle = `#${tag} - Blog`;
  }
  
  // Get all unique tags from posts for tag cloud
  const getAllTags = (posts: BlogPost[]) => {
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags;
  };
  
  // Get current active category
  const activeCategory = categorySlug && categories 
    ? categories.find((cat: BlogCategory) => cat.slug === categorySlug) 
    : null;
  
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <Helmet>
        <title>UPSC Preparation Blog | Tips, Strategy &amp; Current Affairs | iLearn IAS</title>
        <meta name="description" content="Free UPSC preparation guides, current affairs analysis, optional subject strategy and civil services tips from iLearn IAS Academy, Kerala's top coaching institute." />
        <link rel="canonical" href="https://www.ilearnias.com/blog" />
        <meta property="og:title" content="UPSC Preparation Blog | iLearn IAS Academy Kerala" />
        <meta property="og:url" content="https://www.ilearnias.com/blog" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "iLearn IAS Academy UPSC Preparation Blog",
            "url": "https://www.ilearnias.com/blog",
            "description": "Free UPSC preparation resources, current affairs analysis, and civil services strategy from Kerala's top coaching institute.",
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "iLearn IAS Academy",
              "url": "https://www.ilearnias.com"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ilearnias.com/" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.ilearnias.com/blog" }
              ]
            }
          }
        `}</script>
      </Helmet>

      <div className="container px-4 mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-blue transition-colors">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          {categorySlug ? (
            <>
              <Link href="/blog" className="hover:text-primary-blue transition-colors">
                Blog
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-gray-900 font-medium">
                {activeCategory ? activeCategory.name : "Category"}
              </span>
            </>
          ) : tag ? (
            <>
              <Link href="/blog" className="hover:text-primary-blue transition-colors">
                Blog
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-gray-900 font-medium">#{tag}</span>
            </>
          ) : (
            <span className="text-gray-900 font-medium">Blog</span>
          )}
        </div>

        {/* Page Title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categorySlug && activeCategory
              ? activeCategory.name
              : tag
              ? `Posts tagged #${tag}`
              : "iLearn IAS Blog"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {categorySlug && activeCategory
              ? activeCategory.description
              : tag
              ? `Articles related to ${tag} for UPSC preparation`
              : "Latest articles, study notes and current affairs for UPSC Civil Services Examination preparation"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <Separator className="mb-4" />
              
              {categoriesLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="mb-2">
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))
              ) : (
                <ScrollArea className="h-64">
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        href="/blog" 
                        className={`block p-2 rounded-md hover:bg-primary-blue/10 select-none transition-colors ${!categorySlug ? 'bg-primary-blue/10 text-primary-blue font-medium' : ''}`}
                      >
                        All Posts
                      </Link>
                    </li>
                    {categories?.map((category: BlogCategory) => (
                      <li key={category.id}>
                        <Link 
                          href={`/blog/category/${category.slug}`} 
                          className={`block p-2 rounded-md hover:bg-primary-blue/10 select-none transition-colors ${categorySlug === category.slug ? 'bg-primary-blue/10 text-primary-blue font-medium' : ''}`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
              
              <h2 className="text-xl font-bold mb-4 mt-8">Popular Tags</h2>
              <Separator className="mb-4" />
              
              {postsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {getAllTags(posts).map((tagName) => (
                    <Link key={tagName} href={`/blog/tag/${tagName}`}>
                      <Badge 
                        variant={tag === tagName ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
                      >
                        {tagName}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:col-span-3">
            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden h-96">
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No posts found</h3>
                <p className="text-gray-600 mb-8">
                  {categorySlug 
                    ? "There are no posts in this category yet." 
                    : tag 
                    ? `There are no posts with the tag #${tag}.`
                    : "There are no blog posts available at the moment."}
                </p>
                <Button asChild variant="outline">
                  <Link href="/blog">
                    View All Posts
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post: BlogPost) => (
                    <Card key={post.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                      <CardHeader className="p-0">
                        {post.featuredImage && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={post.featuredImage} 
                              alt={post.featuredImageAlt || post.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-6 flex-grow">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          {post.categoryIds && post.categoryIds.length > 0 && categories && (
                            <div className="flex items-center">
                              <User className="mr-1 h-4 w-4" />
                              <span>
                                {categories
                                  .filter((cat: BlogCategory) => post.categoryIds?.includes(cat.id))
                                  .map((cat: BlogCategory) => cat.name)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary-blue transition-colors">
                          <CardTitle className="mb-2 text-xl">{post.title}</CardTitle>
                        </Link>
                        <CardDescription className="text-gray-600 mb-4">
                          {truncateExcerpt(post.excerpt)}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags && post.tags.slice(0, 3).map(tag => (
                            <Link key={tag} href={`/blog/tag/${tag}`}>
                              <Badge variant="outline" className="hover:bg-primary-blue hover:text-white transition-colors">
                                {tag}
                              </Badge>
                            </Link>
                          ))}
                          {post.tags && post.tags.length > 3 && (
                            <Badge variant="outline">+{post.tags.length - 3}</Badge>
                          )}
                        </div>
                        <Link href={`/blog/${post.slug}`} className="text-primary-blue hover:underline text-sm font-medium inline-flex items-center">
                          Read more
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-12">
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(p => Math.max(1, p - 1));
                            }} 
                          />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show current page, first, last, and 1 page on either side of current
                          return (
                            page === 1 || 
                            page === totalPages || 
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis where there are gaps
                          const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                          
                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsisBefore && (
                                <PaginationItem>
                                  <span className="px-4 py-2">...</span>
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                    window.scrollTo(0, 0);
                                  }}
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </div>
                          );
                        })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(p => Math.min(totalPages, p + 1));
                              window.scrollTo(0, 0);
                            }} 
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
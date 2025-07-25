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
import QUERY_KEY from "@/config/queryKeys";
import apiClient from "@/config/apiClient";
import { API } from "@/config/api";

// Types for the new API response
interface BlogPost {
  id: string;
  categoryId: string;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  tags: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  category: {
    id: string;
    title: string;
  };
}

interface BlogCategory {
  id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

interface PaginationMeta {
  limit: number;
  itemCount: number;
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: BlogPost[];
  meta: PaginationMeta;
}

interface CategoryApiResponse {
  status: boolean;
  message: string;
  data: BlogCategory[];
}

// Utility function to format date
const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM d, yyyy");
};

// Excerpts should be limited in length
const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Blog list page component
export default function BlogPage() {
  const [location, setLocation] = useLocation();
  const params = useParams();
  // Get the category from URL parameters - it will be in the format /blog/category/:title
  const categoryFromUrl = params["*"]?.split("/")?.[2] || null;
  const tag = params.tag;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  
  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFromUrl, tag]);

  // Fetch categories
  const { 
    data: categoriesResponse,
    isLoading: categoriesLoading 
  } = useQuery<CategoryApiResponse>({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await apiClient.get(API?.BLOG_CATEGORIES);
      return response.data;
    },
  });

  // Get category ID from title
  const categories = categoriesResponse?.data || [];
  const selectedCategory = categoryFromUrl 
    ? categories.find(cat => cat.title.toLowerCase() === decodeURIComponent(categoryFromUrl).toLowerCase())
    : null;

  // Debug logging for category matching
  useEffect(() => {
    if (categoryFromUrl) {
      console.log('Looking for category:', decodeURIComponent(categoryFromUrl));
      console.log('Available categories:', categories.map(c => ({ id: c.id, title: c.title })));
      console.log('Selected category:', selectedCategory);
    }
  }, [categoryFromUrl, categories, selectedCategory]);

  // Fetch blog posts (no categoryId or tag in params)
  const { 
    data: apiResponse, 
    isLoading: postsLoading,
    isFetching
  } = useQuery<ApiResponse>({
    queryKey: [QUERY_KEY?.BLOG, { page: currentPage }],
    queryFn: async () => {
      const response = await apiClient.get(API?.BLOG, {
        params: {
          page: currentPage,
          limit: postsPerPage,
        }
      });
      return response.data;
    },
    enabled: !categoriesLoading,
  });

  const posts = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  // Client-side filter by category title
  const filteredPosts = categoryFromUrl && selectedCategory
    ? posts.filter(post => post.category?.title?.toLowerCase() === selectedCategory.title.toLowerCase())
    : posts;
  
  // Extract unique tags from posts
  const uniqueTags = Array.from(
    new Set(posts.map(post => post.tags))
  ).filter(Boolean);
  
  // Build page title based on filters
  let pageTitle = "Blog";
  if (categoryFromUrl && selectedCategory) {
    pageTitle = `${selectedCategory.title} - Blog`;
  } else if (tag) {
    pageTitle = `#${tag} - Blog`;
  }

  // Handle category click
  const handleCategoryClick = (catTitle: string | null) => {
    console.log('Category clicked:', catTitle);
    if (catTitle) {
      const encodedTitle = encodeURIComponent(catTitle.trim());
      console.log('Navigating to:', `/blog/category/${encodedTitle}`);
      setLocation(`/blog/category/${encodedTitle}`);
    } else {
      setLocation('/blog');
    }
    setCurrentPage(1);
  };

  // Handle tag click
  const handleTagClick = (tagName: string) => {
    setLocation(`/blog/tag/${encodeURIComponent(tagName)}`);
    setCurrentPage(1);
  };

  const isLoading = categoriesLoading || postsLoading;

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <Helmet>
        <title>{pageTitle} | iLearn IAS Academy</title>
        <meta name="description" content="Read the latest articles, study notes, and current affairs analysis for UPSC Civil Services Examination." />
      </Helmet>

      <div className="container px-4 mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-blue transition-colors">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          {categoryFromUrl ? (
            <>
              <Link href="/blog" className="hover:text-primary-blue transition-colors">
                Blog
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-gray-900 font-medium">
                {selectedCategory ? selectedCategory.title : "Category"}
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

        Page Title
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryFromUrl && selectedCategory
              ? selectedCategory.title
              : tag
              ? `Posts tagged #${tag}`
              : "iLearn IAS Blog"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Latest articles, study notes and current affairs for UPSC Civil Services Examination preparation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <Separator className="mb-4" />
              
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="mb-2">
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))
              ) : (
                <ScrollArea className="h-64">
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => handleCategoryClick(null)}
                        className={`block w-full text-left p-2 rounded-md hover:bg-primary-blue/10 select-none transition-colors ${location === '/blog' ? 'bg-primary-blue/10 text-primary-blue font-medium' : 'text-gray-700'}`}
                      >
                        All Posts
                      </button>
                    </li>
                    {categories
                      .filter(cat => cat.isActive)
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((category) => {
                        const categoryPath = `/blog/category/${encodeURIComponent(category.title)}`;
                        return (
                          <li key={category.id}>
                            <button 
                              onClick={() => handleCategoryClick(category.title)}
                              className={`block w-full text-left p-2 rounded-md hover:bg-primary-blue/10 select-none transition-colors ${location === categoryPath ? 'bg-primary-blue/10 text-primary-blue font-medium' : 'text-gray-700'}`}
                            >
                              {category.title}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </ScrollArea>
              )}
              
              <h2 className="text-xl font-bold mb-4 mt-8">Popular Tags</h2>
              <Separator className="mb-4" />
              
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map((tagName) => (
                    <button
                      key={tagName}
                      onClick={() => handleTagClick(tagName)}
                      className="inline-flex"
                    >
                      <Badge 
                        variant={tag === tagName ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
                      >
                        {tagName}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:col-span-3">
            {isLoading ? (
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
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No posts found</h3>
                <p className="text-gray-600 mb-8">
                  {categoryFromUrl 
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                      <CardHeader className="p-0">
                        {post.image && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-6 flex-grow">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="mr-1 h-4 w-4" />
                            <span>{post.category.title}</span>
                          </div>
                        </div>
                        <Link href={`/blog/${post.id}`} className="hover:text-primary-blue transition-colors">
                          <CardTitle className="mb-2 text-xl">{post.title}</CardTitle>
                        </Link>
                        <CardDescription className="text-gray-600 mb-4">
                          {truncateText(post.description)}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
                        <Badge variant="outline" className="hover:bg-primary-blue hover:text-white transition-colors">
                          {post.tags}
                        </Badge>
                        <Link href={`/blog/${post.id}`} className="text-primary-blue hover:underline text-sm font-medium inline-flex items-center">
                          Read more
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <Pagination className="mt-12">
                    <PaginationContent>
                      {meta.hasPreviousPage && (
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(p => Math.max(1, p - 1));
                              window.scrollTo(0, 0);
                            }} 
                          />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          return (
                            page === 1 || 
                            page === meta.totalPages || 
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, index, array) => {
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
                      
                      {meta.hasNextPage && (
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(p => Math.min(meta.totalPages, p + 1));
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
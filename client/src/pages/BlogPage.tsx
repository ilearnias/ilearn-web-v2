import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import apiClient from "@/config/apiClient";
import { API } from "@/config/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { extractTextFromXML } from "@/utils/xml-parser";

interface BlogPost {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  tags: string;
}

interface BlogCategory {
  id: string;
  title: string;
  isActive: boolean;
}

interface PaginationMeta {
  limit: number;
  itemCount: number;
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface BlogApiResponse {
  data: BlogPost[];
  meta: PaginationMeta;
}

interface CategoryApiResponse {
  data: BlogCategory[];
}

export default function BlogPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const postsPerPage = 9;

  // Reset pagination and tag when category changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedTag(null);
  }, [selectedCategoryId]);

  // Fetch categories
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery<CategoryApiResponse>({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const response = await apiClient.get(API?.BLOG_CATEGORIES + "?isActive=true&page=1&limit=50");
      return response.data;
    },
  });
  const categories = categoriesResponse?.data || [];

  // Fetch blogs for selected category and page
  const { data: blogsResponse, isLoading: blogsLoading } = useQuery<BlogApiResponse>({
    queryKey: ["blogs", selectedCategoryId, currentPage],
    queryFn: async () => {
      const params: any = {
        page: currentPage,
        limit: postsPerPage,
      };
      if (selectedCategoryId) params.categoryId = selectedCategoryId;
      const response = await apiClient.get(API?.BLOG + "?isActive=true", { params });
      return response.data;
    },
  });
  const blogs = blogsResponse?.data || [];
  const meta = blogsResponse?.meta;

  // Extract unique tags from blogs
  const uniqueTags: string[] = Array.from(
    new Set(blogs.map((post: BlogPost) => post.tags).filter(Boolean))
  );

  // Filter blogs by selected tag (client-side)
  const filteredBlogs = selectedTag
    ? blogs.filter((post) => post.tags === selectedTag)
    : blogs;

  // Find selected category object for breadcrumb
  const selectedCategory = selectedCategoryId
    ? categories.find(cat => cat.id === selectedCategoryId)
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
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <span className="hover:text-primary-blue transition-colors cursor-pointer" onClick={() => setSelectedCategoryId(null)}>
            Home
          </span>
          <span className="mx-2">&gt;</span>
          <span className="hover:text-primary-blue transition-colors cursor-pointer" onClick={() => setSelectedCategoryId(null)}>
            Blog
          </span>
          {selectedCategory ? (
            <>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900 font-medium">{selectedCategory.title}</span>
            </>
          ) : selectedTag ? (
            <>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900 font-medium">#{selectedTag}</span>
            </>
          ) : null}
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
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategoryId(null)}
                      className={`block w-full text-left p-2 rounded-md select-none transition-colors ${selectedCategoryId === null ? 'bg-primary-blue text-white font-medium hover:bg-primary-blue/90' : 'text-gray-700 hover:text-primary-blue hover:bg-primary-blue/10'}`}
                    >
                      All Posts
                    </button>
                  </li>
                  {categories.filter(cat => cat.isActive).map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`block w-full text-left p-2 rounded-md select-none transition-colors ${selectedCategoryId === category.id ? 'bg-primary-blue text-white font-medium hover:bg-primary-blue/90' : 'text-gray-700 hover:text-primary-blue hover:bg-primary-blue/10'}`}
                      >
                        {category.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <h2 className="text-xl font-bold mb-4 mt-8">Popular Tags</h2>
              <Separator className="mb-4" />
              {blogsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map((tagName: string) => (
                    <button
                      key={tagName}
                      onClick={() => setSelectedTag(tagName)}
                      className="inline-flex"
                    >
                      <Badge
                        variant={selectedTag === tagName ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${selectedTag === tagName
                            ? "bg-primary-blue text-white border-primary-blue hover:bg-primary-blue/90"
                            : "hover:bg-primary-blue hover:text-white border-gray-300"
                          }`}
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
            {blogsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden h-80">
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-24 mt-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-primary-blue mb-4">No posts found</h3>
                <p className="text-gray-600 mb-8">There are no blog posts available for this category.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((post) => (
                    <Card key={post.id} className="overflow-hidden flex flex-col h-80 hover:shadow-md transition-shadow">
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
                      <CardContent className="p-4 flex-grow flex flex-col">
                        <CardTitle className="mb-2 text-lg font-semibold line-clamp-3 leading-tight" style={{ color: 'rgb(32, 70, 141)' }}>
                          {post.title}
                        </CardTitle>

                        {/* Click More Button */}
                        <div className="mt-auto mb-1">
                          <Link
                            href={`/blog/post/${post.id}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium inline-flex items-center group"
                          >
                            Read More
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </CardContent>
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
                            onClick={e => {
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
                                  onClick={e => {
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
                            onClick={e => {
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

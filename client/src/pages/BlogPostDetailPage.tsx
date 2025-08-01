import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { ArrowRight, Bookmark, ChevronRight, Calendar, User, Tag, Clock, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// API Client
import apiClient from "@/config/apiClient";
import { API } from "@/config/api";

// Markdown renderer for rich content 
import ReactMarkdown from 'react-markdown';
import { renderXMLContent, extractTextFromXML, hasRichContent } from '@/utils/xml-parser';

// Types
interface BlogPost {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  content?: string;
  image: string;
  tags: string;
  publishedAt?: string;
  categoryId?: string;
  category?: {
    id: string;
    title: string;
  };
}

interface BlogCategory {
  id: string;
  title: string;
  isActive: boolean;
}

// Utility function to format date
const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM d, yyyy");
};

// Calculate reading time
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

// Blog post detail page component
export default function BlogPostDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { slug } = params;
  
  // Fetch the specific blog post
  const { 
    data: post, 
    isLoading: postLoading,
    error: postError
  } = useQuery<BlogPost>({
    queryKey: [`blog-post-${slug}`],
    queryFn: async () => {
      try {
        console.log('Fetching blog post with slug:', slug);
        const response = await apiClient.get(`${API.BLOG}/${slug}`);
        console.log('Blog post response:', response.data);
        
        // Handle different response structures
        if (response.data && response.data.data) {
          return response.data.data; // If response is wrapped in a data property
        } else if (response.data) {
          return response.data; // Direct response
        } else {
          throw new Error('No data received from API');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch blog categories to display category names
  const { 
    data: categories 
  } = useQuery<{ data: BlogCategory[] }>({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await apiClient.get(API.BLOG_CATEGORIES + "?isActive=true&page=1&limit=50");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // If the post has loaded, fetch related posts in the same categories
  const { 
    data: relatedPosts = { data: [] },
  } = useQuery({
    queryKey: ['related-blogs', post?.categoryId],
    queryFn: async () => {
      if (!post?.categoryId) return { data: [] };
      const response = await apiClient.get(`${API.BLOG}?categoryId=${post.categoryId}&limit=3`);
      return response.data;
    },
    enabled: !!post?.categoryId,
    staleTime: 5 * 60 * 1000,
  });
  
  // Function to get category names from IDs
  const getCategoryNames = (categoryId?: string) => {
    if (!categories || !categoryId) return [];
    const category = categories.data.find((cat: BlogCategory) => cat.id === categoryId);
    return category ? [category.title] : [];
  };
  
  // Handle the case when post is not found
  if (postError) {
    console.error('Blog post error:', postError);
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto mb-8">
          <AlertDescription>
            The blog post you're looking for could not be found. 
            {postError instanceof Error && ` Error: ${postError.message}`}
          </AlertDescription>
        </Alert>
        <Button onClick={() => setLocation("/blog")}>
          Return to Blog
        </Button>
      </div>
    );
  }
  
  // Calculate reading time
  const readingTime = post?.content ? calculateReadingTime(post.content) : 0;
  
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <Helmet>
        <title>{post?.title ? `${post.title} | iLearn IAS Academy` : "Blog | iLearn IAS Academy"}</title>
        <meta name="description" content={post?.description || "iLearn IAS Academy blog post"} />
        <meta property="og:title" content={post?.title || "Blog | iLearn IAS Academy"} />
        <meta property="og:description" content={post?.description || "iLearn IAS Academy blog post"} />
        <meta property="og:type" content="article" />
        {post?.image && <meta property="og:image" content={post.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title || "Blog | iLearn IAS Academy"} />
        <meta name="twitter:description" content={post?.description || "iLearn IAS Academy blog post"} />
        {post?.image && <meta name="twitter:image" content={post.image} />}
        {post?.publishedAt && <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />}
      </Helmet>

      <div className="container px-4 mx-auto max-w-7xl">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div>
            {postLoading ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 text-primary-blue">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue"></div>
                    <span>Loading blog post...</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-72 w-full mb-8" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </>
            ) : !post ? (
              <div className="text-center py-16">
                <Alert variant="destructive" className="max-w-md mx-auto mb-8">
                  <AlertDescription>
                    Blog post not found. Please check the URL and try again.
                  </AlertDescription>
                </Alert>
                <Button onClick={() => setLocation("/blog")}>
                  Return to Blog
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="mb-6" 
                  onClick={() => setLocation("/blog")}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>

                <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-12 transition-all duration-300 hover:shadow-md">
                  {/* Featured Image */}
                  {post?.image && (
                    <div className="w-full aspect-video relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8">
                    {/* Post Header - Always show full header */}
                    <header className="mb-8">
                      {/* Post Title - Always Visible */}
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {post?.title}
                      </h1>
                      
                      {/* Subtitle */}
                      {post?.subTitle && (
                        <p className="text-xl text-gray-600 mb-4">
                          {post.subTitle}
                        </p>
                      )}
                      
                      {/* Post Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {post?.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        )}
                        
                        {readingTime > 0 && (
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{readingTime} min read</span>
                          </div>
                        )}
                      </div>
                    </header>
                    
                    {/* Post Content - Always show full content */}
                    <div className="prose prose-slate max-w-none prose-headings:text-primary-blue prose-a:text-primary-blue hover:prose-a:text-primary-red">
                      {post?.content ? (
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                      ) : post?.description && hasRichContent(post.description) ? (
                        // Render XML/HTML content from description
                        renderXMLContent(post.description, 'prose prose-slate max-w-none prose-headings:text-primary-blue prose-a:text-primary-blue hover:prose-a:text-primary-red')
                      ) : (
                        <div className="text-gray-600 text-lg leading-relaxed">
                          <p>{post?.description}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Tags - Always visible */}
                    {post?.tags && (
                      <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.split(',').map((tag, index) => (
                            <Badge key={index} variant="outline" className="hover:bg-primary-blue hover:text-white transition-colors">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
                
                {/* Related Posts */}
                {relatedPosts.data && relatedPosts.data.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-primary-blue flex items-center">
                      <Bookmark className="mr-2 h-5 w-5" /> 
                      Related Posts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.data
                        .filter((related: BlogPost) => related.id !== post?.id)
                        .slice(0, 3)
                        .map((related: BlogPost) => (
                          <Card 
                            key={related.id} 
                            className="overflow-hidden rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]"
                          >
                            {related.image && (
                              <div className="h-48 overflow-hidden">
                                <img 
                                  src={related.image} 
                                  alt={related.title} 
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                              </div>
                            )}
                                                        <CardContent className="p-4 flex flex-col h-full">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-3">
                                <Link href={`/blog/post/${related.id}`} className="hover:text-primary-blue transition-colors">
                                  {related.title}
                                </Link>
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                                {related.subTitle || related.description}
                              </p>
                                                             <div className="mt-auto mb-1">
                                 <Link 
                                   href={`/blog/post/${related.id}`} 
                                   className="text-primary-blue hover:underline text-sm font-medium inline-flex items-center group"
                                 >
                                   Read more
                                   <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                 </Link>
                               </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 
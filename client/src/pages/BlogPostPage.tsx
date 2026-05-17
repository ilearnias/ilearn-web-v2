import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { ArrowRight, Bookmark, ChevronRight, Calendar, User, Tag, Share, Facebook, Twitter, Linkedin, Clock, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
import type { BlogPost, BlogCategory } from "@shared/schema";

// Markdown renderer for rich content 
import ReactMarkdown from 'react-markdown';
import { renderXMLContent, hasRichContent } from '@/utils/xml-parser';

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
export default function BlogPostPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { slug } = params;
  
  // Fetch the specific blog post
  const { 
    data: post, 
    isLoading: postLoading,
    error: postError
  } = useQuery({
    queryKey: [`admin/blog/posts/${slug}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch blog categories to display category names
  const {
    data: categories
  } = useQuery({
    queryKey: ['admin/blog/categories'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // If the post has loaded, fetch related posts in the same categories
  const {
    data: relatedPosts = { posts: [] },
  } = useQuery({
    queryKey: ['admin/blog/posts',
      {
        category_id: post?.categoryIds?.[0],
        limit: 3
      }
    ],
    enabled: !!post?.categoryIds?.[0],
    staleTime: 5 * 60 * 1000,
  });
  
  // Function to get category names from IDs
  const getCategoryNames = (categoryIds: number[] = []) => {
    if (!categories) return [];
    return categoryIds
      .map(id => categories.find((cat: BlogCategory) => cat.id === id))
      .filter(Boolean)
      .map((cat: BlogCategory) => cat.name);
  };
  
  // Handle the case when post is not found
  if (postError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto mb-8">
          <AlertDescription>
            The blog post you're looking for could not be found.
          </AlertDescription>
        </Alert>
        <Button onClick={() => setLocation("/blog")}>
          Return to Blog
        </Button>
      </div>
    );
  }
  
  // Share the current page on social media
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || "iLearn IAS Blog Post");
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };
  
  // Calculate reading time
  const readingTime = post?.content ? calculateReadingTime(post.content) : 0;
  
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <Helmet>
        <title>{post?.title ? `${post.title} | iLearn IAS Academy` : "Blog | iLearn IAS Academy"}</title>
        <meta name="description" content={post?.metaDescription || post?.excerpt || "iLearn IAS Academy blog post"} />
        <meta property="og:title" content={post?.metaTitle || post?.title || "Blog | iLearn IAS Academy"} />
        <meta property="og:description" content={post?.metaDescription || post?.excerpt || "iLearn IAS Academy blog post"} />
        <meta property="og:type" content="article" />
        {post?.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.metaTitle || post?.title || "Blog | iLearn IAS Academy"} />
        <meta name="twitter:description" content={post?.metaDescription || post?.excerpt || "iLearn IAS Academy blog post"} />
        {post?.featuredImage && <meta name="twitter:image" content={post.featuredImage} />}
        {post?.publishedAt && <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />}
        {post?.updatedAt && <meta property="article:modified_time" content={new Date(post.updatedAt).toISOString()} />}
        {post?.tags && post.tags.map(tag => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
        {post?.slug && (
          <link rel="canonical" href={`https://www.ilearnias.com/blog/${post.slug}`} />
        )}
        {post && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription || post.excerpt || "",
            "image": post.featuredImage || "https://www.ilearnias.com/assets/og-image.jpg",
            "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
            "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.ilearnias.com/blog/${post.slug}`
            },
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "iLearn IAS Academy",
              "url": "https://www.ilearnias.com"
            }
          })}</script>
        )}
      </Helmet>

      <div className="container px-4 mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {postLoading ? "Loading..." : post?.title || "Post"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {postLoading ? (
              <>
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
                  {post?.featuredImage && (
                    <div className="w-full aspect-video relative">
                      <img 
                        src={post.featuredImage} 
                        alt={post.featuredImageAlt || post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8">
                    <header className="mb-8">
                      {post?.categoryIds && categories && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getCategoryNames(post.categoryIds).map((name, index) => (
                            <Badge key={index} variant="secondary">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">
                        {post?.title}
                      </h1>

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
                    
                    <div className="prose prose-slate max-w-none prose-headings:text-primary-blue prose-a:text-primary-blue hover:prose-a:text-primary-red">
                      {post?.content && hasRichContent(post.content) ? (
                        renderXMLContent(post.content, "prose prose-slate max-w-none prose-headings:text-primary-blue prose-a:text-primary-blue hover:prose-a:text-primary-red")
                      ) : (
                        <ReactMarkdown>{post?.content || ""}</ReactMarkdown>
                      )}
                    </div>
                    
                    {post?.tags && post.tags.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <Link key={tag} href={`/blog/tag/${tag}`}>
                              <Badge variant="outline" className="hover:bg-primary-blue hover:text-white transition-colors">
                                {tag}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 pt-8 border-t">
                      <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Share className="mr-2 h-5 w-5" />
                        Share this article
                      </h2>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShare("facebook")}
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShare("twitter")}
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShare("linkedin")}
                          aria-label="Share on LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.posts && relatedPosts.posts.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-primary-blue flex items-center">
                      <Bookmark className="mr-2 h-5 w-5" />
                      Related Posts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.posts
                        // Filtering and slicing logic removed for user customization
                        .map((related: BlogPost) => (
                          <Card
                            key={related.id}
                            className="overflow-hidden rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]"
                          >
                            {related.featuredImage && (
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={related.featuredImage}
                                  alt={related.featuredImageAlt || related.title}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                              </div>
                            )}
                            <CardContent className="p-4 flex flex-col h-full">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-3">
                                <Link href={`/blog/${related.slug}`} className="hover:text-primary-blue transition-colors">
                                  {related.title}
                                </Link>
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                                {related.excerpt}
                              </p>
                              <div className="mt-auto mb-1">
                                <Link
                                  href={`/blog/${related.slug}`}
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
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-bold mb-4 text-primary-blue">Categories</h2>
                <Separator className="mb-4" />
                
                {!categories ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="mb-2">
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))
                ) : (
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        href="/blog" 
                        className="block p-2 rounded-md hover:bg-primary-blue/10 select-none hover:text-primary-blue font-medium transition-all"
                      >
                        All Posts
                      </Link>
                    </li>
                    {categories.map((category: BlogCategory) => (
                      <li key={category.id}>
                        <Link 
                          href={`/blog/category/${category.slug}`} 
                          className="block p-2 rounded-md hover:bg-primary-blue/10 select-none hover:text-primary-blue transition-all"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-bold mb-4 text-primary-blue">Quick Links</h2>
                <Separator className="mb-4" />
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/programs" 
                      className="flex items-center text-gray-700 hover:text-primary-blue hover:translate-x-1 transition-all duration-300 select-none"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-primary-blue" />
                      Our Programs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/results" 
                      className="flex items-center text-gray-700 hover:text-primary-blue hover:translate-x-1 transition-all duration-300 select-none"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-primary-blue" />
                      Success Stories
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/app" 
                      className="flex items-center text-gray-700 hover:text-primary-blue hover:translate-x-1 transition-all duration-300 select-none"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-primary-blue" />
                      iLearn App
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact" 
                      className="flex items-center text-gray-700 hover:text-primary-blue hover:translate-x-1 transition-all duration-300 select-none"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-primary-blue" />
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

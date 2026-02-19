import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { API } from "@/config/api";
import SiteSettingsEditor from "@/components/admin/SiteSettingsEditor";
import MediaLibrary from "@/components/admin/MediaLibrary";
import HeroSectionEditor from "@/components/admin/HeroSectionEditor";
import ToppersCarouselEditor from "@/components/admin/ToppersCarouselEditor";
import VideoTestimonialsEditor from "@/components/admin/VideoTestimonialsEditor";
import ImageTestimonialsEditor from "@/components/admin/ImageTestimonialsEditor";
import ProgramsEditor from "@/components/admin/ProgramsEditor";
import GalleryEventEditor from "@/components/admin/GalleryEventEditor";
import { SafeForm } from "@/components/ui/safe-form";
import AboutPageImageEditor from "@/components/admin/AboutPageImageEditor";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(API.BASEURL + API.AUTH_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        setLoginError(data.message || "Invalid credentials");
        toast({
          title: "Error",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoginError("An error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const response = await fetch(API.BASEURL + API.AUTH_VALIDATE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("refreshToken");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="container px-4 sm:px-6 mx-auto max-w-md py-8 sm:py-12">
        <Card className="shadow-lg">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">Log in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-base"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-base"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 sm:p-3 text-white rounded-md bg-primary-blue hover:bg-primary-blue-600 transition mt-2 sm:mt-4 text-base font-medium"
              >
                Log In
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-blue">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage website content and settings</p>
      </header>

      <Tabs defaultValue="home" className="space-y-6">
        <div className="relative">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap pb-2 scrollbar-thin scrollbar-thumb-gray-300">
            <TabsTrigger value="home" className="text-sm sm:text-base">Home</TabsTrigger>
            <TabsTrigger value="about" className="text-sm sm:text-base">About</TabsTrigger>
            <TabsTrigger value="results" className="text-sm sm:text-base">Results</TabsTrigger>
            <TabsTrigger value="programs" className="text-sm sm:text-base">Programs</TabsTrigger>
            <TabsTrigger value="blog" className="text-sm sm:text-base">Blog</TabsTrigger>
            <TabsTrigger value="app" className="text-sm sm:text-base">iLearn APP</TabsTrigger>
            <TabsTrigger value="gallery" className="text-sm sm:text-base">Gallery</TabsTrigger>
            <TabsTrigger value="contact" className="text-sm sm:text-base">Contact Us</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm sm:text-base">Site Settings</TabsTrigger>
          </TabsList>
        </div>

        {/* HOME PAGE SECTIONS */}
        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Page Sections</CardTitle>
              <CardDescription>
                Manage content for the homepage sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="hero">
                <div className="relative">
                  <TabsList className="mb-4 w-full flex overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300">
                    <TabsTrigger value="hero" className="text-xs sm:text-sm">Hero Section</TabsTrigger>
                    <TabsTrigger value="results-highlights" className="text-xs sm:text-sm">Results Highlights</TabsTrigger>
                    <TabsTrigger value="toppers-carousel" className="text-xs sm:text-sm">Toppers</TabsTrigger>
                    <TabsTrigger value="media-shoutouts" className="text-xs sm:text-sm">Media</TabsTrigger>
                    <TabsTrigger value="video-testimonials" className="text-xs sm:text-sm">Video Testimonials</TabsTrigger>
                    <TabsTrigger value="image-testimonials" className="text-xs sm:text-sm">Image Testimonials</TabsTrigger>
                    <TabsTrigger value="program-teasers" className="text-xs sm:text-sm">Programs</TabsTrigger>
                    <TabsTrigger value="cta" className="text-xs sm:text-sm">CTA</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="hero" className="space-y-4">
                  <SafeForm>
                    <HeroSectionEditor />
                  </SafeForm>
                </TabsContent>

                <TabsContent value="results-highlights" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Year Results Highlights</CardTitle>
                      <CardDescription>
                        Manage current year's top results and achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Future Results Highlights Editor Component */}
                      <p className="text-muted-foreground py-4">Results Highlights Editor coming soon</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="toppers-carousel" className="space-y-4">
                  <SafeForm>
                    <ToppersCarouselEditor />
                  </SafeForm>
                </TabsContent>

                <TabsContent value="media-shoutouts" className="space-y-4">
                  <SafeForm>
                    <MediaLibrary />
                  </SafeForm>
                </TabsContent>

                <TabsContent value="video-testimonials" className="space-y-4">
                  <SafeForm>
                    <VideoTestimonialsEditor />
                  </SafeForm>
                </TabsContent>

                <TabsContent value="image-testimonials" className="space-y-4">
                  <SafeForm>
                    <ImageTestimonialsEditor />
                  </SafeForm>
                </TabsContent>

                <TabsContent value="program-teasers" className="space-y-4">
                  <SafeForm>
                    <Card>
                      <CardHeader>
                        <CardTitle>Program Teasers</CardTitle>
                        <CardDescription>
                          Manage program preview content for homepage
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-500 text-sm mb-4">
                          Select programs to be featured on the homepage teaser section. For creating and managing all programs, navigate to Programs tab in the main menu.
                        </p>
                        <div className="border p-4 rounded-lg">
                          <p className="text-center py-8 text-muted-foreground">
                            To manage featured programs for the homepage, please visit the <span className="font-medium">Programs</span> tab and use the <span className="font-medium">Homepage Features</span> section.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </SafeForm>
                </TabsContent>

                <TabsContent value="cta" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Call to Action</CardTitle>
                      <CardDescription>
                        Manage CTA section with buttons and promotional content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Future CTA Editor Component */}
                      <p className="text-muted-foreground py-4">Call to Action Editor coming soon</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT PAGE SECTIONS */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Page Sections</CardTitle>
              <CardDescription>
                Manage content for the about page sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="main">
                <div className="relative">
                  <TabsList className="mb-4 w-full flex overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300">
                    <TabsTrigger value="main" className="text-xs sm:text-sm">Main</TabsTrigger>
                    <TabsTrigger value="milestone" className="text-xs sm:text-sm">Milestone</TabsTrigger>
                    <TabsTrigger value="core-values" className="text-xs sm:text-sm">Core Values</TabsTrigger>
                    <TabsTrigger value="faculty" className="text-xs sm:text-sm">Faculty</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="main" className="space-y-4">
                  <AboutPageImageEditor />
                </TabsContent>

                <TabsContent value="milestone" className="space-y-4">
                  <p className="text-muted-foreground py-4">Milestone Editor coming soon</p>
                </TabsContent>
                
                <TabsContent value="core-values" className="space-y-4">
                  <p className="text-muted-foreground py-4">Core Values Editor coming soon</p>
                </TabsContent>
                
                <TabsContent value="faculty" className="space-y-4">
                  <p className="text-muted-foreground py-4">Faculty Editor coming soon</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RESULTS PAGE SECTIONS */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Results Page Sections</CardTitle>
              <CardDescription>
                Manage content for the results page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="results-carousel">
                <div className="relative">
                  <TabsList className="mb-4 w-full flex overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300">
                    <TabsTrigger value="results-carousel" className="text-xs sm:text-sm">Results Carousel</TabsTrigger>
                    <TabsTrigger value="results-summary" className="text-xs sm:text-sm">Results Summary</TabsTrigger>
                    <TabsTrigger value="top-achievers" className="text-xs sm:text-sm">Top Achievers</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="results-carousel" className="space-y-4">
                  <p className="text-muted-foreground py-4">Results Carousel Editor coming soon</p>
                </TabsContent>
                
                <TabsContent value="results-summary" className="space-y-4">
                  <p className="text-muted-foreground py-4">Results Summary Editor coming soon</p>
                </TabsContent>
                
                <TabsContent value="top-achievers" className="space-y-4">
                  <p className="text-muted-foreground py-4">Top Achievers Editor coming soon</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROGRAMS PAGE SECTIONS */}
        <TabsContent value="programs" className="space-y-4">
          <SafeForm>
            <ProgramsEditor />
          </SafeForm>
        </TabsContent>

        {/* BLOG PAGE SECTIONS */}
        <TabsContent value="blog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Management</CardTitle>
              <CardDescription>
                Manage blog posts, categories and tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-4">Blog Editor coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APP PAGE SECTIONS */}
        <TabsContent value="app" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>iLearn APP Page</CardTitle>
              <CardDescription>
                Manage content for the mobile app page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-4">iLearn App Page Editor coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GALLERY PAGE SECTIONS */}
        <TabsContent value="gallery" className="space-y-4">
          <SafeForm>
            <GalleryEventEditor />
          </SafeForm>
        </TabsContent>

        {/* CONTACT PAGE SECTIONS */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Page</CardTitle>
              <CardDescription>
                Manage contact information and inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-4">Contact Page Editor coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SITE SETTINGS */}
        <TabsContent value="settings" className="space-y-4">
          <SafeForm>
            <SiteSettingsEditor />
          </SafeForm>
        </TabsContent>
      </Tabs>
    </div>
  );
}

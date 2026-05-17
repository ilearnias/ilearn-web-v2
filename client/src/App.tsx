import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ProgressBar from "@/components/layout/ProgressBar";
import IgnitePage from "@/pages/ignitePage";
// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ResultsPage from "@/pages/ResultsPage";
import ProgramsPage from "@/pages/ProgramsPage";
import ProgramDetailPage from "@/pages/ProgramDetailPage";
import AppPage from "@/pages/AppPage";
import GalleryPage from "@/pages/GalleryPage";
import ContactPage from "@/pages/ContactPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import BlogPostDetailPage from "@/pages/BlogPostDetailPage";
import AdminPage from "@/pages/AdminPage";
import PcmProgramPage from "@/pages/PcmProgramPage";
import CanaProgramPage from "@/pages/CanaProgramPage";
import FoundationCoursePage from "@/pages/FoundationCoursePage";
import InterviewGuidanceProgram from "@/pages/Interview_Guidance_Program ";
import IntegratedPrelimsTestSeries from "@/pages/Integrated_Prelims_Test_Series";
import GeographyOptional from "@/pages/Geography_Optional";
import SociologyOptional from "@/pages/sociology-optional";
import PoliticalScienceIROptional from "@/pages/Political_Science_IR_Optional";
import MalayalamOptional from "@/pages/Malayalam_Optional";
import PublicAdministrationOptional from "@/pages/Public_Administration_Optional";
import JuniorPage from "@/pages/JuniorPage";
import NotFound from "@/pages/not-found";

const isBrowser = typeof window !== "undefined";

function ScrollToTop() {
  const [location, setLocation] = useState<string>(
    isBrowser ? window.location.pathname : "/"
  );

  useEffect(() => {
    if (!isBrowser) return;

    const handleLocationChange = () => {
      const newLocation = window.location.pathname;
      if (newLocation !== location) {
        setLocation(newLocation);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    window.addEventListener("popstate", handleLocationChange);

    const originalPushState = history.pushState;
    // @ts-ignore
    history.pushState = function () {
      // @ts-ignore
      const result = originalPushState.apply(this, arguments);
      handleLocationChange();
      return result;
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      history.pushState = originalPushState;
    };
  }, [location]);

  return null;
}

function Routes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/programs" component={ProgramsPage} />
      <Route path="/programs/prelims-cum-mains" component={PcmProgramPage} />
      <Route
        path="/programs/current-affairs-news-analysis"
        component={CanaProgramPage}
      />
      <Route
        path="/foundation"
        component={FoundationCoursePage}
      />
      <Route
        path="/programs/interview-guidance-program"
        component={InterviewGuidanceProgram}
      />
      <Route
        path="/programs/integrated-prelims-test-series"
        component={IntegratedPrelimsTestSeries}
      />

      <Route
        path="/programs/geography-optional"
        component={GeographyOptional}
      />
      <Route
        path="/programs/sociology-optional"
        component={SociologyOptional}
      />
      <Route
        path="/programs/political-science-ir-optional"
        component={PoliticalScienceIROptional}
      />
      <Route
        path="/programs/malayalam-optional"
        component={MalayalamOptional}
      />
      <Route
        path="/programs/public-administration-optional"
        component={PublicAdministrationOptional}
      />
      <Route path="/programs/:slug" component={ProgramDetailPage} />
      <Route path="/app" component={AppPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/foundation/ignite" component={IgnitePage} />
      <Route path="/blog/category/:categorySlug" component={BlogPage} />
      <Route path="/blog/tag/:tag" component={BlogPage} />
      <Route path="/blog/post/:slug" component={BlogPostDetailPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/foundation/junior" component={JuniorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

interface AppProps {
  ssrPath?: string;
}

function App({ ssrPath }: AppProps) {
  const content = (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isBrowser && <ProgressBar />}
        <Navbar />
        {isBrowser && <ScrollToTop />}
        <Routes />
        <Footer />
        {isBrowser && <FloatingWhatsApp />}
      </TooltipProvider>
    </QueryClientProvider>
  );

  // On the server, wrap with wouter's Router providing the URL
  if (ssrPath) {
    return <WouterRouter ssrPath={ssrPath}>{content}</WouterRouter>;
  }

  return content;
}

export default App;

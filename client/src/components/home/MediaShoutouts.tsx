import React, { useState, useRef } from "react";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/config/apiClient";
import { API } from "@/config/api";
import QUERY_KEY from "@/config/queryKeys";
import VideoModal from "@/components/common/VideoModal";
import VideoThumbnail from "@/components/common/VideoThumbnail";

// API response types
interface MediaVideo {
  id: string;
  description: string;
  video: string;
  isActive: boolean;
  isTestimonial: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  thumbnail: string; // Added thumbnail field
}

interface MediaApiResponse {
  status: boolean;
  message: string;
  data: MediaVideo[];
  meta: {
    limit: number;
    itemCount: number;
    page: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

const MediaShoutouts = () => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to a specific video index
  const scrollToIndex = (idx: number) => {
    setCurrentIndex(idx);
    if (scrollRef.current) {
      const child = scrollRef.current.children[idx] as HTMLElement;
      if (child) {
        child.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  };

  // Fetch paginated media videos from API

  const { data: apiData, isLoading } = useQuery<MediaApiResponse>({
    queryKey: [QUERY_KEY.MEDIA, page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `${API.MEDIA}?isTestimonial=false&isActive=true&page=${page}&limit=${limit}`
      );
      return response.data;
    },
    // keepPreviousData removed due to linter error
  });

  const videos = apiData?.data || [];
  const meta = apiData?.meta;

  // Open video dialog
  const openVideoDialog = (video: MediaVideo) => {
    setSelectedVideo(video);
    setIsVideoDialogOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Close video dialog
  const closeVideoDialog = () => {
    setIsVideoDialogOpen(false);
    setSelectedVideo(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <section className="py-14 bg-[#f8f9fe]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue via-primary-blue to-primary-red">
                iLearn in Media
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
            </h2>
            <p className="text-neutral-600 mt-3">
              Watch our featured videos and success stories
            </p>
          </div>
          {/* Horizontally Scrollable Video Row */}
          <div className="relative">
            <div
              className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar"
              ref={scrollRef}
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {isLoading ? (
                <div className="w-full flex justify-center items-center h-48">
                  <div className="w-10 h-10 border-3 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                videos.map((video: MediaVideo, idx: number) => (
                  <div
                    key={video.id}
                    className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                    style={{ scrollSnapAlign: "center" }}
                    onClick={() => openVideoDialog(video)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative overflow-hidden">
                      <VideoThumbnail
                        url={video.thumbnail}
                        alt={video.description}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        fallbackImage={video.thumbnail}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-primary-red rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-base text-neutral-800 line-clamp-2 leading-tight">
                        {video.description}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Dot navigation */}
            <div className="flex justify-center mt-4 gap-2">
              {videos.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentIndex === idx ? "bg-primary-blue" : "bg-neutral-300"
                  }`}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Go to video ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoDialogOpen}
        onClose={closeVideoDialog}
        videoUrl={selectedVideo?.video || ""}
        title={selectedVideo?.description}
        description={selectedVideo?.description}
      />
    </>
  );
};

export default MediaShoutouts;

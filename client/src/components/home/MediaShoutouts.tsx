import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play } from 'lucide-react';

// Static video data for iLearn in Media section
interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  embedUrl: string;
}

const mediaVideos: VideoData[] = [
  {
    id: 'mu-eiYz9Ur8',
    title: 'iLearn IAS Academy - Success Stories',
    url: 'https://youtu.be/mu-eiYz9Ur8?si=npVhpO0o-NCOvzaf',
    thumbnail: 'https://img.youtube.com/vi/mu-eiYz9Ur8/maxresdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/mu-eiYz9Ur8?autoplay=1&rel=0'
  },
  {
    id: 'sqCCeYqFj30',
    title: 'UPSC Preparation Guide by iLearn',
    url: 'https://youtu.be/sqCCeYqFj30?si=vVLXgbNarlvv5Y-e',
    thumbnail: 'https://img.youtube.com/vi/sqCCeYqFj30/maxresdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/sqCCeYqFj30?autoplay=1&rel=0'
  },
  {
    id: 'ZyAtOz00oEs',
    title: 'iLearn Academy Training Program',
    url: 'https://youtu.be/ZyAtOz00oEs',
    thumbnail: 'https://img.youtube.com/vi/ZyAtOz00oEs/maxresdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/ZyAtOz00oEs?autoplay=1&rel=0'
  },
  {
    id: 'NEehMXQ0zdk',
    title: 'Civil Services Coaching Excellence',
    url: 'https://www.youtube.com/watch?v=NEehMXQ0zdk',
    thumbnail: 'https://img.youtube.com/vi/NEehMXQ0zdk/maxresdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/NEehMXQ0zdk?autoplay=1&rel=0'
  }
];

const MediaShoutouts = () => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  // Open video dialog
  const openVideoDialog = (video: VideoData) => {
    setSelectedVideo(video);
    setIsVideoDialogOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close video dialog
  const closeVideoDialog = () => {
    setIsVideoDialogOpen(false);
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <section className="py-14 bg-[#f8f9fe]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue via-primary-blue to-primary-red">iLearn in Media</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-blue to-primary-red rounded-full transform origin-left"></span>
            </h2>
            <p className="text-neutral-600 mt-3">Watch our featured videos and success stories</p>
          </div>
          
          {/* Horizontally Scrollable Video Row */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar">
              {mediaVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                  onClick={() => openVideoDialog(video)}
                >
                {/* Video Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
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
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={isVideoDialogOpen} onOpenChange={closeVideoDialog}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black">
          {selectedVideo && (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              <iframe
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaShoutouts;
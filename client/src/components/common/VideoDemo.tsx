import React, { useState } from 'react';
import { Play } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import VideoThumbnail from './VideoThumbnail';
import VideoModal from './VideoModal';

interface VideoDemoProps {
  className?: string;
}

const VideoDemo: React.FC<VideoDemoProps> = ({ className = "" }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Example videos from different platforms
  const demoVideos = [
    {
      id: '1',
      title: 'YouTube Video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Example YouTube video'
    },
    {
      id: '2',
      title: 'Vimeo Video',
      url: 'https://vimeo.com/148751763',
      description: 'Example Vimeo video'
    },
    {
      id: '3',
      title: 'Direct MP4 Video',
      url: '/assets/hero-video-new.mp4',
      description: 'Example direct video file'
    },
    {
      id: '4',
      title: 'Facebook Video',
      url: 'https://www.facebook.com/facebook/videos/10153231379946729/',
      description: 'Example Facebook video'
    },
    {
      id: '6',
      title: 'Facebook Share Video (R)',
      url: 'https://www.facebook.com/share/r/172fnSSQ2t/?mibextid=wwXIfr',
      description: 'Example Facebook share video (r format)'
    },
    {
      id: '7',
      title: 'Facebook Share Video (V)',
      url: 'https://www.facebook.com/share/v/1GAYagXzDu/?mibextid=wwXIfr',
      description: 'Example Facebook share video (v format)'
    },
    {
      id: '5',
      title: 'Instagram Reel',
      url: 'https://www.instagram.com/p/Bh4eXh0jW5x/',
      description: 'Example Instagram reel'
    }
  ];

  const openVideoModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Video Platform Demo</h2>
        <p className="text-gray-600">Testing different video platforms and formats</p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => openVideoModal(video.url)}
          >
            {/* Thumbnail */}
            <div className="relative">
              <VideoThumbnail
                url={video.url}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
            
            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
              <p className="text-gray-600 text-sm">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Video Player Example */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Direct Video Player Example</h3>
        <div className="relative w-full max-w-2xl mx-auto" style={{ paddingBottom: '56.25%' }}>
          <VideoPlayer
            url="/assets/hero-video-new.mp4"
            title="Direct Video Example"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={closeVideoModal}
        videoUrl={selectedVideo || ''}
        title="Demo Video"
        description="This is a demo video from various platforms"
      />
    </div>
  );
};

export default VideoDemo; 
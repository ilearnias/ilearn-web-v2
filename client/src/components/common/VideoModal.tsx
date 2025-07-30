import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  description?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title = "Video",
  description
}) => {
  const handleClose = () => {
    onClose();
    // Re-enable body scroll when modal closes
    document.body.style.overflow = 'auto';
  };

  const handleOpen = () => {
    // Disable body scroll when modal opens
    document.body.style.overflow = 'hidden';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-4xl w-[95vw] p-0 bg-black border-0"
        onOpenAutoFocus={handleOpen}
      >
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Video player */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <VideoPlayer
              url={videoUrl}
              title={title}
              className="absolute inset-0 w-full h-full"
              allowFullScreen={true}
            />
          </div>
          
          {/* Video info */}
          {description && (
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">
                {description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal; 
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

/**
 * VideoPlayer Component
 * Uses a 4:5 aspect ratio container that adapts to different aspect ratios
 * Videos (16:9, 9:16, 1:1) will be centered and cropped appropriately within this container
 */
const VideoPlayer = ({
  src,
  poster,
  className,
  muted = true,
  autoPlay = true,
  loop = true,
  controls = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Play video when component mounts if autoPlay is true
    if (autoPlay) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented
          // Show a UI element to let the user manually start playback
          console.log("Autoplay prevented. User interaction required to play video.");
        });
      }
    }
  }, [autoPlay, src]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        className={cn('max-h-full max-w-full', className)}
        src={src}
        poster={poster}
        muted={muted}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
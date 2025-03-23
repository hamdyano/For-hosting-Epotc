import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="w-full aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        config={{
          youtube: {
            playerVars: { modestbranding: 1, rel: 0 },
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;














'use client';

import { useState } from 'react';
import { Play, Video } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl?: string;
  videoThumbnail?: string;
  title: string;
}

export default function VideoPreview({ videoUrl, videoThumbnail, title }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl && !videoThumbnail) {
    return (
      <div className="relative aspect-video bg-surface-muted rounded-lg flex items-center justify-center border border-border">
        <div className="text-center">
          <Video className="w-6 h-6 text-ink-tertiary mx-auto mb-1" />
          <span className="text-ink-tertiary text-xs">Video coming soon</span>
        </div>
      </div>
    );
  }

  if (isPlaying && videoUrl) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full object-cover"
          aria-label={`Video: ${title}`}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="relative aspect-video w-full rounded-lg overflow-hidden group cursor-pointer"
      aria-label={`Play video: ${title}`}
    >
      {videoThumbnail ? (
        <img
          src={videoThumbnail}
          alt={`Preview: ${title}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-surface-muted" />
      )}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <div className="w-12 h-12 bg-accent/90 hover:bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-5 h-5 text-white ml-0.5" />
        </div>
      </div>
    </button>
  );
}

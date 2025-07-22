'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3, Download, Maximize } from 'lucide-react';

interface SlideViewerProps {
  keynoteSlug: string;
  className?: string;
}

interface SlideInfo {
  src: string;
  alt: string;
  index: number;
}

export default function SlideViewer({ keynoteSlug, className = '' }: SlideViewerProps) {
  const [slides, setSlides] = useState<SlideInfo[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    loadSlides();
  }, [keynoteSlug]);

  const loadSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const slideUrls: SlideInfo[] = [];
      let slideIndex = 1;
      const maxSlides = 50; // Prevent infinite loop
      
      // Try to load slides until we hit a 404
      while (slideIndex <= maxSlides) {
        const extensions = ['jpg', 'jpeg', 'png', 'webp'];
        let found = false;
        
        for (const ext of extensions) {
          try {
            const url = `/slides/${keynoteSlug}/slide_${slideIndex}.${ext}`;
            const response = await fetch(url, { method: 'HEAD' });
            
            if (response.ok) {
              slideUrls.push({
                src: url,
                alt: `Slide ${slideIndex}`,
                index: slideIndex
              });
              found = true;
              break;
            }
          } catch {
            // Continue trying other extensions
          }
        }
        
        if (!found) {
          break; // No more slides found
        }
        
        slideIndex++;
      }
      
      if (slideUrls.length === 0) {
        throw new Error('No slides found');
      }
      
      setSlides(slideUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setShowThumbnails(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') setFullscreen(false);
  };

  const downloadSlide = () => {
    if (slides[currentSlide]) {
      const link = document.createElement('a');
      link.href = slides[currentSlide].src;
      link.download = `slide_${currentSlide + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-lg mb-2">No slides available</div>
          <div className="text-sm">Add slides to `/public/slides/{keynoteSlug}/`</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="text-white font-medium">
          Slide {currentSlide + 1} of {slides.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle thumbnails"
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={downloadSlide}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Download slide"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="p-4 border-b border-white/20 bg-black/20">
          <div className="flex gap-2 overflow-x-auto">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 relative ${
                  index === currentSlide ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-20 h-12 object-cover rounded border border-white/20"
                />
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main slide display */}
      <div 
        className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-video'}`}
        onKeyDown={handleKeyPress}
        tabIndex={0}
      >
        <img
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          className="w-full h-full object-contain"
        />
        
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          disabled={slides.length <= 1}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={nextSlide}
          disabled={slides.length <= 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide indicator dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Fullscreen exit */}
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Footer with navigation info */}
      <div className="p-4 bg-black/20 text-center text-sm text-white/70">
        Use arrow keys to navigate • Click thumbnails to jump to slide
      </div>
    </div>
  );
}
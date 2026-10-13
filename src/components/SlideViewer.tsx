'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3, Download, Maximize } from 'lucide-react';
import styles from './SlideViewer.module.css';

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
      <div className={`${styles.statusShell} ${className}`}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className={`${styles.statusShell} ${className}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>No slides available</div>
          <div className={styles.emptyHint}>Add slides to `/public/slides/{keynoteSlug}/`</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.shell} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          Slide {currentSlide + 1} of {slides.length}
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={styles.iconButton}
            title="Toggle thumbnails"
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={downloadSlide}
            className={styles.iconButton}
            title="Download slide"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className={styles.iconButton}
            title="Fullscreen"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className={styles.thumbnails}>
          <div className={styles.thumbnailRow}>
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.thumbnailButton} ${
                  index === currentSlide ? styles.thumbnailActive : ''
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className={styles.thumbnailImage}
                />
                <div className={styles.thumbnailIndex}>
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main slide display */}
      <div
        className={`${styles.stage} ${fullscreen ? styles.stageFullscreen : ''}`}
        onKeyDown={handleKeyPress}
        tabIndex={0}
      >
        <img
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          className={styles.stageImage}
        />

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          disabled={slides.length <= 1}
          className={`${styles.navArrow} ${styles.navArrowLeft}`}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          disabled={slides.length <= 1}
          className={`${styles.navArrow} ${styles.navArrowRight}`}
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide indicator dots */}
        {slides.length > 1 && (
          <div className={styles.dots}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.dot} ${
                  index === currentSlide ? styles.dotActive : ''
                }`}
              />
            ))}
          </div>
        )}

        {/* Fullscreen exit */}
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className={styles.fullscreenExit}
          >
            ✕
          </button>
        )}
      </div>

      {/* Footer with navigation info */}
      <div className={styles.footer}>
        Use arrow keys to navigate • Click thumbnails to jump to slide
      </div>
    </div>
  );
}
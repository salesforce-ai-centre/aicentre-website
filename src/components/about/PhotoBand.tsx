/**
 * PhotoBand — full-width band of rounded photo tiles with curved edge masks.
 *
 * A horizontally auto-scrolling strip of photos with convex ellipse masks
 * top and bottom (in the page background), and an "Explore the centre"
 * button beneath. Figma node 7:119 (carousel) + 7:120/7:123 (ellipse masks).
 *
 * Photos come from content/gallery.json. When empty, branded gradient
 * placeholder tiles are shown so the layout holds until real photos land.
 * Auto-scroll pauses for prefers-reduced-motion.
 *
 * AIC2-138 — part of the About Page epic (AIC2-127).
 */

'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import gallery from '../../../content/gallery.json';

const PLACEHOLDER_COUNT = 8;

export default function PhotoBand() {
  const images = (gallery.images as string[]) ?? [];
  const hasImages = images.length > 0;
  // Duplicate the set so the marquee can loop seamlessly.
  const tiles = hasImages
    ? [...images, ...images]
    : Array.from({ length: PLACEHOLDER_COUNT * 2 }, (_, i) => `placeholder-${i}`);

  const trackRef = useRef<HTMLDivElement>(null);

  // Gentle auto-scroll marquee; disabled under reduced-motion.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const step = () => {
      track.scrollLeft += 0.5;
      // Loop back once the first (duplicated) half has scrolled past.
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative py-8">
      {/* Convex ellipse masks (page background) top & bottom of the strip. */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 z-10 h-16 rounded-[50%] bg-page-gradient" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-8 z-10 h-16 rounded-[50%] bg-page-gradient" />

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-hidden px-4"
        aria-label="Photos from the AI Centre"
      >
        {tiles.map((tile, i) => (
          <div
            key={i}
            className="relative h-[280px] w-[160px] shrink-0 overflow-hidden rounded-2xl sm:h-[360px] sm:w-[210px]"
          >
            {hasImages ? (
              <Image
                src={images[i % images.length]}
                alt=""
                fill
                className="object-cover"
                sizes="210px"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand/20 to-brand/5" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button href="/experiences">Explore the centre</Button>
      </div>
    </section>
  );
}

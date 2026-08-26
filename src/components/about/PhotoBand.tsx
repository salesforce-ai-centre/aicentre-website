/**
 * PhotoBand — concave "coverflow" photo carousel for the About page.
 *
 * Reads like the *inside* of a carousel drum: the centre image sits back
 * (smaller, flat) and images toward the outer edges are larger and skewed
 * inward. Auto-scrolls continuously and loops seamlessly (infinite / repeating)
 * by rendering the image set multiple times and wrapping scrollLeft by one
 * set-width without a visible jump. Transforms update live from each tile's
 * distance to the viewport centre. Figma node 7:119.
 *
 * Photos come from content/gallery.json; branded gradient placeholder tiles
 * show until real photos land. Under prefers-reduced-motion the auto-scroll
 * stops (manual scroll still works, transforms still apply).
 *
 * AIC2-138 — part of the About Page epic (AIC2-127).
 */

'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import gallery from '../../../content/gallery.json';

const PLACEHOLDER_COUNT = 6;
const REPEATS = 3; // render the set 3× so the loop has content either side
const SPEED = 0.4; // px per frame auto-scroll
const FALLOFF = 520; // px from centre to reach the full edge transform
const MAX_SKEW = 22; // degrees, rotated inward toward the viewer
const MIN_SCALE = 0.72; // centre tile (sits back)
const MAX_SCALE = 1.06; // outer tiles (loom larger)

export default function PhotoBand() {
  const images = (gallery.images as string[]) ?? [];
  const hasImages = images.length > 0;
  const baseCount = hasImages ? images.length : PLACEHOLDER_COUNT;
  const total = baseCount * REPEATS;

  const trackRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Recompute each tile's transform from its distance to the viewport centre.
  const applyTransforms = useCallback(() => {
    const viewportCentre = window.innerWidth / 2;
    tileRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const tileCentre = rect.left + rect.width / 2;
      const offset = Math.max(-1, Math.min(1, (tileCentre - viewportCentre) / FALLOFF));
      const dist = Math.abs(offset);
      const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * dist;
      const skew = -offset * MAX_SKEW; // skew inward toward centre
      el.style.transform = `perspective(1200px) scale(${scale.toFixed(3)}) skewY(${skew.toFixed(2)}deg)`;
      el.style.zIndex = String(Math.round((1 - dist) * 10));
      el.style.opacity = (0.5 + 0.5 * dist).toFixed(2);
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Start one full set in, so there's a set to the left to loop through.
    const setWidth = () => track.scrollWidth / REPEATS;
    track.scrollLeft = setWidth();
    applyTransforms();

    let raf = 0;
    const frame = () => {
      if (!reduced) track.scrollLeft += SPEED;
      // Seamless wrap: keep scrollLeft within the middle set.
      const w = setWidth();
      if (track.scrollLeft >= w * 2) track.scrollLeft -= w;
      else if (track.scrollLeft <= 0) track.scrollLeft += w;
      applyTransforms();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => applyTransforms();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [applyTransforms]);

  return (
    <section className="py-10" aria-label="Photos from the AI Centre">
      {/* overflow-y-visible + vertical padding so scaled/skewed edge tiles aren't clipped. */}
      <div
        ref={trackRef}
        className="flex items-center gap-5 overflow-x-auto overflow-y-visible py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className="relative h-[300px] w-[200px] shrink-0 overflow-hidden rounded-2xl shadow-card will-change-transform sm:h-[380px] sm:w-[260px]"
          >
            {hasImages ? (
              <Image
                src={images[i % baseCount]}
                alt=""
                fill
                className="object-cover"
                sizes="260px"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand/25 to-brand/5" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button href="/experiences">Explore the centre</Button>
      </div>
    </section>
  );
}

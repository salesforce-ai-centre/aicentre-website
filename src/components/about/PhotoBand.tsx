/**
 * PhotoBand — concave cylinder photo carousel for the About page.
 *
 * Images sit around the inside of a shallow cylinder: the centre image faces
 * the viewer flat, and images toward the edges rotate away (rotateY) so they
 * appear to curve backward — a gentle coverflow, not a harsh skew. Sharp
 * corners, per the design. Transforms update live from each tile's distance
 * to the viewport centre. Figma node 7:119.
 *
 * Auto-scrolls continuously and loops seamlessly by rendering the image set
 * 3× and wrapping scrollLeft by one set-width. Under prefers-reduced-motion
 * the auto-scroll stops (manual scroll + transforms still work).
 *
 * Styling lives in PhotoBand.module.css (custom CSS for the 3D scene).
 *
 * AIC2-138 — part of the About Page epic (AIC2-127).
 */

'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import gallery from '../../../content/gallery.json';
import styles from './PhotoBand.module.css';

const PLACEHOLDER_COUNT = 6;
const REPEATS = 3; // render the set 3× so the loop has content either side
const SPEED = 0.4; // px per frame auto-scroll
const FALLOFF = 620; // px from centre to reach the full edge transform
const MAX_ROTATE = 38; // degrees rotateY at the edges (gentle cylinder curve)
const MIN_SCALE = 0.9; // edge tiles recede slightly
const MAX_SCALE = 1; // centre tile faces the viewer, full size

export default function PhotoBand() {
  const images = (gallery.images as string[]) ?? [];
  const hasImages = images.length > 0;
  const baseCount = hasImages ? images.length : PLACEHOLDER_COUNT;
  const total = baseCount * REPEATS;

  const trackRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Rotate each tile around the cylinder based on distance to viewport centre.
  const applyTransforms = useCallback(() => {
    const viewportCentre = window.innerWidth / 2;
    tileRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const tileCentre = rect.left + rect.width / 2;
      // -1 (far left) → 0 (centre) → 1 (far right), clamped.
      const offset = Math.max(-1, Math.min(1, (tileCentre - viewportCentre) / FALLOFF));
      const dist = Math.abs(offset);
      // Edge tiles rotate away from the viewer; sign turns them inward.
      const rotate = -offset * MAX_ROTATE;
      const scale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * dist;
      el.style.transform = `rotateY(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.zIndex = String(Math.round((1 - dist) * 10));
      el.style.opacity = (1 - dist * 0.25).toFixed(2);
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setWidth = () => track.scrollWidth / REPEATS;
    track.scrollLeft = setWidth(); // start one set in, room to loop left
    applyTransforms();

    let raf = 0;
    const frame = () => {
      if (!reduced) track.scrollLeft += SPEED;
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
    <section className={styles.section} aria-label="Photos from the AI Centre">
      <div ref={trackRef} className={styles.track}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className={styles.tile}
          >
            {hasImages ? (
              <Image
                src={images[i % baseCount]}
                alt=""
                fill
                className={styles.image}
                sizes="260px"
              />
            ) : (
              <div className={styles.placeholder} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.button}>
        <Button href="/experiences">Explore the centre</Button>
      </div>
    </section>
  );
}

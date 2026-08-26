/**
 * PhotoBand — concave cylinder photo carousel for the About page.
 *
 * Images wrap around the inside of a cylinder: the centre image faces the
 * viewer, and tiles toward the edges rotate away (rotateY) AND rise up along
 * a parabola (translateY) so the top and bottom of the strip bow into a
 * concave curve — like looking into the inside of a carousel drum.
 * Sharp corners, per the design. Figma node 7:119.
 *
 * Auto-scrolls continuously and loops seamlessly: the image set is rendered
 * 3× and a float scroll accumulator wraps by one set-width. (scrollLeft is
 * integer-quantised, so we track the position as a float and assign it —
 * incrementing scrollLeft directly by <1px never accumulates.)
 * prefers-reduced-motion stops the auto-scroll; manual scroll still curves.
 *
 * Styling lives in PhotoBand.module.css.
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
const SPEED = 0.6; // px per frame auto-scroll
const FALLOFF = 640; // px from centre over which the curve develops
const MAX_ROTATE = 42; // deg rotateY at the edges (cylinder wall)
const ARC_RISE = 90; // px the edge tiles lift, bowing the strip into a curve
const MIN_SCALE = 0.82; // edge tiles recede
const MAX_SCALE = 1; // centre tile faces the viewer, full size

export default function PhotoBand() {
  const images = (gallery.images as string[]) ?? [];
  const hasImages = images.length > 0;
  const baseCount = hasImages ? images.length : PLACEHOLDER_COUNT;
  const total = baseCount * REPEATS;

  const trackRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(0); // float scroll position (scrollLeft floors sub-px increments)
  const selfScrollRef = useRef(false); // true while WE set scrollLeft, so onScroll ignores it

  // Curve each tile from its distance to the viewport centre.
  const applyTransforms = useCallback(() => {
    const viewportCentre = window.innerWidth / 2;
    tileRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const tileCentre = rect.left + rect.width / 2;
      // -1 (far left) → 0 (centre) → 1 (far right), clamped.
      const offset = Math.max(-1, Math.min(1, (tileCentre - viewportCentre) / FALLOFF));
      const dist = Math.abs(offset);

      const rotate = -offset * MAX_ROTATE; // edges rotate away from viewer
      const scale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * dist;
      // Parabolic rise: 0 at centre, ARC_RISE at the edges → concave bow.
      const lift = -ARC_RISE * dist * dist;

      el.style.transform = `translateY(${lift.toFixed(1)}px) rotateY(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.zIndex = String(Math.round((1 - dist) * 10));
      el.style.opacity = (1 - dist * 0.3).toFixed(2);
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setWidth = () => track.scrollWidth / REPEATS;

    // Start one full set in, so there's a set to the left to loop through.
    posRef.current = setWidth();
    track.scrollLeft = posRef.current;
    applyTransforms();

    let raf = 0;
    const frame = () => {
      const w = setWidth();
      if (!reduced) {
        posRef.current += SPEED;
        if (posRef.current >= w * 2) posRef.current -= w; // seamless wrap
        selfScrollRef.current = true;
        track.scrollLeft = posRef.current; // assign float → actually moves
      }
      applyTransforms();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Manual scroll (drag/trackpad): keep the float accumulator in sync + re-wrap.
    // Ignore scroll events we triggered ourselves by assigning scrollLeft.
    const onScroll = () => {
      if (selfScrollRef.current) {
        selfScrollRef.current = false;
        return;
      }
      const w = setWidth();
      posRef.current = track.scrollLeft;
      if (posRef.current >= w * 2) {
        posRef.current -= w;
        track.scrollLeft = posRef.current;
      } else if (posRef.current <= 0) {
        posRef.current += w;
        track.scrollLeft = posRef.current;
      }
      applyTransforms();
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => applyTransforms();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener('scroll', onScroll);
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

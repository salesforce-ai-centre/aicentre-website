/**
 * PhotoBand — curved panoramic 3D carousel for the About page.
 *
 * Images are arranged around the inside wall of a cylinder: each tile is
 * rotated to its own angle and pushed out by the drum radius
 * (rotateY(θ) translateZ(radius)), so they form a genuine curved panorama —
 * the front image faces the viewer and the neighbours curve back into 3D
 * depth. The whole ring auto-rotates continuously; the user cannot scroll it.
 * Sharp corners, per the design. Figma node 7:119.
 *
 * Technique per the "curved panoramic 3D carousel" pattern. prefers-reduced-
 * motion freezes the rotation. Styling in PhotoBand.module.css.
 *
 * AIC2-138 — part of the About Page epic (AIC2-127).
 */

'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import gallery from '../../../content/gallery.json';
import styles from './PhotoBand.module.css';

// Fewer tiles around the circle → each spans a wider angle → a tighter drum.
// With the camera inside (deep perspective), the side walls curve toward the
// viewer and reach the screen edges, so more of the cylinder is visible.
const PLACEHOLDER_COUNT = 9;
const TILE_WIDTH = 360; // must match .tile width in the CSS module
const GAP = 20; // small gap → tiles sit tight against each other
const SPEED = 0.1; // degrees of ring rotation per frame

export default function PhotoBand() {
  const images = (gallery.images as string[]) ?? [];
  const hasImages = images.length > 0;
  const count = hasImages ? images.length : PLACEHOLDER_COUNT;

  // Even angular spacing around the full circle.
  const anglePer = 360 / count;
  // Radius so tiles sit side by side: half-chord / tan(halfAngle).
  const radius = Math.round(
    (TILE_WIDTH + GAP) / 2 / Math.tan((Math.PI * anglePer) / 360),
  );

  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // leave the ring static (still curved)

    let raf = 0;
    const frame = () => {
      rotationRef.current -= SPEED;
      // Camera sits INSIDE the cylinder (no translateZ pullback on the ring),
      // so images wrap around the viewer and the side images curve toward us.
      ring.style.transform = `rotateY(${rotationRef.current}deg)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [radius]);

  return (
    <section className={styles.section} aria-label="Photos from the AI Centre">
      <div className={styles.stage}>
        <div ref={ringRef} className={styles.ring}>
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className={styles.tile}
              style={{
                // Place on the cylinder wall, then flip 180° to face inward
                // toward the camera at the centre (we're inside the cylinder).
                transform: `rotateY(${i * anglePer}deg) translateZ(${radius}px) rotateY(180deg)`,
              }}
            >
              {hasImages ? (
                <Image
                  src={images[i]}
                  alt=""
                  fill
                  className={styles.image}
                  sizes="230px"
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.button}>
        <Button href="/experiences">Explore the centre</Button>
      </div>
    </section>
  );
}

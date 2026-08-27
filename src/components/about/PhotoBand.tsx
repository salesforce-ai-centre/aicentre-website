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
 * Tile size is chosen per breakpoint in JS, and the drum radius is derived
 * from that same size — so tiles stay tight together at every width (the
 * radius and tile width can never disagree). Thinner/portrait tiles above the
 * mobile breakpoint. prefers-reduced-motion freezes the rotation.
 *
 * Styling in PhotoBand.module.css.
 *
 * AIC2-138 — part of the About Page epic (AIC2-127).
 */

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import gallery from '../../../content/gallery.json';
import styles from './PhotoBand.module.css';

const PLACEHOLDER_COUNT = 12;
const SPEED = 0.04; // degrees of ring rotation per frame
const MOBILE_MAX = 640;
// Portrait aspect for the tiles (height / width).
const ASPECT = 360 / 320;

/**
 * Tile size for a given viewport width. Width scales with the viewport (so the
 * drum radius, derived from it, keeps the arc filling wide screens) but is
 * clamped so tiles stay a sensible size. Thinner/portrait via ASPECT.
 */
function tileForWidth(vw: number) {
  if (vw <= MOBILE_MAX) {
    return { width: 150, height: 250, gap: 8 };
  }
  // ~22% of viewport width, clamped 260–560px — larger tiles + bigger radius
  // so the front arc spans wider and spills further toward the screen edges.
  const width = Math.round(Math.min(480, Math.max(220, vw * 0.22)));
  return { width, height: Math.round(width * ASPECT), gap: 16 };
}

export default function PhotoBand() {
  const images = (gallery.images as string[]) ?? [];
  const hasImages = images.length > 0;
  const count = hasImages ? images.length : PLACEHOLDER_COUNT;
  const anglePer = 360 / count;

  // Tile dimensions track the viewport so the radius (below) always matches
  // the rendered tile width. The mobile "far apart" bug came from computing
  // the radius from the desktop width while CSS shrank the tiles; and a fixed
  // desktop width left wide screens under-filled — hence the viewport scale.
  const [tile, setTile] = useState(() => tileForWidth(1440));
  useEffect(() => {
    const pick = () => setTile(tileForWidth(window.innerWidth));
    pick();
    window.addEventListener('resize', pick);
    return () => window.removeEventListener('resize', pick);
  }, []);

  // Radius so tiles sit side by side: half-chord / tan(halfAngle).
  const radius = Math.round(
    (tile.width + tile.gap) / 2 / Math.tan((Math.PI * anglePer) / 360),
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
      rotationRef.current += SPEED;
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
                width: tile.width,
                height: tile.height,
                marginLeft: -tile.width / 2,
                marginTop: -tile.height / 2,
                transform: `rotateY(${i * anglePer}deg) translateZ(${radius}px) rotateY(180deg)`,
              }}
            >
              {hasImages ? (
                <Image
                  src={images[i]}
                  alt=""
                  fill
                  className={styles.image}
                  sizes="240px"
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

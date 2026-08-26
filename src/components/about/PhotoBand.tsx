/**
 * PhotoBand — static concave cylinder photo band for the About page.
 *
 * A fixed, centred arc of images that reads like the inside of a carousel
 * drum: the centre image faces the viewer; tiles toward the edges rotate
 * away (rotateY) and grow taller from a shared baseline, so the TOP edge
 * arcs upward while the BOTTOM edge stays flat. Sharp corners, per the
 * design. Figma node 7:119.
 *
 * No scrolling — the previous auto/manual scroll caused a jump and didn't
 * match the reference; this is a purely static, render-time layout.
 *
 * Photos come from content/gallery.json; branded placeholder tiles show
 * until real photos land. Styling in PhotoBand.module.css.
 *
 * AIC2-138 — part of the About Page epic (AIC2-127).
 */

import Image from 'next/image';
import Button from '@/components/ui/Button';
import gallery from '../../../content/gallery.json';
import styles from './PhotoBand.module.css';

const PLACEHOLDER_COUNT = 6;
const MAX_ROTATE = 34; // deg rotateY at the outermost tiles (cylinder wall)
const MAX_GROW = 0.14; // extra height fraction at the edges (bottom-anchored)

/** Transform for a tile at `norm` in [-1, 1] (0 = centre). */
function tileTransform(norm: number): string {
  const rotate = -norm * MAX_ROTATE; // edges rotate away from the viewer
  const grow = 1 + Math.abs(norm) * MAX_GROW; // edges taller; origin is bottom
  return `rotateY(${rotate.toFixed(2)}deg) scaleY(${grow.toFixed(3)})`;
}

export default function PhotoBand() {
  const images = (gallery.images as string[]) ?? [];
  const hasImages = images.length > 0;
  const count = hasImages ? images.length : PLACEHOLDER_COUNT;
  const mid = (count - 1) / 2;

  return (
    <section className={styles.section} aria-label="Photos from the AI Centre">
      <div className={styles.track}>
        {Array.from({ length: count }, (_, i) => {
          // -1 (far left) → 0 (centre) → 1 (far right)
          const norm = mid === 0 ? 0 : (i - mid) / mid;
          return (
            <div
              key={i}
              className={styles.tile}
              style={{
                transform: tileTransform(norm),
                zIndex: Math.round((1 - Math.abs(norm)) * 10),
                opacity: (1 - Math.abs(norm) * 0.25).toFixed(2),
              }}
            >
              {hasImages ? (
                <Image
                  src={images[i]}
                  alt=""
                  fill
                  className={styles.image}
                  sizes="210px"
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.button}>
        <Button href="/experiences">Explore the centre</Button>
      </div>
    </section>
  );
}

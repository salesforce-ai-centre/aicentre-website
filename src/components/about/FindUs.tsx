/**
 * FindUs — "Find us in the heart of the city" section on the About page.
 *
 * Two-column: heading + address + "Get directions" button on the left, the
 * building photo on the right. Stacks on mobile. Sits above Meet the Team.
 * Figma frame 7:48 (new section).
 *
 * AIC2-127 (About Page epic). The building photo isn't in the repo yet — a
 * branded placeholder shows until one is added at the path below.
 */

import Image from 'next/image';
import Button from '@/components/ui/Button';
import styles from './FindUs.module.css';

const DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=9+Devonshire+Square+London+EC2M+4YF';
const BUILDING_IMAGE = '/images/About/Other/ai-centre-external.webp';

export default function FindUs() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h2 className={styles.heading}>
            Find us in the
            <br />
            heart of the city
          </h2>
          <p className={styles.address}>9 Devonshire Square, London, EC2M 4YF</p>
          <Button
            href={DIRECTIONS_URL}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </Button>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={BUILDING_IMAGE}
            alt="The AI Centre entrance at 9 Devonshire Square"
            fill
            className={styles.image}
            sizes="(max-width: 1024px) 100vw, 600px"
          />
        </div>
      </div>
    </section>
  );
}

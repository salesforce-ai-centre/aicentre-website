/**
 * PlanHero — two-column hero for the Plan page.
 *
 * Left: heading + subtitle + "Request to visit" outline button. Right: a
 * screenshot of the Slack request workflow. Figma nodes 14:970 (text column)
 * + 14:974 (image). Stacks on mobile.
 *
 * Plan page (Figma frame 14:712).
 */

import Image from 'next/image';
import Button from '@/components/ui/Button';
import { SLACK_REQUEST_WORKFLOW_URL } from '@/lib/constants';
import styles from './PlanHero.module.css';

export default function PlanHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h1 className={styles.heading}>
            Plan your visit to
            <br />
            the AI Centre
          </h1>
          <p className={styles.subtitle}>
            Head over to our slack workflow to start your request
          </p>
          <Button href={SLACK_REQUEST_WORKFLOW_URL} variant="outline">
            Request to visit
          </Button>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/Plan/hero-plan.png"
            alt="The AI Centre requests workflow in Slack"
            fill
            className={styles.image}
            sizes="(max-width: 1024px) 100vw, 683px"
            priority
          />
        </div>
      </div>
    </section>
  );
}

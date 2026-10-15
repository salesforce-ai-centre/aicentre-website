import type { Metadata } from 'next';
import Image from 'next/image';
import { Wrench } from 'lucide-react';
import { SLACK_CHANNEL_URL } from '@/lib/constants';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "We're making some changes | Salesforce AI Centre",
  robots: 'noindex, nofollow',
};

export default function MaintenancePage() {
  return (
    <div className={styles.page}>
      {/* Floating Agent Astro character - top right */}
      <div className={styles.astroTopRight}>
        <Image
          src="/images/AgentAstroFlying.png"
          alt=""
          width={180}
          height={180}
          className={styles.floating}
          priority
        />
      </div>

      {/* Bottom left Agent Astro character */}
      <div className={styles.astroBottomLeft}>
        <Image
          src="/images/AgentAstro.webp"
          alt=""
          width={220}
          height={220}
          priority
        />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <div className={`glass-card ${styles.card}`}>
          <div className={styles.iconRow}>
            <div className={styles.iconCircle}>
              <Wrench className={styles.icon} />
            </div>
          </div>

          <h1 className={styles.heading}>
            We&apos;re making some changes
          </h1>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Salesforce employees can reach the team in{' '}
              <a
                href={SLACK_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                #ai-centre
              </a>{' '}
              on Slack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

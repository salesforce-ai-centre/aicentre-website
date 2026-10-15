import { getSiteConfig } from '@/lib/content';
import { SLACK_REQUEST_WORKFLOW_URL } from '@/lib/constants';
import Image from 'next/image';
import styles from './ContactBanner.module.css';

export default function ContactBanner() {
  const siteConfig = getSiteConfig();

  return (
    <div className={styles.banner}>
      {/* Diagonal stripe pattern */}
      <div className={styles.stripeLayer}>
        <div
          className={styles.stripes}
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.03) 10px,
              rgba(255, 255, 255, 0.03) 20px
            )`
          }}
        />
      </div>

      <div className={`container-max section-padding ${styles.content}`}>
        <div className={styles.inner}>
          <div className={styles.row}>
            <Image
              src="/images/SlackLogo.webp"
              alt="Slack Logo"
              width={24}
              height={24}
            />
            <span>{siteConfig.contactInfo.slackDescription}:</span>
            <a
              href={SLACK_REQUEST_WORKFLOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {siteConfig.contactInfo.slackChannel}
            </a>
          </div>
          <div className={styles.support}>
            {siteConfig.contactInfo.supportDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * SiteFooter — shared navy footer bar used across all redesigned pages.
 *
 * Four parts: logo + wordmark · address (with "Get directions") · nav links
 * · "View slack channel" button. Figma node 132:232.
 *
 * Part of the Design System (shared across About / Experiences / Plan).
 */

import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import { getSiteConfig } from '@/lib/content';
import styles from './SiteFooter.module.css';

const SLACK_CHANNEL_URL =
  'https://salesforce.enterprise.slack.com/archives/C080TP9HENQ';
const DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=9+Devonshire+Square+London+EC2M+4YF';

export default function SiteFooter() {
  const siteConfig = getSiteConfig();

  return (
    <footer className={styles.bar}>
      <div className={styles.inner}>
        {/* Logo + wordmark */}
        <Link href="/" className={styles.brand}>
          <Image
            src="/images/SalesforceLogo.png"
            alt="AI Centre"
            width={48}
            height={48}
            className={styles.logo}
          />
          <span className={styles.wordmark}>{siteConfig.siteName}</span>
        </Link>

        {/* Address */}
        <address className={styles.address}>
          9 Devonshire Square,
          <br />
          London, EC2M 4YF
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directions}
          >
            Get directions
          </a>
        </address>

        {/* Nav links */}
        <nav className={styles.nav} aria-label="Footer">
          {siteConfig.navigation.map((item) => (
            <Link key={item.name} href={item.href} className={styles.navLink}>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Button href={SLACK_CHANNEL_URL} variant="outline">
          View slack channel
        </Button>
      </div>
    </footer>
  );
}

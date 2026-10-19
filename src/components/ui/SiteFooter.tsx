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
import { SLACK_CHANNEL_URL } from '@/lib/constants';
import styles from './SiteFooter.module.css';

interface SiteFooterProps {
  tier?: 'lite' | 'full';
}

const DIRECTIONS_URL =
  'https://maps.app.goo.gl/UtxB99x7YyZHj2Ab9';

export default function SiteFooter({
  tier = 'full'
}: SiteFooterProps) {
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
          {siteConfig.navigation.map((item) => {
            if (tier === 'lite' && item.name === 'Plan')
              return
            
            return (
              <Link key={item.name} href={item.href} className={styles.navLink}>
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        {tier !== 'lite' && (
          <Button href={SLACK_CHANNEL_URL} variant="outline">
            View slack channel
          </Button>
        )}
      </div>
    </footer>
  );
}

/**
 * SiteFooter — shared navy footer bar used across all redesigned pages.
 *
 * "Created by your AI Centre team" on the left, "View slack channel" outline
 * button on the right. Figma node 84:155.
 *
 * Part of the Design System (shared across About / Experiences / Plan).
 */

import Button from './Button';
import styles from './SiteFooter.module.css';

const SLACK_CHANNEL_URL =
  'https://salesforce.enterprise.slack.com/archives/C080TP9HENQ';

export default function SiteFooter() {
  return (
    <footer className={styles.bar}>
      <div className={styles.inner}>
        <p className={styles.text}>Created by your AI Centre team</p>
        <Button href={SLACK_CHANNEL_URL} variant="outline">
          View slack channel
        </Button>
      </div>
    </footer>
  );
}

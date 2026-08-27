/**
 * PlanFooter — navy footer bar on the Plan page.
 *
 * "Created by your AI Centre team" on the left, "View slack channel" outline
 * button on the right. Figma node 84:155.
 *
 * Plan page (Figma frame 14:712).
 */

import Button from '@/components/ui/Button';
import styles from './PlanFooter.module.css';

const SLACK_CHANNEL_URL =
  'https://salesforce.enterprise.slack.com/archives/C080TP9HENQ';

export default function PlanFooter() {
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

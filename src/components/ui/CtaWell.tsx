/**
 * CtaWell — closing call-to-action section for the redesigned pages.
 *
 * A large deep-blue rounded panel with a centred white heading, supporting
 * body and a button. Appears at the bottom of both pages ("Explore the magic
 * of the AI Centre" / "Plan your visit to the AI Centre").
 *
 * Figma: brand-blue (#022ac0) panel, rounded top, white 56px Avant Garde Demi
 * heading + 24px Salesforce Sans body, inverted (white/brand) button.
 *
 * AIC2-135 — part of the Design System epic (AIC2-126).
 */

import Button from './Button';
import styles from './CtaWell.module.css';

interface CtaWellProps {
  heading: React.ReactNode;
  body?: React.ReactNode;
  buttonLabel: string;
  href: string;
  className?: string;
}

export default function CtaWell({
  heading,
  body,
  buttonLabel,
  href,
  className = '',
}: CtaWellProps) {
  return (
    <section className={`${styles.well} ${className}`.trim()}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{heading}</h2>
        {body && <p className={styles.body}>{body}</p>}
        <Button href={href} variant="outline" className={styles.button}>
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}

/**
 * SectionHeading — centred navy title with an optional subtitle line.
 *
 * Used by the hero titles and every section header ("Meet the team",
 * "Activations", "Workshops", "Spaces") on the redesigned pages.
 * Figma: heading 56px Avant Garde Demi, subtitle 24px Salesforce Sans,
 * both navy (#001e5b) centred on the light background.
 *
 * AIC2-132 — part of the Design System epic (AIC2-126).
 */

import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  /** Render level for the title — defaults to h2 (use h1 for the hero). */
  as?: 'h1' | 'h2';
  /** Extra classes for the title element (e.g. relax leading on a two-line hero). */
  titleClassName?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  className = '',
  as: Tag = 'h2',
  titleClassName = '',
}: SectionHeadingProps) {
  // Hero titles (h1) are 56px; section titles (h2) are 48px (Mario's spec).
  const sizeClass = Tag === 'h1' ? styles.titleH1 : styles.titleH2;
  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <Tag
        className={`${styles.title} ${sizeClass} ${titleClassName}`.trim()}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

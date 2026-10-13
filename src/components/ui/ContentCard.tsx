/**
 * ContentCard — shared white card shell for the redesigned pages.
 *
 * Backs the activation / workshop / space / team cards. Composable:
 * an image area with an optional top-right badge, then title + body (or
 * arbitrary children) in the text area.
 *
 * Figma (node 27:1106 family): white, rounded-16, image wrapper 238px tall,
 * badge = white pill w/ navy text top-right, text content px-32 gap-16,
 * title 24px Avant Garde Demi navy, body 16px Salesforce Sans navy.
 *
 * AIC2-133 — part of the Design System epic (AIC2-126).
 */

import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './ContentCard.module.css';

interface ContentCardProps {
  /** Image URL. Rendered via next/image with fill inside a fixed-height frame. */
  imageSrc?: string;
  imageAlt?: string;
  /** Optional pill shown top-right over the image (e.g. "Guided", "Self Serve"). */
  badge?: ReactNode;
  /** Shows a brand-blue "New" pill top-left over the image. */
  isNew?: boolean;
  isComingSoon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  /** Extra content rendered in the text area below the description. */
  children?: ReactNode;
  className?: string;
}

export default function ContentCard({
  imageSrc,
  imageAlt = '',
  badge,
  isNew = false,
  isComingSoon = false,
  title,
  description,
  children,
  className = '',
}: ContentCardProps) {
  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.imageFrame}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={styles.imageFallback} />
        )}
        {isNew && (
          <span className={`${styles.badgeBase} ${styles.badgeLeft}`}>
            New
          </span>
        )}
        {isComingSoon && (
          <span className={`${styles.badgeBase} ${styles.badgeLeft}`}>
            Coming Soon
          </span>
        )}
        {badge && (
          <span className={`${styles.badgeBase} ${styles.badgeRight}`}>
            {badge}
          </span>
        )}
      </div>

      <div className={styles.body}>
        {title && (
          <h3 className={styles.title}>{title}</h3>
        )}
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

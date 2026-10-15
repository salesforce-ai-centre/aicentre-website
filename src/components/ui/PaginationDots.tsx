/**
 * PaginationDots — shared paging indicator.
 *
 * A row of clickable dots showing position within a set; the active dot is
 * elongated and brand-coloured. Used under the testimonials and team
 * carousels (via Carousel), and reusable anywhere a paged control needs dots.
 *
 * AIC2-134 — part of the Design System epic (AIC2-126).
 */

'use client';

import styles from './PaginationDots.module.css';

interface PaginationDotsProps {
  count: number;
  /** Index of the currently active dot. */
  active: number;
  /** Called with the target index when a dot is clicked. */
  onSelect: (index: number) => void;
  /** Accessible label prefix, e.g. "item" → "Go to item 2 of 5". */
  itemLabel?: string;
  className?: string;
}

export default function PaginationDots({
  count,
  active,
  onSelect,
  itemLabel = 'item',
  className = '',
}: PaginationDotsProps) {
  if (count <= 1) return null;

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <div className={styles.pill}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Go to ${itemLabel} ${i + 1} of ${count}`}
            aria-current={i === active}
            className={`${styles.dot} ${i === active ? styles.dotActive : ''}`.trim()}
          />
        ))}
      </div>
    </div>
  );
}

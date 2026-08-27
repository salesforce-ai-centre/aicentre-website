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
    <div className={`flex justify-center gap-2 ${className}`.trim()}>
      <div style={{padding: "12px", borderRadius: "20px"}} className="flex justify-center gap-2 bg-white">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Go to ${itemLabel} ${i + 1} of ${count}`}
            aria-current={i === active}
            className={`h-2.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
              i === active ? 'w-2.5 bg-[#00B3FF]' : 'w-2.5 bg-brand/30 hover:bg-brand/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

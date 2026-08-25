/**
 * Carousel — horizontal scroll-snap carousel with paging dots.
 *
 * Generic: renders arbitrary card children in a horizontally scrolling,
 * snap-aligned track with clickable paging dots below. Used by the
 * testimonials, team, activations, workshops and spaces sections.
 *
 * Accessibility:
 * - The track is a focusable listbox-ish region; ArrowLeft/ArrowRight page.
 * - Dots are real buttons with aria-labels and aria-current.
 * - Respects prefers-reduced-motion (instant vs smooth scroll).
 *
 * Responsive: cards are sized via `itemClassName` (e.g. basis widths), so
 * callers control how many are visible per breakpoint.
 *
 * AIC2-134 — part of the Design System epic (AIC2-126).
 */

'use client';

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

interface CarouselProps {
  children: ReactNode;
  /** Class applied to each item wrapper — controls per-breakpoint width. */
  itemClassName?: string;
  /** Accessible label for the carousel region. */
  ariaLabel?: string;
  className?: string;
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Carousel({
  children,
  itemClassName = 'basis-[85%] sm:basis-1/2 lg:basis-1/3',
  ariaLabel = 'Carousel',
  className = '',
}: CarouselProps) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Derive the active page from scroll position (closest item to the left edge).
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackLeft = track.scrollLeft;
    let closest = 0;
    let closestDist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(el.offsetLeft - track.offsetLeft - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const el = itemRefs.current[index];
    if (!track || !el) return;
    track.scrollTo({
      left: el.offsetLeft - track.offsetLeft,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  const page = useCallback(
    (delta: number) => {
      const next = Math.min(Math.max(activeIndex + delta, 0), items.length - 1);
      scrollToIndex(next);
    },
    [activeIndex, items.length, scrollToIndex],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      page(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      page(-1);
    }
  };

  return (
    <div className={className}>
      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {items.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`shrink-0 snap-start ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to item ${i + 1} of ${items.length}`}
              aria-current={i === activeIndex}
              className={`h-2.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                i === activeIndex ? 'w-6 bg-brand' : 'w-2.5 bg-brand/30 hover:bg-brand/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

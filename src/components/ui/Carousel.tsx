/**
 * Carousel — horizontal scroll-snap carousel with paging dots.
 *
 * Generic: renders arbitrary card children in a horizontally scrolling,
 * snap-aligned track with clickable paging dots below. Used by the
 * testimonials, team, activations, workshops and spaces sections.
 *
 * Paging: dots map to *pages* (a viewport-width of cards), not individual
 * cards, so every dot is reachable.
 *
 * Interaction:
 * - Mouse drag / touch swipe to scroll. During a mouse drag, snap + smooth
 *   scrolling are disabled so the track follows the cursor 1:1, then restored
 *   on release so it snaps into place.
 * - ArrowLeft / ArrowRight page when the track is focused.
 * - Dots are real buttons with aria-labels / aria-current.
 *
 * `loop`: render the set three times and seamlessly wrap scrollLeft by one
 * set-width for an infinite carousel (used by testimonials).
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
  type PointerEvent,
  type ReactNode,
} from 'react';
import PaginationDots from './PaginationDots';

interface CarouselProps {
  children: ReactNode;
  /** Class applied to each item wrapper — controls per-breakpoint width. */
  itemClassName?: string;
  /** Accessible label for the carousel region. */
  ariaLabel?: string;
  className?: string;
  /** Snap alignment of items. 'center' keeps the active item centred. */
  snapAlign?: 'start' | 'center';
  /** Infinite loop — wraps seamlessly past either end. */
  loop?: boolean;
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const REPEATS = 3; // when looping, render the set this many times

export default function Carousel({
  children,
  itemClassName = 'basis-[85%] sm:basis-1/2 lg:basis-1/3',
  ariaLabel = 'Carousel',
  className = '',
  snapAlign = 'start',
  loop = false,
}: CarouselProps) {
  const items = Children.toArray(children);
  const baseCount = items.length;
  // When looping, render 3 copies so there's content either side to wrap into.
  const rendered = loop ? Array.from({ length: baseCount * REPEATS }, (_, i) => items[i % baseCount]) : items;

  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const didInitLoop = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmatic = useRef(false); // a dot/arrow scroll is in flight
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mouse-drag state (declared up here so wrapIfNeeded can guard against it).
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  // How many cards advance per page. For a centred carousel that's always 1
  // (one active item at a time, others just peek), giving one dot per item.
  // For a standard carousel it's how many whole cards fit in the track.
  const itemsPerPage = useCallback(() => {
    if (snapAlign === 'center') return 1;
    const track = trackRef.current;
    const first = itemRefs.current[0];
    if (!track || !first) return 1;
    const itemWidth = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return Math.max(1, Math.round((track.clientWidth + gap) / (itemWidth + gap)));
  }, [snapAlign]);

  const recomputePages = useCallback(() => {
    setPageCount(Math.max(1, Math.ceil(baseCount / itemsPerPage())));
  }, [itemsPerPage, baseCount]);

  // Seamless wrap: recentre onto the middle copy when looping. Only ever runs
  // once scrolling has fully STOPPED (debounced), no drag is active, and no
  // programmatic (dot/arrow) scroll is in flight — teleporting scrollLeft
  // mid-motion is what caused the vibration and the "snaps to the wrong one".
  const wrapIfNeeded = useCallback(() => {
    const track = trackRef.current;
    if (!track || !loop || drag.current.active || programmatic.current) return;
    const setWidth = track.scrollWidth / REPEATS;
    if (track.scrollLeft < setWidth * 0.5) {
      track.style.scrollBehavior = 'auto';
      track.scrollLeft += setWidth;
      track.style.scrollBehavior = '';
    } else if (track.scrollLeft > setWidth * 1.5) {
      track.style.scrollBehavior = 'auto';
      track.scrollLeft -= setWidth;
      track.style.scrollBehavior = '';
    }
  }, [loop]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const per = itemsPerPage();
    const pc = Math.max(1, Math.ceil(baseCount / per));
    setPageCount(pc);

    if (snapAlign === 'center') {
      // Centred (+ possibly looping): the active item is the one nearest the
      // track centre; map it back to the base set → its page.
      const trackRect = track.getBoundingClientRect();
      const refX = trackRect.left + trackRect.width / 2;
      let nearest = 0;
      let nearestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - refX);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = i;
        }
      });
      const baseIndex = ((nearest % baseCount) + baseCount) % baseCount;
      setActivePage(Math.floor(baseIndex / per) % pc);
    } else {
      // Standard paged carousel: each page is one viewport width of cards.
      // Guard the final partial page so the last dot is reachable.
      const maxScroll = track.scrollWidth - track.clientWidth;
      const raw =
        maxScroll > 0 && track.scrollLeft >= maxScroll - 1
          ? pc - 1
          : Math.round(track.scrollLeft / track.clientWidth);
      setActivePage(Math.min(Math.max(raw, 0), pc - 1));
    }

    // Debounced: only recentre the loop once scrolling has come to rest.
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(wrapIfNeeded, 140);
  }, [itemsPerPage, baseCount, wrapIfNeeded, snapAlign]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    recomputePages();
    // Start on the FIRST item of the middle copy when looping. For a centred
    // carousel that means centring it (not just moving to the copy's left
    // edge, which would leave the *second* item under the centre line).
    if (loop && !didInitLoop.current) {
      track.style.scrollBehavior = 'auto';
      const firstMid = itemRefs.current[baseCount];
      if (firstMid) {
        track.scrollLeft =
          snapAlign === 'center'
            ? firstMid.offsetLeft - (track.clientWidth - firstMid.clientWidth) / 2
            : firstMid.offsetLeft;
      } else {
        track.scrollLeft = track.scrollWidth / REPEATS;
      }
      track.style.scrollBehavior = '';
      didInitLoop.current = true;
    }
    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', recomputePages);
    return () => {
      track.removeEventListener('scroll', handleScroll);
      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
      window.removeEventListener('resize', recomputePages);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [handleScroll, recomputePages, loop, baseCount, snapAlign]);

  const scrollByPages = useCallback((delta: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: delta * track.clientWidth,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  // The rendered item currently nearest the reference line (track centre for
  // centred carousels, else left edge). Used to move dots relative to "now".
  const currentRenderedIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const trackRect = track.getBoundingClientRect();
    const refX = snapAlign === 'center' ? trackRect.left + trackRect.width / 2 : trackRect.left;
    let nearest = 0;
    let nearestDist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const itemRef = snapAlign === 'center' ? r.left + r.width / 2 : r.left;
      const d = Math.abs(itemRef - refX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    return nearest;
  }, [snapAlign]);

  // Scroll a rendered element to the reference position (centre or left edge).
  const scrollElementIntoPosition = useCallback(
    (el: HTMLDivElement, smooth: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      const left =
        snapAlign === 'center'
          ? el.offsetLeft - (track.clientWidth - el.clientWidth) / 2
          : el.offsetLeft;
      track.scrollTo({ left, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' });
    },
    [snapAlign],
  );

  // Dots jump to a target page. To keep the loop robust we ALWAYS land in the
  // middle copy: if we're not already in it, jump there instantly first (no
  // animation, invisible because the item content is identical), then smooth-
  // scroll to the target page within the middle copy. A `programmatic` guard
  // suppresses the loop recentre until this settles, so nothing yanks it back.
  const scrollToPage = useCallback((page: number) => {
    const track = trackRef.current;
    if (!track) return;
    const per = itemsPerPage();
    const midCopy = loop ? 1 : 0; // middle of the 3 rendered copies
    const targetRendered = midCopy * baseCount + page * per;

    // If looping and we've drifted to another copy, realign to the middle copy
    // at the *current* item first (instant), so the smooth scroll below is a
    // short, correct hop rather than a cross-copy jump.
    if (loop) {
      const current = currentRenderedIndex();
      const currentBase = ((current % baseCount) + baseCount) % baseCount;
      const currentInMid = itemRefs.current[midCopy * baseCount + currentBase];
      if (current !== midCopy * baseCount + currentBase && currentInMid) {
        scrollElementIntoPosition(currentInMid, false);
      }
    }

    const target = itemRefs.current[targetRendered];
    if (!target) return;

    programmatic.current = true;
    if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    // requestAnimationFrame so the instant realign above is applied first.
    requestAnimationFrame(() => scrollElementIntoPosition(target, true));
    // Release the guard after the smooth scroll has settled.
    programmaticTimer.current = setTimeout(() => {
      programmatic.current = false;
    }, 600);
  }, [baseCount, itemsPerPage, loop, currentRenderedIndex, scrollElementIntoPosition]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByPages(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByPages(-1);
    }
  };

  // ── Mouse drag-to-scroll ──────────────────────────────────────────
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return; // touch uses native scroll
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(dx) > 3) {
      drag.current.moved = true;
      track.setPointerCapture(e.pointerId);
      // Follow the cursor 1:1: kill snap + smooth for the duration of the drag.
      track.style.cursor = 'grabbing';
      track.style.scrollBehavior = 'auto';
      track.style.scrollSnapType = 'none';
    }
    if (drag.current.moved) track.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    drag.current.active = false;
    track.style.cursor = '';
    track.style.scrollBehavior = '';
    track.style.scrollSnapType = ''; // restore snap → settles onto a card
    if (track.hasPointerCapture?.(e.pointerId)) track.releasePointerCapture(e.pointerId);
    // The debounced scroll-idle handler (handleScroll) will recentre the loop
    // once the post-release snap settles — no explicit wrap needed here.
  };

  // Swallow the click after a drag so cards aren't accidentally activated.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        style={{ overflowY: 'hidden' }}
        className="flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {rendered.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`shrink-0 ${snapAlign === 'center' ? 'snap-center' : 'snap-start'} ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      <PaginationDots
        count={pageCount}
        active={activePage}
        onSelect={scrollToPage}
        className="mt-6"
      />
    </div>
  );
}

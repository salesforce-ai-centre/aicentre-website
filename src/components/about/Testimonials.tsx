/**
 * Testimonials — speech-bubble quote carousel for the About page.
 *
 * Light-blue rounded speech bubble with a tail at the bottom-right, gold
 * quotation marks top-left, navy quote body and attribution beneath.
 * Rendered in the shared Carousel with paging dots. Figma node 7:125.
 * Content from content/testimonials.json.
 *
 * AIC2-139 — part of the About Page epic (AIC2-127).
 */

'use client';

import Carousel from '@/components/ui/Carousel';
import { getTestimonials } from '@/lib/content';

export default function Testimonials() {
  const testimonials = getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding py-16">
      <div className="container-max">
        <Carousel ariaLabel="What people say about the AI Centre">
          {testimonials.map((t) => (
            <figure key={t.id} className="relative h-full pb-5">
              {/* Speech bubble */}
              <div className="relative flex h-full flex-col rounded-3xl bg-[#e8f2fd] p-8">
                {/* Gold quote marks */}
                <span
                  aria-hidden
                  className="font-heading text-5xl font-bold leading-none text-amber-400"
                >
                  &ldquo;
                </span>
                <blockquote className="font-sans mt-3 flex-1 text-lg font-semibold text-navy">
                  {t.quote}
                </blockquote>
                <figcaption className="font-sans mt-5 text-sm text-navy/70">
                  {t.attribution}
                </figcaption>
              </div>
              {/* Bottom-right tail — a rotated square that reads as the bubble's point. */}
              <div
                aria-hidden
                className="absolute bottom-1 right-10 h-8 w-8 rotate-45 rounded-br-lg bg-[#e8f2fd]"
              />
            </figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

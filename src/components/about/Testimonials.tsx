/**
 * Testimonials — quote carousel for the About page.
 *
 * White quote cards (large decorative quotation mark, quote body,
 * attribution) in the shared Carousel with paging dots. Figma node 7:125.
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
            <figure
              key={t.id}
              className="flex h-full flex-col rounded-card bg-white p-8 shadow-card"
            >
              <span
                aria-hidden
                className="font-heading text-6xl leading-none text-brand"
              >
                &ldquo;
              </span>
              <blockquote className="font-sans mt-2 flex-1 text-lg text-navy">
                {t.quote}
              </blockquote>
              <figcaption className="font-sans mt-6 text-base font-bold text-navy/70">
                {t.attribution}
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

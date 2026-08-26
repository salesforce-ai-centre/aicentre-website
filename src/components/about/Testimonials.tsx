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
        <Carousel ariaLabel="What people say about the AI Centre" itemClassName="basis-[85%] sm:basis-1/2 lg:basis-2/5">
          {testimonials.map((t) => (
            <figure key={t.id} className="relative h-full pb-5">
              <div style={{gap: "1rem"}} className="relative flex h-full flex-row rounded-3xl bg-white p-8">
                <span
                  aria-hidden
                  className="font-heading text-6xl font-bold leading-none text-amber-400"
                >
                  &ldquo;
                </span>
                <div className="relative flex h-full flex-col">
                  <blockquote className="font-sans flex-1 text-lg font-semibold text-navy">
                    {t.quote}
                  </blockquote>
                  <figcaption className="font-sans mt-5 text-sm text-navy/70">
                    {t.attribution}
                  </figcaption>
                </div>
              </div>
              <div
                aria-hidden
                className="absolute bottom-1 right-16 h-8 w-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M96 71L0 0H96V71Z" fill="white"/>
                </svg>
              </div>
            </figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

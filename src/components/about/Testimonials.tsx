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

import { useEffect, useState } from 'react';
import Carousel from '@/components/ui/Carousel';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { getTestimonials } from '@/lib/content';
import type { Testimonial } from '@/types/content';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container-max">
        <Carousel
          ariaLabel="What people say about the AI Centre"
          snapAlign="center"
          loop
          itemClassName={styles.item}
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

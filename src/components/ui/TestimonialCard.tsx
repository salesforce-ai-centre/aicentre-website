/**
 * TestimonialCard — speech-bubble quote with a tail, gold quotation mark,
 * navy quote body, and attribution.
 *
 * Extracted from Testimonials (AIC2-139) so both the testimonials section
 * and the UI block renderer (AIC2-152) reuse the same component.
 */

import type { Testimonial } from '@/types/content';
import styles from './TestimonialCard.module.css';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export default function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  return (
    <figure className={`${styles.figure} ${className}`.trim()}>
      <div className={styles.bubble}>
        <span aria-hidden className={styles.quoteMark}>
          &ldquo;
        </span>
        <div className={styles.body}>
          <blockquote className={styles.quote}>{testimonial.quote}</blockquote>
          <figcaption className={styles.attribution}>{testimonial.attribution}</figcaption>
        </div>
      </div>
      <div aria-hidden className={styles.tail}>
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M96 71L0 0H96V71Z" fill="white" />
        </svg>
      </div>
    </figure>
  );
}

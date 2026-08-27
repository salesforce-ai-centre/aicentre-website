/**
 * ExperiencesHero — hero for the Experiences page.
 *
 * Centred navy headline + a row of pill buttons (Activations, Workshops,
 * Spaces) that smooth-scroll to their section. Figma node 14:548 (heading)
 * + 27:1304 (pill row). Uses the shared Button `pill` variant.
 *
 * AIC2-143 — part of the Experiences Page epic (AIC2-128).
 */

'use client';

import Button from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import styles from './ExperiencesHero.module.css';

const SECTIONS = [
  { label: 'Activations', id: 'activations' },
  { label: 'Workshops', id: 'workshops' },
  { label: 'Spaces', id: 'spaces' },
];

export default function ExperiencesHero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <SectionHeading
          as="h1"
          title="Explore the magic of the AI Centre"
          titleClassName="lg:leading-[1.15]"
        />
        <div className={styles.pills}>
          {SECTIONS.map((s) => (
            <Button
              key={s.id}
              variant="outline"
              onClick={() => scrollTo(s.id)}
              aria-label={`Jump to ${s.label}`}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

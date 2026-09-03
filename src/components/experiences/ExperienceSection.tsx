/**
 * ExperienceSection — a titled section (Activations / Workshops / Spaces) on
 * the Experiences page: a section heading + a carousel of ContentCards.
 *
 * Reuses the shared SectionHeading, Carousel and ContentCard. Cards show an
 * optional top-right badge (Guided / Self Serve) per Figma node 28:78, and
 * fall back to a branded placeholder when a card has no image.
 *
 * AIC2-144 / AIC2-145 / AIC2-146 / AIC2-147 — Experiences Page epic (AIC2-128).
 */

'use client';

import Carousel from '@/components/ui/Carousel';
import ContentCard from '@/components/ui/ContentCard';
import SectionHeading from '@/components/ui/SectionHeading';
import styles from './ExperienceSection.module.css';

export interface ExperienceCardData {
  id: string;
  title: string;
  description: string;
  image?: string;
  badge?: 'Guided' | 'Self Serve';
  isNew?: boolean;
  isComingSoon?: boolean;
}

interface ExperienceSectionProps {
  id: string;
  title: string;
  items: ExperienceCardData[];
}

export default function ExperienceSection({
  id,
  title,
  items,
}: ExperienceSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id={id} className={styles.section}>
      <div className={styles.container}>
        <SectionHeading title={title} className={styles.heading} />

        <Carousel
          ariaLabel={title}
          itemClassName="basis-[85%] sm:basis-1/2 lg:basis-1/3"
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              imageSrc={item.image}
              imageAlt={item.title}
              badge={item.badge}
              isNew={item.isNew}
              isComingSoon={item.isComingSoon}
              title={item.title}
              description={item.description}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

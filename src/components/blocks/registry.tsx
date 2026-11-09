/**
 * Block registry — maps each block type (and card variant) to the real
 * site component that renders it. This is the extension point: new block
 * types or card variants are added here only, never in `BlockRenderer`.
 *
 * AIC2-152 — part of the "Ask AI Centre" epic (AIC2-149).
 */

import type { ReactNode } from 'react';
import ContentCard from '@/components/ui/ContentCard';
import TeamMemberCard from '@/components/ui/TeamMemberCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import Carousel from '@/components/ui/Carousel';
import SectionHeading from '@/components/ui/SectionHeading';
import CtaWell from '@/components/ui/CtaWell';
import FormattedText from '@/components/FormattedText';
import type {
  Block,
  CardDataByVariant,
  CardVariant,
} from '@/types/blocks';
import styles from './registry.module.css';

type CardRenderer<V extends CardVariant> = (data: CardDataByVariant[V]) => ReactNode;

const cardRegistry: { [V in CardVariant]: CardRenderer<V> } = {
  workshop: (workshop) => (
    <ContentCard
      imageSrc={workshop.image}
      imageAlt={workshop.title}
      isNew={workshop.isNew}
      title={workshop.title}
      description={workshop.description}
    />
  ),
  experience: (experience) => (
    <ContentCard
      imageSrc={experience.image}
      imageAlt={experience.title}
      badge={experience.badge}
      isComingSoon={experience.isComingSoon}
      title={experience.title}
      description={experience.description}
    />
  ),
  space: (space) => (
    <ContentCard
      imageSrc={space.imageUrl}
      imageAlt={space.name}
      title={space.name}
      description={space.description}
    />
  ),
  team: (member) => <TeamMemberCard member={member} />,
  testimonial: (testimonial) => <TestimonialCard testimonial={testimonial} />,
};

function renderCard<V extends CardVariant>(variant: V, data: CardDataByVariant[V]): ReactNode {
  const render = cardRegistry[variant] as CardRenderer<V>;
  return render(data);
}

export const blockRegistry: { [T in Block['type']]: (block: Extract<Block, { type: T }>) => ReactNode } = {
  text: (block) => <FormattedText text={block.markdown} />,
  sectionHeading: (block) => <SectionHeading title={block.title} subtitle={block.subtitle} />,
  card: (block) => <div className={styles.cardBlock}>{renderCard(block.variant, block.data)}</div>,
  carousel: (block) => (
    <Carousel ariaLabel={`${block.variant} carousel`}>
      {block.items.map((item) => (
        <div key={item.id}>{renderCard(block.variant, item)}</div>
      ))}
    </Carousel>
  ),
  ctaWell: (block) => (
    <CtaWell heading={block.heading} body={block.body} buttonLabel={block.buttonLabel} href={block.href} />
  ),
};

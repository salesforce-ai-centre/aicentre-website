/**
 * Experiences page — redesigned light theme.
 *
 * Hero + pill section-switcher, then Activations / Workshops / Spaces, each a
 * SectionHeading + Carousel of ContentCards, closing with the shared CtaWell.
 * Figma frame 14:446.
 *
 * Card data (titles, descriptions, images, badges) comes from Salesforce via
 * getExperiences()/getWorkshops()/getSpaces() in lib/content — see AIC2-647.
 *
 * AIC2-148 — assembles the Experiences Page epic (AIC2-128).
 */

import Navigation from '@/components/Navigation';
import ExperiencesHero from '@/components/experiences/ExperiencesHero';
import ExperienceSection, {
  type ExperienceCardData,
} from '@/components/experiences/ExperienceSection';
import CtaWell from '@/components/ui/CtaWell';
import SiteFooter from '@/components/ui/SiteFooter';
import { getServerAccessTier, type AccessTier } from '@/lib/auth-session';
import { getExperiences, getWorkshops, getSpaces } from '@/lib/content';
import type { Experience, Workshop, Space } from '@/types/content';
import styles from './page.module.css';

function toActivationCard(experience: Experience): ExperienceCardData {
  return {
    id: experience.id,
    title: experience.title,
    description: experience.description,
    image: experience.image,
    badge: experience.badge,
    isComingSoon: experience.isComingSoon,
  };
}

function toWorkshopCard(workshop: Workshop, tier: AccessTier | null): ExperienceCardData {
  return {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    image: tier === 'lite' ? workshop.imageLite ?? workshop.image : workshop.image,
    isNew: workshop.isNew,
  };
}

function toSpaceCard(space: Space): ExperienceCardData {
  return {
    id: space.id,
    title: space.name,
    description: space.description ?? '',
    image: space.imageUrl,
  };
}

export default async function ExperiencesPage() {
  const tier = await getServerAccessTier();
  const [experiences, workshops, spaces] = await Promise.all([
    getExperiences(true),
    getWorkshops(true),
    getSpaces(true),
  ]);

  const activations = experiences.map(toActivationCard);
  const workshopCards = workshops.map((workshop) => toWorkshopCard(workshop, tier));
  const spaceCards = spaces.map(toSpaceCard);

  return (
    <main
      className={`page-gradient ${styles.main}`}
      style={{ '--page-gradient': 'linear-gradient(0deg, #00B3FF 0%, #90D0FE 21.42%, #EAF5FE 68.72%, #F9F0FF 100%)' } as React.CSSProperties}
    >
      <Navigation />
      <ExperiencesHero />
      <ExperienceSection id="activations" title="Activations" items={activations} />
      <ExperienceSection id="workshops" title="Workshops" items={workshopCards} />
      <ExperienceSection id="spaces" title="Spaces" items={spaceCards} />
      {tier !== 'lite' && (
        <CtaWell
          heading="Plan your visit to the AI Centre"
          body="Follow our three simple steps to plan your visit with us."
          buttonLabel="Plan your visit"
          href="/plan-engagement"
          className={styles.cta}
        />
      )}
      <SiteFooter tier={tier} />
    </main>
  );
}

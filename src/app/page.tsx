/**
 * About page (home route) — redesigned light theme.
 *
 * Composed from the About section components on the shared page gradient:
 * hero → photo band → testimonials → feature cards → meet the team → CTA well.
 * Figma frame 7:48.
 *
 * AIC2-142 — assembles the About Page epic (AIC2-127).
 */

import Navigation from '@/components/Navigation';
import AboutHero from '@/components/about/AboutHero';
import PhotoBand from '@/components/about/PhotoBand';
import Testimonials from '@/components/about/Testimonials';
import FeatureCards from '@/components/about/FeatureCards';
import FindUs from '@/components/about/FindUs';
import MeetTheTeam from '@/components/about/MeetTheTeam';
import CtaWell from '@/components/ui/CtaWell';
import SiteFooter from '@/components/ui/SiteFooter';
import styles from './page.module.css';
import { getServerAccessTier } from '@/lib/auth-session';

export default async function Home() {
  const tier = await getServerAccessTier();

  return (
    <main className={`page-gradient ${styles.main}`}>
      <Navigation />
      <AboutHero />
      <PhotoBand />
      <Testimonials />
      <FeatureCards />
      <FindUs />
      {tier !== 'lite' && (
        <>
          <MeetTheTeam />
          <CtaWell
            heading="Explore the magic of the AI Centre"
            body="Immerse yourself in the world of AI and explore what the AI Centre has to offer"
            buttonLabel="Explore the centre"
            href="/experiences"
            className={styles.cta}
          />
        </>
      )}
      <SiteFooter tier={tier} />
    </main>
  );
}

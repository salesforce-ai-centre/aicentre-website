/**
 * AboutHero — hero for the redesigned About page.
 *
 * Centred navy headline + subtitle on the light page gradient.
 * Figma node 7:51.
 *
 * AIC2-137 — part of the About Page epic (AIC2-127).
 */

import SectionHeading from '@/components/ui/SectionHeading';

export default function AboutHero() {
  return (
    <section className="section-padding pt-32 sm:pt-40">
      <div className="container-max">
        <SectionHeading
          as="h1"
          titleClassName="lg:leading-[1.15]"
          title={
            <>
              Let&apos;s unlock your
              <br />
              AI potential together
            </>
          }
          subtitle="Explore the possibilities of AI and jumpstart your journey in the heart of London."
        />
      </div>
    </section>
  );
}

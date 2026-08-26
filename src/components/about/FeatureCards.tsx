/**
 * FeatureCards — two side-by-side feature cards on the About page.
 *
 * Left (wide) "Reimagine your business" + right (narrow) "Equip the next
 * generation": rounded image cards with a legibility gradient and white
 * text overlay. Figma nodes 7:75 + 7:86.
 *
 * Stacks on mobile, uneven 2-up (≈2:1) on desktop. Optional background
 * images via props; falls back to a brand gradient when absent.
 *
 * AIC2-140 — part of the About Page epic (AIC2-127).
 */

interface Feature {
  title: string;
  body?: string;
  imageSrc?: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Reimagine your business',
    body: "We're inspiring teams to reimagine their businesses with AI through immersive experiences and thought-provoking workshops.",
  },
  {
    title: 'Equip the next generation',
    body: "We're equipping the next generation across the UK and Ireland with essential AI literacy.",
  },
];

function Card({ feature }: { feature: Feature }) {
  return (
    <div
      className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-card p-8 shadow-card"
      style={
        feature.imageSrc
          ? {
              backgroundImage: `url(${feature.imageSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Brand fill when no image, plus a legibility gradient for the text. */}
      {!feature.imageSrc && <div className="absolute inset-0 bg-brand" />}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
      <div className="relative">
        <h3 className="font-heading text-3xl font-semibold text-white lg:text-4xl">
          {feature.title}
        </h3>
        {feature.body && (
          <p className="font-sans mt-3 max-w-md text-base text-white/90">
            {feature.body}
          </p>
        )}
      </div>
    </div>
  );
}

export default function FeatureCards() {
  return (
    <section className="section-padding py-16">
      <div className="container-max grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card feature={FEATURES[0]} />
        </div>
        <div className="lg:col-span-1">
          <Card feature={FEATURES[1]} />
        </div>
      </div>
    </section>
  );
}

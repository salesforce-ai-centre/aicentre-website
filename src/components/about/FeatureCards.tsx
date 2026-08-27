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
    imageSrc: '/images/About/Other/business-cio-breakfast1.jpg',
  },
  {
    title: 'Equip the next generation',
    body: "We're equipping the next generation across the UK and Ireland with essential AI literacy.",
    imageSrc: '/images/About/Other/community-future-trailblazers1.jpg',
  },
];

function Card({ feature, isPrimary = true }: { feature: Feature; isPrimary?: boolean }) {
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
      <div
        className="absolute inset-0"
        style={{
          background: isPrimary ? "linear-gradient(39.22deg, #001E5B 12.38%, rgba(2, 42, 192, 0.5) 51.34%, rgba(2, 42, 192, 0) 71.97%)" : "linear-gradient(10.73deg, #ECF5FB 35.05%, rgba(238, 245, 248, 0.90891) 45.68%, rgba(245, 244, 236, 0.5) 59.06%, rgba(236, 245, 251, 0) 71.93%)"
        }}
      />
      <div className="relative">
        <h3
          className={
            `font-heading text-3xl font-semibold
            ${isPrimary ? "text-white" : "text-navy"}
            lg:text-4xl`
          }
        >
          {feature.title}
        </h3>
        {feature.body && (
          <p
            className={
              `font-sans mt-3 max-w-md text-base ${isPrimary ? "text-white/90" : "text-navy/90"}`
            }
          >
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
          <Card feature={FEATURES[1]} isPrimary={false} />
        </div>
      </div>
    </section>
  );
}

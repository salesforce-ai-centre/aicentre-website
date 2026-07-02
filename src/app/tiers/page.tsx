import Navigation from '@/components/Navigation';
import EngagementTiers from '@/components/EngagementTiers';
import ContactBanner from '@/components/ContactBanner';

export default function TiersPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-8 section-padding">
        <div className="container-max">
          <div className="text-center">
            <p className="overline mb-3">Step 2</p>
            <h1 className="font-serif text-h1 text-ink">
              Choose Your Level of Support
            </h1>
            <p className="text-ink-secondary mt-3 max-w-2xl mx-auto">
              From self-service to fully designed — pick what fits your customer and deal stage
            </p>
          </div>
        </div>
      </section>

      <EngagementTiers />
      <ContactBanner />
    </main>
  );
}

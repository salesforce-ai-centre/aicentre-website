'use client';

import Navigation from '@/components/Navigation';
import KeynotesTable from '@/components/KeynotesTable';

export default function KeynotesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="overline mb-3">Leadership Sessions</p>
            <h1 className="font-serif text-h1 text-ink">
              Executive Keynotes
            </h1>
            <p className="text-ink-secondary mt-3 max-w-3xl mx-auto">
              High-impact sessions designed to plug into existing leadership meetings and equip executive teams for enterprise transformation.
            </p>
          </div>
          <KeynotesTable />
        </div>
      </section>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorkshops } from '@/lib/content';
import Navigation from '@/components/Navigation';
import type { Workshop } from '@/types/content';

interface WorkshopDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const router = useRouter();
  const defaultAudienceSize = "10-25";

  useEffect(() => {
    const loadWorkshop = async () => {
      const resolvedParams = await params;
      const workshops = await getWorkshops();
      const foundWorkshop = workshops.find(w => w.id === resolvedParams.slug);

      if (foundWorkshop) {
        setWorkshop(foundWorkshop);
      } else {
        router.push('/');
      }
    };

    loadWorkshop();
  }, [params, router]);

  if (!workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 section-padding">
        <div className="container-max">
          <nav className="flex items-center space-x-2 text-sm text-ink-secondary mb-8">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span>/</span>
            <Link href="/discover" className="hover:text-ink transition-colors">Offerings</Link>
            <span>/</span>
            <span className="text-ink">{workshop.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="card p-8 mb-8">
                <div className="flex flex-wrap gap-2 mb-5">
                  {workshop.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent-light text-accent rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="font-serif text-h1 text-ink mb-4">
                  {workshop.title}
                </h1>

                <p className="text-ink-secondary text-lg leading-relaxed mb-8">
                  {workshop.longDescription || workshop.description}
                </p>

                <div className="space-y-8">
                  {workshop?.sampleAgenda && (
                    <div>
                      <h2 className="text-xl font-semibold text-ink mb-3">Sample Agenda</h2>
                      <ul className="space-y-2 text-ink-secondary">
                        {workshop.sampleAgenda.split("\n").map((item: string, index: number) => (
                          <li key={`agenda_item_${index}`} className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {workshop?.engagementExpectations && (
                    <div>
                      <h2 className="text-xl font-semibold text-ink mb-3">Engagement Expectations</h2>
                      <ul className="space-y-2 text-ink-secondary">
                        {workshop.engagementExpectations.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-semibold text-ink mb-4">Workshop Format</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-surface-muted p-4 rounded-xl">
                        <h3 className="font-medium text-ink text-sm mb-1">Duration</h3>
                        <p className="text-ink-secondary">{workshop.duration}</p>
                      </div>
                      <div className="bg-surface-muted p-4 rounded-xl">
                        <h3 className="font-medium text-ink text-sm mb-1">Audience Size</h3>
                        <p className="text-ink-secondary">{workshop.audienceSize || defaultAudienceSize}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-ink mb-3">Ready to Book?</h3>
                <p className="text-ink-secondary text-sm mb-5">
                  Partner with the AI Centre team to deliver this workshop.
                </p>

                <Link
                  href="/tiers"
                  className="block w-full btn-primary text-center mb-3"
                >
                  View Tiers
                </Link>

                <Link
                  href="/agenda-builder"
                  className="block w-full btn-secondary text-center mb-4"
                >
                  Build Custom Agenda
                </Link>

                <div className="text-center">
                  <p className="text-xs text-ink-tertiary mb-1.5">Contact us via Slack:</p>
                  <a
                    href="https://salesforce.enterprise.slack.com/archives/C08E6SK1TFU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-semibold text-sm hover:underline"
                  >
                    #ai-centre-uk
                  </a>
                </div>

                <div className="mt-5 pt-5 border-t border-border">
                  <h4 className="font-medium text-ink text-sm mb-2">Details</h4>
                  <div className="space-y-1.5 text-sm text-ink-secondary">
                    <div>Category: <span className="capitalize text-ink">{workshop.category}</span></div>
                    <div>Duration: <span className="text-ink">{workshop.duration}</span></div>
                    <div>Participants: <span className="text-ink">{workshop.audienceSize || defaultAudienceSize}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

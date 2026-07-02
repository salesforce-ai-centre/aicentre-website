'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getExperiences } from '@/lib/content';
import Navigation from '@/components/Navigation';
import type { Experience } from '@/types/content';

interface ExperienceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadExperience = async () => {
      const resolvedParams = await params;
      const experiences = await getExperiences();
      const foundExperience = experiences.find(e => e.id === resolvedParams.slug);

      if (foundExperience) {
        setExperience(foundExperience);
      } else {
        router.push('/');
      }
    };

    loadExperience();
  }, [params, router]);

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'orange': return 'bg-orange-500';
      case 'green': return 'bg-green-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-accent';
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 section-padding">
        <div className="container-max">
          <nav className="flex items-center space-x-2 text-sm text-ink-secondary mb-8">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span>/</span>
            <Link href="/discover" className="hover:text-ink transition-colors">Experiences</Link>
            <span>/</span>
            <span className="text-ink">{experience.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="card p-8 mb-8">
                <div className="flex items-center mb-5">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2.5 ${getCategoryColor(experience.category)}`}></span>
                  <span className="text-ink-secondary uppercase text-xs font-semibold tracking-wide">
                    {experience.type} Experience
                  </span>
                </div>

                <h1 className="font-serif text-h1 text-ink mb-4">
                  {experience.title}
                </h1>

                <p className="text-ink-secondary text-lg leading-relaxed mb-8">
                  {experience.description}
                </p>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-ink mb-3">Experience Overview</h2>
                    <div className="text-ink-secondary">
                      {experience.type === 'interactive' && (
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Hands-on exploration of AI capabilities</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Real-time demonstrations tailored to your industry</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Interactive tools and simulations</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Collaborative discovery sessions</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Immediate feedback and results</li>
                        </ul>
                      )}
                      {experience.type === 'demo' && (
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Live showcases of cutting-edge AI technology</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Real-world use case presentations</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Behind-the-scenes look at AI development</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Expert-guided walkthroughs</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Q&A with AI specialists</li>
                        </ul>
                      )}
                      {experience.type === 'immersive' && (
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Full sensory engagement with AI scenarios</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Realistic business simulation environments</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Role-playing exercises and challenges</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Gamified learning experiences</li>
                          <li className="flex items-start gap-2"><span className="text-accent">•</span>Memorable, impactful demonstrations</li>
                        </ul>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-ink mb-4">Experience Format</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-surface-muted p-4 rounded-xl">
                        <h3 className="font-medium text-ink text-sm mb-1">Duration</h3>
                        <p className="text-ink-secondary">{experience.duration}</p>
                      </div>
                      <div className="bg-surface-muted p-4 rounded-xl">
                        <h3 className="font-medium text-ink text-sm mb-1">Audience Size</h3>
                        <p className="text-ink-secondary">{experience.audienceSize}</p>
                      </div>
                    </div>
                  </div>

                  {experience.tags.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-ink mb-3">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {experience.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-surface-muted border border-border rounded-full text-sm text-ink-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-ink mb-3">Ready to Experience?</h3>
                <p className="text-ink-secondary text-sm mb-5">
                  Combine this with a standard offering for maximum impact.
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
                    <div>Type: <span className="capitalize text-ink">{experience.type}</span></div>
                    <div>Duration: <span className="text-ink">{experience.duration}</span></div>
                    <div>Participants: <span className="text-ink">{experience.audienceSize}</span></div>
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

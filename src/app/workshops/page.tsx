'use client';

import { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import WorkshopFilter from '@/components/WorkshopFilter';
import WorkshopCard from '@/components/WorkshopCard';
import ExperienceCard from '@/components/ExperienceCard';
import FadeInWrapper from '@/components/FadeInWrapper';
import { getWorkshops, getExperiences } from '@/lib/content';
import { Workshop, Experience } from '@/types/content';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    getWorkshops().then((all) => {
      setWorkshops(all);
      setFilteredWorkshops(all);
    });
    getExperiences().then((all) => {
      setExperiences(all.sort((a, b) => {
        const order = { 'green': 0, 'orange': 1, 'red': 2 };
        return (order[a.category as keyof typeof order] || 1) - (order[b.category as keyof typeof order] || 1);
      }));
    });
  }, []);

  const handleFilterChange = useMemo(() => (filter: string) => {
    if (filter === 'all') {
      setFilteredWorkshops(workshops);
    } else {
      setFilteredWorkshops(workshops.filter(workshop =>
        workshop.category === filter || workshop.tags.some(tag =>
          tag.toLowerCase().includes(filter.toLowerCase())
        )
      ));
    }
  }, [workshops]);

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Standard Offerings */}
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="overline mb-3">Our Menu</p>
            <h1 className="font-serif text-h1 text-ink">
              Standard Offerings
            </h1>
            <p className="text-ink-secondary mt-3 max-w-2xl mx-auto">
              Proven formats from short experiences to full-day programmes
            </p>
          </div>

          <WorkshopFilter onFilterChange={handleFilterChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <FadeInWrapper key={workshop.id}>
                <WorkshopCard workshop={workshop} />
              </FadeInWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Experiences */}
      <section className="py-16 section-padding bg-surface-muted">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="overline mb-3">Add-ons</p>
            <h2 className="font-serif text-h2 text-ink">
              Immersive Experiences
            </h2>
            <p className="text-ink-secondary mt-3 max-w-2xl mx-auto">
              Add an experience to make your engagement memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <FadeInWrapper key={experience.id}>
                <ExperienceCard experience={experience} />
              </FadeInWrapper>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

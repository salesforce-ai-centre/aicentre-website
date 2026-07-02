'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import DiscoverSearch from '@/components/DiscoverSearch';
import WorkshopFilter from '@/components/WorkshopFilter';
import WorkshopCard from '@/components/WorkshopCard';
import ExperienceCard from '@/components/ExperienceCard';
import KeynotesTable from '@/components/KeynotesTable';
import JourneyMap from '@/components/JourneyMap';
import TeamMemberCard from '@/components/TeamMemberCard';
import FadeInWrapper from '@/components/FadeInWrapper';
import ContactBanner from '@/components/ContactBanner';
import { getWorkshops, getExperiences, getTeamMembers } from '@/lib/content';
import { Workshop, Experience, TeamMember } from '@/types/content';

const sections = [
  { id: 'offerings', label: 'Workshops' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'keynotes', label: 'Keynotes' },
  { id: 'journey', label: 'Journey' },
  { id: 'team', label: 'Team' },
];

export default function DiscoverPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getWorkshops().then((all) => {
      setWorkshops(all);
      setFilteredWorkshops(all);
    });
    getExperiences().then((all) => {
      const sorted = all.sort((a, b) => {
        const order = { 'green': 0, 'orange': 1, 'red': 2 };
        return (order[a.category as keyof typeof order] || 1) - (order[b.category as keyof typeof order] || 1);
      });
      setExperiences(sorted);
      setFilteredExperiences(sorted);
    });
    getTeamMembers().then(setTeamMembers);
  }, []);

  const handleSearchFilter = useCallback((query: string) => {
    setSearchQuery(query);
    const lower = query.toLowerCase().trim();

    if (!lower) {
      setFilteredWorkshops(workshops);
      setFilteredExperiences(experiences);
      return;
    }

    setFilteredWorkshops(workshops.filter(w =>
      w.title.toLowerCase().includes(lower) ||
      w.description.toLowerCase().includes(lower) ||
      w.tags.some(t => t.toLowerCase().includes(lower))
    ));

    setFilteredExperiences(experiences.filter(e =>
      e.title.toLowerCase().includes(lower) ||
      e.description.toLowerCase().includes(lower) ||
      e.tags.some(t => t.toLowerCase().includes(lower))
    ));
  }, [workshops, experiences]);

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

      {/* Hero */}
      <section className="pt-32 pb-8 section-padding">
        <div className="container-max">
          <div className="text-center mb-8">
            <p className="overline mb-3">Step 1</p>
            <h1 className="font-serif text-h1 text-ink">
              Discover Our Offerings
            </h1>
            <p className="text-ink-secondary mt-3 max-w-2xl mx-auto mb-8">
              Explore workshops, immersive experiences, executive keynotes, and more
            </p>

            <DiscoverSearch onFilter={handleSearchFilter} />
          </div>

          {/* Sub-nav */}
          <nav className="flex justify-center gap-2 flex-wrap mt-8">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-4 py-2 rounded-full text-sm font-medium text-ink-secondary hover:text-ink hover:bg-surface-muted transition-colors border border-border"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Standard Offerings */}
      <section id="offerings" className="py-16 section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="overline mb-3">Our Menu</p>
            <h2 className="font-serif text-h2 text-ink">
              Standard Offerings
            </h2>
            <p className="text-ink-secondary mt-3 max-w-2xl mx-auto">
              Proven formats from short experiences to full-day programmes
            </p>
          </div>

          {!searchQuery && <WorkshopFilter onFilterChange={handleFilterChange} />}

          {filteredWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <FadeInWrapper key={workshop.id}>
                  <WorkshopCard workshop={workshop} />
                </FadeInWrapper>
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-center text-ink-tertiary py-8">No workshops match &ldquo;{searchQuery}&rdquo;</p>
          ) : null}
        </div>
      </section>

      {/* Immersive Experiences */}
      <section id="experiences" className="py-16 section-padding bg-surface-muted">
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

          {filteredExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => (
                <FadeInWrapper key={experience.id}>
                  <ExperienceCard experience={experience} />
                </FadeInWrapper>
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-center text-ink-tertiary py-8">No experiences match &ldquo;{searchQuery}&rdquo;</p>
          ) : null}
        </div>
      </section>

      {/* Executive Keynotes */}
      <section id="keynotes" className="py-16 section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="overline mb-3">Leadership Sessions</p>
            <h2 className="font-serif text-h2 text-ink">
              Executive Keynotes
            </h2>
            <p className="text-ink-secondary mt-3 max-w-3xl mx-auto">
              High-impact sessions designed to plug into existing leadership meetings and equip executive teams for enterprise transformation
            </p>
          </div>
          <KeynotesTable />
        </div>
      </section>

      {/* Journey Map */}
      <section id="journey" className="py-16 section-padding bg-surface-muted">
        <div className="container-max">
          <div className="text-center mb-8">
            <p className="overline mb-3">Customer Lifecycle</p>
            <h2 className="font-serif text-h2 text-ink">
              AI Centre Journey
            </h2>
            <p className="text-ink-secondary mt-3 max-w-2xl mx-auto">
              Use this map to identify the right experience for your customers at each stage of their Agentforce journey
            </p>
          </div>
          <JourneyMap />
        </div>
      </section>

      {/* Meet the Team */}
      <section id="team" className="py-16 section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="overline mb-3">Who We Are</p>
            <h2 className="font-serif text-h2 text-ink">
              Meet the Team
            </h2>
            <p className="text-ink-secondary mt-3 max-w-2xl mx-auto">
              The AI Centre team here to support your customer engagements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((teamMember) => (
              <FadeInWrapper key={teamMember.id}>
                <TeamMemberCard teamMember={teamMember} />
              </FadeInWrapper>
            ))}
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}

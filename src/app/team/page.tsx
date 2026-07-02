'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import TeamMemberCard from '@/components/TeamMemberCard';
import FadeInWrapper from '@/components/FadeInWrapper';
import { getTeamMembers } from '@/lib/content';
import { TeamMember } from '@/types/content';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getTeamMembers().then(setTeamMembers);
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="overline mb-3">Who We Are</p>
            <h1 className="font-serif text-h1 text-ink">
              Meet the Team
            </h1>
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
    </main>
  );
}

/**
 * MeetTheTeam — "Meet the team" section on the About page.
 *
 * Section heading + carousel of team member cards (portrait photo, name,
 * role) on the shared card shell. Figma node 7:54 (heading) + 14:170 (row).
 * Data from content/team-members.json.
 *
 * AIC2-141 — part of the About Page epic (AIC2-127).
 */

'use client';

import Image from 'next/image';
import Carousel from '@/components/ui/Carousel';
import SectionHeading from '@/components/ui/SectionHeading';
import { getTeamMembers } from '@/lib/content';

export default function MeetTheTeam() {
  const team = getTeamMembers();
  if (team.length === 0) return null;

  return (
    <section className="section-padding py-16">
      <div className="container-max">
        <SectionHeading title="Meet the team" className="mb-12" />

        <Carousel
          ariaLabel="AI Centre team members"
          itemClassName="basis-[70%] sm:basis-1/3 lg:basis-1/4"
        >
          {team.map((member) => (
            <div
              key={member.id}
              className="flex h-full flex-col overflow-hidden rounded-card bg-white pb-6 shadow-card"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 70vw, 25vw"
                />
              </div>
              <div className="px-6 pt-4 text-navy">
                <p className="font-heading text-xl font-semibold">{member.name}</p>
                <p className="font-sans mt-1 text-sm text-navy/70">{member.role}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

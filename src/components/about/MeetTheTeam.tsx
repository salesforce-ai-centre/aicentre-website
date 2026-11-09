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

import { useEffect, useState } from 'react';
import Carousel from '@/components/ui/Carousel';
import SectionHeading from '@/components/ui/SectionHeading';
import TeamMemberCard from '@/components/ui/TeamMemberCard';
import { getTeamMembers } from '@/lib/content';
import type { TeamMember } from '@/types/content';
import styles from './MeetTheTeam.module.css';

export default function MeetTheTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    getTeamMembers().then(setTeam);
  }, []);

  if (team.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeading title="Meet the team" className={styles.heading} />

        <Carousel
          ariaLabel="AI Centre team members"
          itemClassName={styles.item}
        >
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

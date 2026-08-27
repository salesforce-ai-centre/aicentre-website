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
import styles from './MeetTheTeam.module.css';

export default function MeetTheTeam() {
  const team = getTeamMembers();
  if (team.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeading title="Meet the team" className={styles.heading} />

        <Carousel
          ariaLabel="AI Centre team members"
          itemClassName="basis-[70%] sm:basis-1/3 lg:basis-1/4"
        >
          {team.map((member) => (
            <div key={member.id} className={styles.card}>
              {/* Photo fills the card; the bottom fades smoothly into white. */}
              <div className={styles.imageWrapper}>
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 640px) 70vw, 25vw"
                />
                <div className={styles.fade} />
              </div>
              {/* Name/role sit over the faded lower area of the photo. */}
              <div className={styles.text}>
                <p className={styles.name}>{member.name}</p>
                <p className={styles.role}>{member.role}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

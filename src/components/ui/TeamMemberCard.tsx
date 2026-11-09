/**
 * TeamMemberCard — portrait photo with name/role over a fade at the bottom.
 *
 * Extracted from MeetTheTeam (AIC2-141) so both the "Meet the team" section
 * and the UI block renderer (AIC2-152) reuse the same component.
 */

import Image from 'next/image';
import type { TeamMember } from '@/types/content';
import styles from './TeamMemberCard.module.css';

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export default function TeamMemberCard({ member, className = '' }: TeamMemberCardProps) {
  return (
    <div className={`${styles.card} ${className}`.trim()}>
      <div className={styles.imageWrapper}>
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className={styles.fade} />
      </div>
      <div className={styles.text}>
        <p className={styles.name}>{member.name}</p>
        <p className={styles.role}>{member.role}</p>
      </div>
    </div>
  );
}

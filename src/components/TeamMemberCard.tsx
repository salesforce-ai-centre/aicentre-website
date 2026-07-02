import { TeamMember } from '@/types/content';
import Image from 'next/image'

interface TeamMemberCardProps {
  teamMember: TeamMember;
}

export default function TeamMemberCard({ teamMember }: TeamMemberCardProps) {
  return (
    <div className="card p-6 relative overflow-hidden group flex flex-col h-full">
      <div className="flex flex-col flex-1 items-start text-left">
        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-border">
          {teamMember.imageUrl ? (
            <Image
              src={teamMember.imageUrl}
              alt={`${teamMember.name}'s profile picture`}
              fill
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-accent-light flex items-center justify-center">
              <span className="text-2xl text-accent font-semibold">
                {teamMember.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition-colors">
          {teamMember.name}
        </h3>

        <div className="text-sm text-ink-secondary mt-1">
          {teamMember.role}
        </div>
      </div>
    </div>
  );
}

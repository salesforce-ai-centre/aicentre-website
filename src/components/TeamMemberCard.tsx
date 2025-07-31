import { TeamMember } from '@/types/content';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

interface TeamMemberCardProps {
  teamMember: TeamMember;
}

export default function TeamMemberCard({ teamMember }: TeamMemberCardProps) {
  return (
    <div 
    className="glass-card p-8 relative overflow-hidden group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 flex flex-col h-full"
    style={{ transition: 'border-color 0.2s ease' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
      <div className="flex flex-col flex-1 items-start text-left">
        {/* Profile Image */}
        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden">
          {teamMember.imageUrl ? (
            <Image
              src={teamMember.imageUrl}
              alt={`${teamMember.name}'s profile picture`}
              fill
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-3xl text-purple-200">
                {teamMember.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
          {teamMember.name}
        </h3>

        {/* Role */}
        <div className="text-lg text-purple-300 mb-4">
          {teamMember.role}
        </div>
        
        {/* Description */}
        {teamMember.description && (
          <p className="text-white text-opacity-90 leading-relaxed">
            {teamMember.description}
          </p>
        )}
      </div>
    </div>
  );
}
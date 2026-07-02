'use client';

import { useEventSection } from '@/hooks/useEventSection';
import type { EventTeamMember } from '@/types/events';

const roleColors: Record<string, string> = {
  'Host': 'bg-accent-light text-accent',
  'Facilitator': 'bg-purple-100 text-purple-700',
  'Speaker': 'bg-pink-100 text-pink-700',
  'Presenter': 'bg-pink-100 text-pink-700',
  'Account Team': 'bg-blue-100 text-blue-700',
  'Lead AE': 'bg-blue-100 text-blue-700',
  'Lead SE': 'bg-teal-100 text-teal-700',
  'Support': 'bg-gray-100 text-gray-600',
  'REWS Coordinator': 'bg-orange-100 text-orange-700',
  'Partner': 'bg-emerald-100 text-emerald-700',
};

export default function TeamSection({ eventId }: { eventId: string }) {
  const { data: team, isLoading, error } = useEventSection<EventTeamMember[]>(eventId, 'team', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!team || team.length === 0) return <p className="text-xs text-ink-tertiary">No team members assigned</p>;

  return (
    <div className="space-y-2">
      {team.map((member) => {
        const roleStyle = roleColors[member.role] || 'bg-gray-100 text-gray-600';
        return (
          <div key={member.id} className="flex items-center gap-3 py-2">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-xs font-semibold text-ink-tertiary">
                {member.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{member.name}</p>
              {member.email && <p className="text-[11px] text-ink-tertiary truncate">{member.email}</p>}
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleStyle}`}>
              {member.role}
            </span>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useEventSection } from '@/hooks/useEventSection';

interface EventExperience {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  category: string | null;
}

export default function ExperiencesSection({ eventId }: { eventId: string }) {
  const { data: experiences, isLoading, error } = useEventSection<EventExperience[]>(eventId, 'experiences', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2].map((i) => <div key={i} className="h-16 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!experiences || experiences.length === 0) return <p className="text-xs text-ink-tertiary">No experiences linked</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {experiences.map((exp) => (
        <div key={exp.id} className="p-3 bg-surface-muted rounded-xl">
          <p className="text-sm font-medium text-ink">{exp.name}</p>
          {exp.category && (
            <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">
              {exp.category}
            </span>
          )}
          {exp.description && (
            <p className="text-xs text-ink-secondary mt-1 line-clamp-2">{exp.description}</p>
          )}
          {exp.duration && (
            <p className="text-[11px] text-ink-tertiary mt-1">{exp.duration}</p>
          )}
        </div>
      ))}
    </div>
  );
}

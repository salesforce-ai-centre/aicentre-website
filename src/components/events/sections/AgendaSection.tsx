'use client';

import { useEventSection } from '@/hooks/useEventSection';
import type { EventAgenda } from '@/types/events';

export default function AgendaSection({ eventId }: { eventId: string }) {
  const { data: agenda, isLoading, error } = useEventSection<EventAgenda | null>(eventId, 'agenda', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!agenda) return <p className="text-xs text-ink-tertiary">No agenda linked to this event</p>;

  return (
    <div>
      <p className="text-xs font-medium text-ink-secondary mb-3">{agenda.name}</p>
      <div className="space-y-1">
        {agenda.items.map((item) => (
          <div key={item.id} className="flex gap-3 py-2 border-b border-border/50 last:border-0">
            <div className="w-20 flex-shrink-0 text-[11px] text-ink-tertiary font-medium">
              {item.startTime || '—'}
            </div>
            <div className="flex-1">
              <p className="text-sm text-ink font-medium">{item.title}</p>
              {item.speaker && <p className="text-[11px] text-ink-tertiary mt-0.5">{item.speaker}</p>}
              {item.description && <p className="text-xs text-ink-secondary mt-1">{item.description}</p>}
            </div>
            {item.duration && (
              <span className="text-[10px] text-ink-tertiary flex-shrink-0">{item.duration}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

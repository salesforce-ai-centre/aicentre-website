'use client';

import { useEventSection } from '@/hooks/useEventSection';
import type { EngageData } from '@/types/events';

export default function EngageSection({ eventId }: { eventId: string }) {
  const { data, isLoading, error } = useEventSection<EngageData>(eventId, 'engage', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2].map((i) => <div key={i} className="h-12 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!data) return <p className="text-xs text-ink-tertiary">No engagement data</p>;

  const hasData = data.quizResults.length > 0 || data.huntResults.length > 0 || data.wordCloudEntries.length > 0;
  if (!hasData) return <p className="text-xs text-ink-tertiary">No engagement activities for this event</p>;

  return (
    <div className="space-y-4">
      {data.quizResults.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2">Quizzes</p>
          <div className="space-y-2">
            {data.quizResults.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-2 bg-surface-muted rounded-lg">
                <span className="text-sm text-ink">{quiz.quizName}</span>
                <span className="text-xs text-ink-tertiary">{quiz.participantCount} participants</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.huntResults.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2">Hunts</p>
          <div className="space-y-2">
            {data.huntResults.map((hunt) => (
              <div key={hunt.id} className="flex items-center justify-between p-2 bg-surface-muted rounded-lg">
                <span className="text-sm text-ink">{hunt.huntName}</span>
                <span className="text-xs text-ink-tertiary">{hunt.completionCount} completions</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.wordCloudEntries.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2">Word Cloud</p>
          <div className="flex flex-wrap gap-1.5">
            {data.wordCloudEntries.map((entry, i) => (
              <span
                key={i}
                className="text-xs bg-accent-light text-accent px-2 py-0.5 rounded-full"
                style={{ fontSize: `${Math.min(14, 10 + entry.count)}px` }}
              >
                {entry.word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

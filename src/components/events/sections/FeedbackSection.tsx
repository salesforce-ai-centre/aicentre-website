'use client';

import { useEventSection } from '@/hooks/useEventSection';
import type { EventFeedback } from '@/types/events';

export default function FeedbackSection({ eventId }: { eventId: string }) {
  const { data: feedback, isLoading, error } = useEventSection<EventFeedback[]>(eventId, 'feedback', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2].map((i) => <div key={i} className="h-12 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!feedback || feedback.length === 0) return <p className="text-xs text-ink-tertiary">No feedback collected</p>;

  return (
    <div className="space-y-4">
      {feedback.map((fb) => (
        <div key={fb.id} className="p-3 bg-surface-muted rounded-xl">
          <div className="flex items-center justify-between mb-2">
            {fb.type && <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wide">{fb.type}</span>}
            <div className="flex items-center gap-3 text-xs text-ink-tertiary">
              <span>{fb.responseCount} responses</span>
              {fb.averageRating !== null && (
                <span className="font-semibold text-ink">{fb.averageRating.toFixed(1)} avg</span>
              )}
            </div>
          </div>
          {fb.responses.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {fb.responses.slice(0, 5).map((resp) => (
                <div key={resp.id} className="text-xs">
                  {resp.question && <p className="text-ink-tertiary">{resp.question}</p>}
                  {resp.answer && <p className="text-ink-secondary">{resp.answer}</p>}
                </div>
              ))}
              {fb.responses.length > 5 && (
                <p className="text-[11px] text-ink-tertiary">+ {fb.responses.length - 5} more</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

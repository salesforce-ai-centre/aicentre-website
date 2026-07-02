'use client';

import { useEventSection } from '@/hooks/useEventSection';
import type { F1RaceData } from '@/types/events';

function formatLapTime(ms: number | null): string {
  if (!ms) return '—';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

export default function F1Section({ eventId }: { eventId: string }) {
  const { data: races, isLoading, error } = useEventSection<F1RaceData[]>(eventId, 'f1', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2].map((i) => <div key={i} className="h-10 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!races || races.length === 0) return <p className="text-xs text-ink-tertiary">No F1 races for this event</p>;

  return (
    <div className="space-y-4">
      {races.map((race) => (
        <div key={race.raceId}>
          <p className="text-xs font-semibold text-ink-secondary mb-2">{race.raceName}</p>
          {race.entries.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide w-8">Pos</th>
                  <th className="text-left py-1.5 text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">Driver</th>
                  <th className="text-left py-1.5 text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">Best Lap</th>
                  <th className="text-left py-1.5 text-[10px] font-semibold text-ink-tertiary uppercase tracking-wide">Top Speed</th>
                </tr>
              </thead>
              <tbody>
                {race.entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/50">
                    <td className="py-2 text-ink font-semibold">{entry.finalPosition || '—'}</td>
                    <td className="py-2">
                      <span className="text-ink">{entry.driverName}</span>
                      {entry.driverPersona && (
                        <span className="text-[11px] text-ink-tertiary ml-1.5">({entry.driverPersona})</span>
                      )}
                    </td>
                    <td className="py-2 text-ink-secondary font-mono text-xs">{formatLapTime(entry.bestLapTime)}</td>
                    <td className="py-2 text-ink-secondary text-xs">{entry.topSpeed ? `${entry.topSpeed} kph` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-ink-tertiary">No entries recorded</p>
          )}
        </div>
      ))}
    </div>
  );
}

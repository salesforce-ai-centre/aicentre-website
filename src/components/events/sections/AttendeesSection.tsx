'use client';

import { useEventSection } from '@/hooks/useEventSection';
import type { EventAttendee } from '@/types/events';

const rsvpColors: Record<string, string> = {
  'Accepted': 'text-green-700 bg-green-100',
  'Declined': 'text-red-700 bg-red-100',
  'Invited': 'text-blue-700 bg-blue-100',
  'Cancelled': 'text-gray-600 bg-gray-100',
  'Waitlist': 'text-orange-700 bg-orange-100',
};

const attendanceColors: Record<string, string> = {
  'Checked In': 'text-green-700',
  'Checked Out': 'text-gray-600',
  'No Show': 'text-red-600',
  'Left Early': 'text-orange-600',
};

export default function AttendeesSection({ eventId }: { eventId: string }) {
  const { data: attendees, isLoading, error } = useEventSection<EventAttendee[]>(eventId, 'attendees', true);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;
  if (!attendees || attendees.length === 0) return <p className="text-xs text-ink-tertiary">No attendees registered</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide">Name</th>
            <th className="text-left py-2 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide">Company</th>
            <th className="text-left py-2 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide">RSVP</th>
            <th className="text-left py-2 text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            const rsvpStyle = rsvpColors[attendee.rsvpStatus || ''] || '';
            const attendanceStyle = attendanceColors[attendee.attendanceStatus || ''] || 'text-ink-tertiary';
            return (
              <tr key={attendee.id} className="border-b border-border/50">
                <td className="py-2.5 text-ink font-medium">{attendee.name}</td>
                <td className="py-2.5 text-ink-secondary">{attendee.company || '—'}</td>
                <td className="py-2.5">
                  {attendee.rsvpStatus && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rsvpStyle}`}>
                      {attendee.rsvpStatus}
                    </span>
                  )}
                </td>
                <td className={`py-2.5 text-xs font-medium ${attendanceStyle}`}>
                  {attendee.attendanceStatus || 'Not Checked In'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

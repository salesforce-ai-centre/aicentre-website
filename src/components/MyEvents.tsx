'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { CalendarDays, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import type { UserEvent } from '@/types/content';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(startStr: string | null, endStr: string | null): string {
  if (!startStr) return '';
  const start = new Date(startStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (!endStr) return start;
  const end = new Date(endStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${start} – ${end}`;
}

function isUpcoming(event: UserEvent): boolean {
  const eventDate = event.startDateTime || event.date;
  if (!eventDate) return false;
  return new Date(eventDate) >= new Date(new Date().toDateString());
}

const statusColors: Record<string, string> = {
  'Approved': 'bg-green-100 text-green-800',
  'Planning': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-purple-100 text-purple-800',
  'Completed': 'bg-gray-100 text-gray-600',
  'Submitted': 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-orange-100 text-orange-800',
  'On Hold': 'bg-red-100 text-red-700',
};

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

function EventCard({ event }: { event: UserEvent }) {
  const statusStyle = statusColors[event.status] || 'bg-gray-100 text-gray-600';
  const roleStyle = roleColors[event.role] || 'bg-gray-100 text-gray-600';
  const upcoming = isUpcoming(event);

  return (
    <Link href={`/events/${event.id}`} className={`card p-5 block hover:shadow-card-hover transition-shadow ${!upcoming ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-ink leading-tight line-clamp-2">
          {event.name}
        </h3>
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle}`}>
          {event.status}
        </span>
      </div>

      {event.account && (
        <p className="text-xs text-ink-secondary font-medium mb-3 flex items-center gap-1.5">
          <Users size={12} className="text-ink-tertiary flex-shrink-0" />
          {event.account}
        </p>
      )}

      <div className="space-y-1.5 mb-3">
        {(event.startDateTime || event.date) && (
          <p className="text-xs text-ink-secondary flex items-center gap-1.5">
            <CalendarDays size={12} className="text-ink-tertiary flex-shrink-0" />
            {formatDate(event.startDateTime || event.date)}
          </p>
        )}
        {event.startDateTime && (
          <p className="text-xs text-ink-secondary flex items-center gap-1.5">
            <Clock size={12} className="text-ink-tertiary flex-shrink-0" />
            {formatTime(event.startDateTime, event.endDateTime)}
          </p>
        )}
        {event.space && (
          <p className="text-xs text-ink-secondary flex items-center gap-1.5">
            <MapPin size={12} className="text-ink-tertiary flex-shrink-0" />
            {event.space}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleStyle}`}>
          {event.role}
        </span>
        {event.program && (
          <span className="text-[10px] font-medium text-ink-tertiary bg-surface-muted px-2 py-0.5 rounded-full">
            {event.program}
          </span>
        )}
        {event.slackChannelLink && (
          <span
            onClick={(e) => { e.preventDefault(); window.open(event.slackChannelLink!, '_blank'); }}
            className="ml-auto text-ink-tertiary hover:text-accent transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
          </span>
        )}
      </div>
    </Link>
  );
}

export default function MyEvents() {
  const { user, isLoading: userLoading } = useUser();
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetch('/api/my-events')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (data.success) setEvents(data.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [user, userLoading]);

  if (!user || userLoading) return null;
  if (error) return null;

  const upcoming = events.filter(isUpcoming);
  const past = events.filter((e) => !isUpcoming(e));

  if (isLoading) {
    return (
      <section className="py-16 bg-surface-muted">
        <div className="container-max section-padding">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-border rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-surface-elevated rounded-2xl border border-border" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="py-16 bg-surface-muted">
      <div className="container-max section-padding">
        <div className="mb-8">
          <p className="overline mb-2">Your Events</p>
          <h2 className="font-sans font-bold text-h2 text-ink">
            My Engagements
          </h2>
          <p className="text-ink-secondary mt-2 text-sm">
            Events where you&apos;re part of the team
          </p>
        </div>

        {upcoming.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wide mb-4">
              Upcoming ({upcoming.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wide mb-4">
              Past ({past.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {past.length > 6 && (
              <p className="text-xs text-ink-tertiary mt-3">
                + {past.length - 6} more past events
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, ClipboardList, Calendar, Sparkles, Building2, MessageSquare, Gamepad2, Flag, StickyNote, LayoutList } from 'lucide-react';
import type { EventDetail } from '@/types/events';
import CollapsibleSection from './CollapsibleSection';
import OverviewSection from './sections/OverviewSection';
import TeamSection from './sections/TeamSection';
import AttendeesSection from './sections/AttendeesSection';
import TasksSection from './sections/TasksSection';
import AgendaSection from './sections/AgendaSection';
import AccountsSection from './sections/AccountsSection';
import FeedbackSection from './sections/FeedbackSection';
import EngageSection from './sections/EngageSection';
import F1Section from './sections/F1Section';
import NotesSection from './sections/NotesSection';
import ExperiencesSection from './sections/ExperiencesSection';

interface EventDetailShellProps {
  eventId: string;
}

export default function EventDetailShell({ eventId }: EventDetailShellProps) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Error ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (json.success) setEvent(json.data);
        else throw new Error(json.error);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="animate-pulse space-y-4 max-w-4xl">
          <div className="h-3 bg-border rounded w-20" />
          <div className="h-10 bg-border/60 rounded-lg w-[28rem]" />
          <div className="h-4 bg-border/40 rounded w-64" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-surface-muted rounded-2xl border border-border" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-padding">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-accent transition-colors mb-6">
          <ArrowLeft size={14} />
          Back
        </Link>
        <div className="card p-10 text-center max-w-md mx-auto">
          <p className="text-ink-secondary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="relative min-h-screen">
      {/* Ambient purple haze */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="haze haze-drift-1 top-40 left-10 w-72 h-72 bg-purple-500 opacity-[0.12]" />
        <div className="haze haze-drift-2 top-96 right-20 w-64 h-64 bg-blue-500 opacity-[0.1]" />
        <div className="haze haze-drift-3 bottom-40 left-1/3 w-80 h-80 bg-indigo-500 opacity-[0.08]" />
      </div>

      <div className="relative z-10">
        <OverviewSection event={event} />

        <div className="section-padding pt-8 pb-16">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-3">
          <CollapsibleSection title="Tasks" icon={<ClipboardList size={16} />} defaultOpen>
            <TasksSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Event Team" icon={<Users size={16} />} defaultOpen>
            <TeamSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Agenda" icon={<Calendar size={16} />} defaultOpen>
            <AgendaSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Attendees" icon={<LayoutList size={16} />} badge={event.totalAttendees || undefined} defaultOpen>
            <AttendeesSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Account & Opportunity" icon={<Building2 size={16} />} defaultOpen>
            <AccountsSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Notes" icon={<StickyNote size={16} />} defaultOpen>
            <NotesSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="F1 Results" icon={<Flag size={16} />} defaultOpen>
            <F1Section eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Experiences" icon={<Sparkles size={16} />} defaultOpen>
            <ExperiencesSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Feedback" icon={<MessageSquare size={16} />} defaultOpen>
            <FeedbackSection eventId={eventId} />
          </CollapsibleSection>

          <CollapsibleSection title="Engage" icon={<Gamepad2 size={16} />} defaultOpen>
            <EngageSection eventId={eventId} />
          </CollapsibleSection>
        </div>
      </div>
      </div>
    </div>
  );
}

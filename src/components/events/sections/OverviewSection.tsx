'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock, Users, ExternalLink, Presentation } from 'lucide-react';
import type { EventDetail } from '@/types/events';
import EventLogoUpload from '@/components/events/EventLogoUpload';

const statusColors: Record<string, string> = {
  'Approved': 'bg-green-500/10 text-green-700 border border-green-200',
  'Planning': 'bg-blue-500/10 text-blue-700 border border-blue-200',
  'In Progress': 'bg-accent/10 text-accent border border-accent/20',
  'Completed': 'bg-ink/5 text-ink-secondary border border-border',
  'Submitted': 'bg-yellow-500/10 text-yellow-700 border border-yellow-200',
  'Under Review': 'bg-orange-500/10 text-orange-700 border border-orange-200',
  'On Hold': 'bg-red-500/10 text-red-700 border border-red-200',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
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

interface OverviewSectionProps {
  event: EventDetail;
}

export default function OverviewSection({ event }: OverviewSectionProps) {
  const [logoUrl, setLogoUrl] = useState(event.logoUrl);
  const statusStyle = statusColors[event.status] || 'bg-ink/5 text-ink-secondary border border-border';

  return (
    <section className="relative pt-28 pb-10 overflow-hidden">
      {/* Gradient mesh matching Hero */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] opacity-30 pointer-events-none haze-drift-1"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, #FF6B35 0%, transparent 50%), radial-gradient(ellipse at 90% 60%, #635BFF 0%, transparent 50%), radial-gradient(ellipse at 50% 10%, #00D4FF 0%, transparent 40%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="section-padding relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-tertiary hover:text-accent transition-colors mb-8 group">
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to My Events
        </Link>

        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex items-start gap-5">
            <EventLogoUpload
              eventId={event.id}
              currentLogoUrl={logoUrl}
              onLogoChange={setLogoUrl}
            />
            <div>
              <p className="overline mb-3">Event Command Centre</p>
              <h1 className="font-sans font-bold text-h1 text-ink leading-tight">
                {event.name}
              </h1>
              {event.program && (
                <p className="text-base text-ink-secondary mt-2">{event.program}</p>
              )}
            </div>
          </div>
          <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full whitespace-nowrap ${statusStyle}`}>
            {event.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 mb-6">
          {(event.startDateTime || event.date) && (
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <CalendarDays size={15} className="text-ink-tertiary" />
              <span>{formatDate(event.startDateTime || event.date)}</span>
            </div>
          )}
          {event.startDateTime && (
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <Clock size={15} className="text-ink-tertiary" />
              <span>{formatTime(event.startDateTime, event.endDateTime)}</span>
            </div>
          )}
          {event.totalAttendees > 0 && (
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <Users size={15} className="text-ink-tertiary" />
              <span>{event.totalAttendees} attendees</span>
            </div>
          )}
          {event.host && (
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <Presentation size={15} className="text-ink-tertiary" />
              <span>{event.host}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {event.eventType && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] bg-surface-muted text-ink-secondary px-2.5 py-1 rounded-full border border-border">
              {event.eventType}
            </span>
          )}
          {event.tier && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] bg-accent/5 text-accent px-2.5 py-1 rounded-full border border-accent/15">
              {event.tier}
            </span>
          )}
          {event.industry && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] bg-surface-muted text-ink-secondary px-2.5 py-1 rounded-full border border-border">
              {event.industry}
            </span>
          )}
        </div>

        {event.description && (
          <div className="prose prose-sm max-w-3xl text-ink-secondary/90 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: event.description }} />
        )}

        {(event.slackChannelLink || event.googleSlidesUrl) && (
          <div className="flex items-center gap-4">
            {event.slackChannelLink && (
              <a
                href={event.slackChannelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-4 !py-2 !text-xs inline-flex items-center gap-1.5"
              >
                <ExternalLink size={11} />
                Slack Channel
              </a>
            )}
            {event.googleSlidesUrl && (
              <a
                href={event.googleSlidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-4 !py-2 !text-xs inline-flex items-center gap-1.5"
              >
                <ExternalLink size={11} />
                Slides
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
}

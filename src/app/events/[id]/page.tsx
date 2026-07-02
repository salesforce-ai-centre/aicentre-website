'use client';

import { use } from 'react';
import EventDetailShell from '@/components/events/EventDetailShell';
import Navigation from '@/components/Navigation';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = use(params);

  return (
    <>
      <Navigation />
      <main>
        <EventDetailShell eventId={id} />
      </main>
    </>
  );
}

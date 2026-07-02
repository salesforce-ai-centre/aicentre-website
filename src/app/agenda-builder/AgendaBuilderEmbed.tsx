'use client';

import { useRef, useCallback } from 'react';

const AGENDA_URL = 'https://ai-centre-agenda-7c632e920c72.herokuapp.com';

interface Props {
  sfToken: string | null;
  sfInstanceUrl: string | null;
  userEmail: string | null;
}

export function AgendaBuilderEmbed({ sfToken, sfInstanceUrl, userEmail }: Props) {
  const sentRef = useRef(false);

  const handleLoad = useCallback(() => {
    if (sentRef.current || !sfToken || !sfInstanceUrl) return;
    sentRef.current = true;

    const iframe = document.querySelector<HTMLIFrameElement>('#agenda-embed');
    iframe?.contentWindow?.postMessage(
      { type: 'sf-embed-init', token: sfToken, instanceUrl: sfInstanceUrl, userEmail },
      AGENDA_URL,
    );
  }, [sfToken, sfInstanceUrl, userEmail]);

  return (
    <iframe
      id="agenda-embed"
      src={AGENDA_URL}
      onLoad={handleLoad}
      className="w-full h-[calc(100vh-6rem)] border-0"
      allow="clipboard-write"
      title="Agenda Builder"
    />
  );
}

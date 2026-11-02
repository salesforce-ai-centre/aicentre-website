'use client';

/**
 * Dev/staging-only floating button that flips the session between `full`
 * and `lite` via /api/auth/dev-tier, so the lite experience can be previewed
 * without a real signed link. Never rendered in production — see layout.tsx.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessTier } from '@/contexts/AccessTierContext';
import styles from './DevTierToggle.module.css';

export default function DevTierToggle() {
  const router = useRouter();
  const tier = useAccessTier();
  const [pending, setPending] = useState(false);

  const handleToggle = async () => {
    if (pending) return;
    setPending(true);
    const nextTier = tier === 'lite' ? 'full' : 'lite';
    try {
      await fetch('/api/auth/dev-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: nextTier }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={styles.toggle}
    >
      {pending ? 'Switching…' : `Viewing: ${tier === 'lite' ? 'Lite' : 'Full'} — switch to ${tier === 'lite' ? 'Full' : 'Lite'}`}
    </button>
  );
}

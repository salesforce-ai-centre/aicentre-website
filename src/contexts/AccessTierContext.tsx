/**
 * AccessTierContext — makes the current access tier (full | lite) available to
 * client components so they can hide internal-only affordances for lite
 * (client) sessions. Fed by the server layout via getServerAccessTier().
 *
 * AIC2-161 — part of the Privacy & Sharing epic (AIC2-155).
 */

'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { AccessTier } from '@/lib/auth-session';

const AccessTierContext = createContext<AccessTier | null>(null);

export function AccessTierProvider({
  tier,
  children,
}: {
  tier: AccessTier | null;
  children: ReactNode;
}) {
  return <AccessTierContext.Provider value={tier}>{children}</AccessTierContext.Provider>;
}

/** Current access tier (null if unauthenticated). */
export function useAccessTier(): AccessTier | null {
  return useContext(AccessTierContext);
}

/** Convenience: true when the session is the client-safe lite tier. */
export function useIsLite(): boolean {
  return useContext(AccessTierContext) === 'lite';
}

/**
 * Auth session helpers — read the access tier from the session cookie.
 *
 * The `aicentre-auth` cookie is set by middleware.ts after a valid signed-URL
 * redemption. Today its value is the opaque string `'authenticated'` (all-or-
 * nothing). AIC2-157 will extend the cookie to carry an explicit scope; until
 * then the legacy value is treated as `full`.
 *
 * AIC2-159 / AIC2-157 — part of the Privacy & Sharing epic (AIC2-155).
 */

export type AccessTier = 'full' | 'lite';

export const AUTH_COOKIE = 'aicentre-auth';

/**
 * Resolve an access tier from a raw cookie value.
 * - undefined / empty            → null (not authenticated)
 * - 'authenticated' (legacy)     → 'full'
 * - 'full' | 'lite'              → as-is
 * - anything else                → null (unrecognised → treat as unauthenticated)
 */
export function tierFromCookieValue(value: string | undefined): AccessTier | null {
  if (!value) return null;
  if (value === 'authenticated' || value === 'full') return 'full';
  if (value === 'lite') return 'lite';
  return null;
}

/**
 * Minimal shape shared by NextRequest.cookies and next/headers cookies() —
 * both expose `.get(name)` returning `{ value } | undefined`.
 */
interface CookieStore {
  get(name: string): { value: string } | undefined;
}

/** Read the current access tier from a cookie store (null if unauthenticated). */
export function getAccessTier(cookies: CookieStore): AccessTier | null {
  return tierFromCookieValue(cookies.get(AUTH_COOKIE)?.value);
}

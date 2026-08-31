/**
 * Auth session helpers — read the access tier from the session cookie.
 *
 * The `aicentre-auth` cookie is set by middleware.ts after a valid signed-URL
 * redemption. Its value is a SIGNED scope (`<scope>.<hmac>`, see
 * hmac-auth.signScopeCookie) so it can't be edited client-side to escalate
 * lite → full. The legacy opaque value `'authenticated'` is treated as `full`
 * for backward-compat during rollout.
 *
 * Because verifying the signature is async (Web Crypto), the canonical reader
 * is `getAccessTier` (async) which delegates to hmacAuth.verifyScopeCookie.
 *
 * AIC2-157 — part of the Privacy & Sharing epic (AIC2-155).
 */

import { hmacAuth } from './hmac-auth';

export type AccessTier = 'full' | 'lite';

export const AUTH_COOKIE = 'aicentre-auth';

/**
 * Minimal shape shared by NextRequest.cookies and next/headers cookies() —
 * both expose `.get(name)` returning `{ value } | undefined`.
 */
interface CookieStore {
  get(name: string): { value: string } | undefined;
}

/**
 * Read + verify the current access tier from a cookie store.
 * Returns null when unauthenticated or when the cookie signature is invalid
 * (e.g. a tampered value), so a forged `full` cookie is rejected.
 */
export async function getAccessTier(cookies: CookieStore): Promise<AccessTier | null> {
  return hmacAuth.verifyScopeCookie(cookies.get(AUTH_COOKIE)?.value);
}

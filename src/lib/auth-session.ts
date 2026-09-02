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
 * Routes a lite (client) session may reach. Per the tier policy (AIC2-156):
 * the About home and the Experiences page only. Everything else is full-only.
 * Single source of truth for middleware, pages and APIs.
 */
export const LITE_ALLOWED_PATHS = ['/', '/experiences'] as const;

/** True if `pathname` is viewable by a lite session. */
export function isLitePathAllowed(pathname: string): boolean {
  return LITE_ALLOWED_PATHS.some(
    (p) => pathname === p || (p !== '/' && pathname.startsWith(`${p}/`)),
  );
}

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

/**
 * Server-side tier read for use in Server Components / layouts (via
 * next/headers cookies()). In development, middleware skips auth so there's no
 * cookie — default to `full` there so local dev sees the full experience.
 */
export async function getServerAccessTier(): Promise<AccessTier | null> {
  if (process.env.NODE_ENV === 'development') return 'full';
  const { cookies } = await import('next/headers');
  const store = await cookies();
  return hmacAuth.verifyScopeCookie(store.get(AUTH_COOKIE)?.value);
}

/**
 * Guard for full-tier-only API routes. Returns a 403 Response to return early
 * when the caller is not full-tier, or null to proceed. Content/agent APIs are
 * excluded from the middleware matcher, so lite sessions must be rejected here
 * rather than relying on the client not calling them.
 *
 * Dev bypass mirrors middleware (auth skipped locally).
 */
export async function requireFullTierApi(request: {
  cookies: CookieStore;
}): Promise<Response | null> {
  if (process.env.NODE_ENV === 'development') return null;
  const tier = await hmacAuth.verifyScopeCookie(request.cookies.get(AUTH_COOKIE)?.value);
  if (tier !== 'full') {
    return new Response(
      JSON.stringify({ error: 'Forbidden: full-tier access required.' }),
      { status: 403, headers: { 'content-type': 'application/json' } },
    );
  }
  return null;
}

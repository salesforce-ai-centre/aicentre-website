import { NextRequest, NextResponse } from 'next/server';
import { hmacAuth } from '@/lib/hmac-auth';
import { AUTH_COOKIE } from '@/lib/auth-session';

/**
 * Email-bound lite share links.
 *
 * A full-tier user enters a recipient's email; we mint a long-lived (30-day)
 * `lite` link bound to that address. The link points at `/claim-access` and
 * carries the HASHED email (`eh`) — never the plaintext — folded into the HMAC
 * signature. The recipient re-enters their email on the claim page; only a
 * match unlocks the lite session (see /api/auth/claim-lite-link).
 *
 * Like /api/auth/generate-signed-url this MUST require a full-tier session,
 * otherwise anyone could mint access. /api is excluded from the middleware
 * matcher, so the guard lives here.
 *
 * AIC2-... — part of the Privacy & Sharing epic (AIC2-155).
 */

/** Lite share links live for 30 days (tier policy, AIC2-156). */
const LITE_SHARE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Where email-bound recipients land to enter their email and claim access. */
const CLAIM_PATH = 'claim-access';

/** Pragmatic email shape check — real validation is the hash match on claim. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requireFullTier(request: NextRequest): Promise<NextResponse | null> {
  if (process.env.NODE_ENV !== 'production') return null;
  const tier = await hmacAuth.verifyScopeCookie(request.cookies.get(AUTH_COOKIE)?.value);
  if (tier !== 'full') {
    return NextResponse.json(
      { error: 'Forbidden: a full-tier session is required to share access.' },
      { status: 403 },
    );
  }
  return null;
}

export async function POST(request: NextRequest) {
  const denied = await requireFullTier(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const email: unknown = body?.email;

    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: 'A valid recipient email is required.' },
        { status: 400 },
      );
    }

    const baseUrl =
      (typeof body?.baseUrl === 'string' && body.baseUrl) ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const emailHash = await hmacAuth.hashEmail(email);
    const shareUrl = await hmacAuth.generateSignedUrl(CLAIM_PATH, baseUrl, {
      scope: 'lite',
      ttlMs: LITE_SHARE_TTL_MS,
      emailHash,
    });

    return NextResponse.json({
      shareUrl,
      expiresAt: new Date(Date.now() + LITE_SHARE_TTL_MS).toISOString(),
    });
  } catch (error) {
    console.error('Error generating lite share link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

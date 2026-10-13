import { NextRequest, NextResponse } from 'next/server';
import { hmacAuth } from '@/lib/hmac-auth';

/**
 * Redeem an email-bound lite share link.
 *
 * The recipient landed on /claim-access (excluded from the middleware matcher,
 * so no auth is required to reach it) carrying the signed link params, and
 * entered their email. Here we:
 *   1. verify the link signature (covers path/ts/scope/exp/email-hash), and
 *   2. confirm hash(entered email) === the link's `eh`.
 * Only then do we mint the signed `lite` scope cookie — mirroring the cookie
 * middleware.ts sets for a directly-redeemed link.
 *
 * AIC2-... — part of the Privacy & Sharing epic (AIC2-155).
 */

/** Lite sessions live 7 days, matching middleware.ts. */
const LITE_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** The signed path for a share link; must match share-lite-link's CLAIM_PATH. */
const CLAIM_PATH = 'claim-access';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ts, sig, scope, exp, eh } = body ?? {};

    if (typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Please enter your email.' }, { status: 400 });
    }
    if (typeof ts !== 'string' || typeof sig !== 'string' || typeof eh !== 'string') {
      return NextResponse.json({ error: 'This link is invalid.' }, { status: 400 });
    }

    // The link must be a valid, unexpired, email-bound lite link.
    const verification = await hmacAuth.verifySignature(
      CLAIM_PATH,
      ts,
      sig,
      typeof scope === 'string' ? scope : null,
      typeof exp === 'string' ? exp : null,
      eh,
    );

    if (!verification.valid) {
      const expired = verification.error === 'Link expired';
      return NextResponse.json(
        { error: expired ? 'This link has expired.' : 'This link is invalid.' },
        { status: expired ? 410 : 400 },
      );
    }

    // Bind check: the entered email must hash to the link's `eh`.
    const enteredHash = await hmacAuth.hashEmail(email);
    if (!hmacAuth.constantTimeEquals(enteredHash, eh)) {
      return NextResponse.json(
        { error: "That email doesn't match this invite. Please check and try again." },
        { status: 403 },
      );
    }

    // Success — mint the same signed lite cookie a direct redemption would.
    const cookieValue = await hmacAuth.signScopeCookie('lite');
    const response = NextResponse.json({ success: true });
    response.cookies.set('aicentre-auth', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: LITE_COOKIE_MAX_AGE_MS,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Error claiming lite share link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

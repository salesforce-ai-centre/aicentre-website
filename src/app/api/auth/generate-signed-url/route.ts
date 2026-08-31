import { NextRequest, NextResponse } from 'next/server';
import { hmacAuth } from '@/lib/hmac-auth';
import { AUTH_COOKIE } from '@/lib/auth-session';

/**
 * Signed-URL generation. This endpoint mints access links, so it MUST require
 * a full-tier session — otherwise anyone could generate access to the site.
 * (It sits under /api, which is excluded from the middleware matcher, so the
 * guard has to live here.)
 *
 * - Unauthenticated or lite-tier callers → 403.
 * - In development, middleware skips auth (no cookie), so we allow it locally
 *   to keep the dev flow working; production always requires full tier.
 *
 * AIC2-159 — part of the Privacy & Sharing epic (AIC2-155).
 */
async function requireFullTier(request: NextRequest): Promise<NextResponse | null> {
  if (process.env.NODE_ENV === 'development') return null;
  // Verify the SIGNED scope cookie (rejects tampered lite→full escalation).
  const tier = await hmacAuth.verifyScopeCookie(request.cookies.get(AUTH_COOKIE)?.value);
  if (tier !== 'full') {
    return NextResponse.json(
      { error: 'Forbidden: a full-tier session is required to generate links.' },
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
    const { path, baseUrl } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'Missing required parameter: path' },
        { status: 400 }
      );
    }

    // Use provided baseUrl or infer from request
    const effectiveBaseUrl = baseUrl || `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const signedUrl = await hmacAuth.generateSignedUrl(path, effectiveBaseUrl);

    return NextResponse.json({
      signedUrl,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const denied = await requireFullTier(request);
  if (denied) return denied;

  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json(
      { error: 'Missing required parameter: path' },
      { status: 400 }
    );
  }

  try {
    const baseUrl = searchParams.get('baseUrl') || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const signedUrl = await hmacAuth.generateSignedUrl(path, baseUrl);

    return NextResponse.json({
      signedUrl,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

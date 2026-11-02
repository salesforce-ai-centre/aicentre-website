import { NextRequest, NextResponse } from 'next/server';
import { hmacAuth } from '@/lib/hmac-auth';
import { isDevEnvironment } from '@/lib/env';
import type { AccessTier } from '@/lib/auth-session';

/**
 * Dev/staging-only tier switch. Lets DevTierToggle flip between `full` and
 * `lite` without going through a real signed link, so the lite experience
 * can be previewed on staging. 404s outside dev/staging so this never ships
 * a way to self-escalate in production.
 */
export async function POST(request: NextRequest) {
  if (!isDevEnvironment()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const tier: AccessTier = body?.tier === 'lite' ? 'lite' : 'full';

  const cookieValue = await hmacAuth.signScopeCookie(tier);
  const response = NextResponse.json({ tier });
  response.cookies.set('aicentre-auth', cookieValue, {
    httpOnly: true,
    secure: !isDevEnvironment(),
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });
  return response;
}

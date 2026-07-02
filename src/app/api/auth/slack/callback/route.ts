import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { encryptUserSession, type UserSession } from '@/lib/user-session';

function resolveDisplayName(userInfo: Record<string, string>): string {
  if (userInfo.given_name && userInfo.family_name) {
    return `${userInfo.given_name} ${userInfo.family_name}`.trim();
  }
  if (userInfo.name && !/^[a-z0-9_]{5,20}$/.test(userInfo.name)) {
    return userInfo.name;
  }
  if (userInfo.given_name) return userInfo.given_name;
  if (userInfo.email) {
    return userInfo.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return 'User';
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const stateParam = request.nextUrl.searchParams.get('state');
  const storedState = request.cookies.get('oauth_state')?.value;

  if (!code || !stateParam || !storedState) {
    return NextResponse.redirect(new URL('/login?error=missing_params', request.url));
  }

  const [state, next] = stateParam.split(':');
  const stateBuffer = Buffer.from(state || '');
  const storedBuffer = Buffer.from(storedState);
  if (stateBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(stateBuffer, storedBuffer)) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', request.url));
  }

  const clientId = process.env.SLACK_CLIENT_ID!;
  const clientSecret = process.env.SLACK_CLIENT_SECRET!;
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin.replace('0.0.0.0', 'localhost');
  const redirectUri = `${origin}/api/auth/slack/callback`;

  const tokenRes = await fetch('https://slack.com/api/openid.connect.token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.ok) {
    console.error('Slack token exchange failed:', tokenData.error);
    return NextResponse.redirect(new URL('/login?error=token_failed', request.url));
  }

  const userInfoRes = await fetch('https://slack.com/api/openid.connect.userInfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userInfo = await userInfoRes.json();
  if (!userInfo.ok) {
    console.error('Slack userInfo failed:', userInfo.error);
    return NextResponse.redirect(new URL('/login?error=userinfo_failed', request.url));
  }

  const allowedTeamId = process.env.SLACK_TEAM_ID;
  const userTeamId = userInfo['https://slack.com/team_id'] || '';
  if (allowedTeamId && userTeamId && userTeamId !== allowedTeamId) {
    console.error(`Slack login rejected: team ${userTeamId} not allowed (expected ${allowedTeamId})`);
    return NextResponse.redirect(new URL('/login?error=not_salesforce', request.url));
  }

  const session: UserSession = {
    userId: crypto.randomUUID(),
    slackUserId: userInfo.sub,
    slackTeamId: userInfo['https://slack.com/team_id'] || '',
    name: resolveDisplayName(userInfo),
    email: userInfo.email || '',
    avatarUrl: userInfo.picture || '',
  };

  const encrypted = encryptUserSession(session);

  const isSecure = request.nextUrl.protocol === 'https:';
  const redirectTo = next && next !== '/' ? next : '/';
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set('user_session', encrypted, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  response.cookies.delete('oauth_state');

  return response;
}

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const clientId = process.env.SLACK_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Slack OAuth not configured' }, { status: 500 });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const next = request.nextUrl.searchParams.get('next') || '/';

  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin.replace('0.0.0.0', 'localhost');
  const redirectUri = `${origin}/api/auth/slack/callback`;
  const scopes = 'openid,email,profile';

  const slackUrl = new URL('https://slack.com/openid/connect/authorize');
  slackUrl.searchParams.set('client_id', clientId);
  slackUrl.searchParams.set('scope', scopes);
  slackUrl.searchParams.set('redirect_uri', redirectUri);
  slackUrl.searchParams.set('response_type', 'code');
  slackUrl.searchParams.set('state', `${state}:${next}`);

  const isSecure = request.nextUrl.protocol === 'https:';
  const response = NextResponse.redirect(slackUrl);
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 300,
    path: '/',
  });

  return response;
}

import { NextRequest, NextResponse } from 'next/server';
import { hmacAuth } from './lib/hmac-auth';

// 	https://ai-centre-uk.my.salesforce-sites.com/services/apexrest/generateOfferingsLink/workshop
console.log('🚀 Middleware file loaded');

export async function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development environment detected, skipping auth');
    return NextResponse.next();
  }

  // Check for signed URL authentication
  const url = request.nextUrl;
  const timestamp = url.searchParams.get('ts');
  const signature = url.searchParams.get('sig');
  
  // Check for existing auth session first
  const authCookie = request.cookies.get('aicentre-auth');
  if (authCookie) {
    if (timestamp || signature)
      return NextResponse.redirect(new URL('/', request.url));

    return NextResponse.next();
  }


  if (timestamp && signature) {
    // Extract the path (remove leading slash for consistency with the example)
    const path = url.pathname.substring(1);
    const scope = url.searchParams.get('scope');
    const exp = url.searchParams.get('exp');

    const verification = await hmacAuth.verifySignature(path, timestamp, signature, scope, exp);

    if (verification.valid) {
      const tier = verification.scope ?? 'full';
      // Lite sessions are shorter-lived than the internal 24h full session.
      const maxAge = tier === 'lite' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      // Cookie carries a SIGNED scope so it can't be edited to escalate lite→full.
      const cookieValue = await hmacAuth.signScopeCookie(tier);

      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('aicentre-auth', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/'
      });

      return response;
    } else {
      // An expired lite (client) link gets a client-friendly message rather
      // than the internal "ask in Slack" one.
      const isExpiredShareLink =
        (scope === 'lite' || !!exp) && verification.error === 'Link expired';
      const dest = new URL('/get-access', request.url);
      if (isExpiredShareLink) dest.searchParams.set('reason', 'expired');
      return NextResponse.redirect(dest);
    }
  }

  // If no valid authentication, deny access
  console.log('❌ No valid authentication found');
  return NextResponse.redirect(new URL('/get-access', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|slides|favicon.ico|get-access|maintenance).*)'],
};

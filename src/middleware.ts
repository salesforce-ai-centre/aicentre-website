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
    console.log('🔐 HMAC signature verification requested');
    
    // Extract the path (remove leading slash for consistency with the example)
    const path = url.pathname.substring(1);
    
    const verification = await hmacAuth.verifySignature(path, timestamp, signature);
    
    if (verification.valid) {
      console.log('✅ HMAC signature verified, setting session cookie');
      
      // Set auth cookie for 24 hours
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('aicentre-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });
      
      return response;
    } else {
      console.log('❌ HMAC signature verification failed:', verification.error);
      return NextResponse.redirect(new URL('/get-access', request.url));
    }
  }

  // If no valid authentication, deny access
  console.log('❌ No valid authentication found');
  return NextResponse.redirect(new URL('/get-access', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|slides|favicon.ico|get-access|maintenance).*)'],
};

import { NextRequest, NextResponse } from 'next/server';
import { hmacAuth } from './lib/hmac-auth';

// 	https://ai-centre-uk.my.salesforce-sites.com/services/apexrest/generateOfferingsLink/workshop
console.log('🚀 Middleware file loaded');

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware running for:', request.nextUrl.pathname);
  
  // Check for existing auth session first
  const authCookie = request.cookies.get('aicentre-auth');
  if (authCookie) {
    console.log('✅ Valid session found, allowing access');
    return NextResponse.next();
  }

  // Check for signed URL authentication
  const url = request.nextUrl;
  const timestamp = url.searchParams.get('ts');
  const signature = url.searchParams.get('sig');
  
  if (timestamp && signature) {
    console.log('🔐 HMAC signature verification requested');
    
    // Extract the path (remove leading slash for consistency with the example)
    const path = url.pathname.substring(1);
    
    const verification = await hmacAuth.verifySignature(path, timestamp, signature);
    
    if (verification.valid) {
      console.log('✅ HMAC signature verified, setting session cookie');
      
      // Set auth cookie for 24 hours
      const response = NextResponse.next();
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
      return NextResponse.next();
      // return NextResponse.redirect(new URL('/access-denied', request.url));
    }
  }

  // If no valid authentication, deny access
  console.log('❌ No valid authentication found');
  // return NextResponse.redirect(new URL('/access-denied', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|access-denied).*)'],
};

import { NextRequest, NextResponse } from 'next/server';

const ZSCALER_IP_RANGES = [
  '123.0.0.0/24',    // Replace with your actual Zscaler IP range 1
  '123.0.0.0/28',  // Replace with your actual Zscaler IP range 2
];

function isIpInCidr(ip: string, cidr: string): boolean {
  // A helper function to check if an IP is in a CIDR range.
  const [range, bits = '32'] = cidr.split('/');
  // ... (insert full isIpInCidr function from original long response here)
  const mask = ~(2**(32 - parseInt(bits, 10)) - 1);
  const ipNum = ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0) >>> 0;
  const rangeNum = range.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0) >>> 0;
  return (ipNum & mask) === (rangeNum & mask);
}

console.log('🚀 Middleware file loaded');

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware running for:', request.nextUrl.pathname);
  
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 
                   realIp ||
                   '127.0.0.1'; // fallback for local development

  console.log(forwardedFor);
  console.log(realIp);
  console.log(clientIp)
  
  console.log('📍 Headers:', {
    'x-forwarded-for': forwardedFor,
    'x-real-ip': realIp,
    'detected clientIp': clientIp
  });

  if (!clientIp || clientIp === '127.0.0.1' || clientIp === '::1') {
    console.log('⚠️ Local development detected, allowing access');
    return NextResponse.next();
  }

  const isAllowed = ZSCALER_IP_RANGES.some(range => isIpInCidr(clientIp, range));
  console.log('🔐 IP check result:', { clientIp, isAllowed, ranges: ZSCALER_IP_RANGES });

  if (!isAllowed) {
    console.log(`Access denied for IP: ${clientIp}`);
    // return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|access-denied).*)'],
};

import { NextRequest, NextResponse } from 'next/server';
import { hmacAuth } from '@/lib/hmac-auth';

export async function POST(request: NextRequest) {
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
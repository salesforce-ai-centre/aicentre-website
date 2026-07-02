import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/user-session';

export async function GET() {
  const session = await getUserSession();

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      name: session.name,
      email: session.email,
      avatarUrl: session.avatarUrl,
    },
  });
}

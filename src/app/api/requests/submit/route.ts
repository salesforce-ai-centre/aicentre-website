import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/user-session';

export async function POST(request: NextRequest) {
  try {
    const session = await getUserSession();
    const data = await request.json();

    if (!data.accountName || !data.description || !data.intendedAudience || !data.attendees || !data.preferredDate1 || !data.startTime || !data.endTime) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const slackAppUrl = process.env.SLACK_APP_URL;
    const slackAppSecret = process.env.SLACK_APP_WEBHOOK_SECRET;

    if (!slackAppUrl || !slackAppSecret) {
      console.error('SLACK_APP_URL or SLACK_APP_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Service configuration error. Please contact the AI Centre team.' },
        { status: 500 }
      );
    }

    const response = await fetch(`${slackAppUrl}/api/requests/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${slackAppSecret}`,
      },
      body: JSON.stringify({
        ...data,
        submitterName: session?.name || 'Anonymous',
        submitterEmail: session?.email || '',
        submitterSlackId: session?.slackUserId || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Slack app ingest failed:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to submit request. Please try again.' },
        { status: 502 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
    });
  } catch (err: any) {
    console.error('Request submission error:', err);
    return NextResponse.json(
      { error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    );
  }
}

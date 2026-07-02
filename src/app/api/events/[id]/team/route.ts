import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import type { EventTeamMember } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const query = `SELECT Id, Contact__c, Contact__r.Name, Contact__r.Email, Contact__r.Slack_Profile_Image_192__c, Role__c, RSVP_Status__c, Attendance_Status__c FROM Event_Attendee__c WHERE Event__c = '${id}' AND Is_Guest__c = false ORDER BY Role__c, Contact__r.Name`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event team query failed:', errorText);
      return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
    }

    const data = await response.json();
    const team: EventTeamMember[] = (data.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      contactId: r.Contact__c,
      name: r.Contact__r?.Name || 'Unknown',
      email: r.Contact__r?.Email || null,
      role: r.Role__c || 'Team Member',
      rsvpStatus: r.RSVP_Status__c,
      attendanceStatus: r.Attendance_Status__c,
      avatarUrl: r.Contact__r?.Slack_Profile_Image_192__c || null,
    }));

    return NextResponse.json({ success: true, data: team });
  });
}

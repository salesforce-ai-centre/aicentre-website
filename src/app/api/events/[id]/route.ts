import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import type { EventDetail } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const query = `SELECT Id, Name, Status__c, Date__c, Start_DateTime__c, End_DateTime__c, Event_Type__c, Event_Tier__c, Description__c, Program__c, Industry__c, Requested_Account_Name__c, Slack_Channel_Link__c, Google_Slides_URL__c, Agenda__c, Logo_URL__c FROM Event__c WHERE Id = '${id}' LIMIT 1`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event detail query failed:', errorText);
      return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }

    const data = await response.json();
    if (!data.records || data.records.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const record = data.records[0];
    const event: EventDetail = {
      id: record.Id,
      name: record.Name,
      status: record.Status__c,
      date: record.Date__c,
      startDateTime: record.Start_DateTime__c,
      endDateTime: record.End_DateTime__c,
      eventType: record.Event_Type__c,
      tier: record.Event_Tier__c,
      description: record.Description__c,
      program: record.Program__c,
      host: null,
      industry: record.Industry__c,
      audienceType: null,
      totalAttendees: 0,
      checkedInCount: 0,
      slackChannelLink: record.Slack_Channel_Link__c,
      googleSlidesUrl: record.Google_Slides_URL__c,
      agendaId: record.Agenda__c,
      logoUrl: record.Logo_URL__c || null,
    };

    return NextResponse.json({ success: true, data: event });
  });
}

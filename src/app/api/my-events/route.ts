import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/user-session';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';

export async function GET() {
  const session = await getUserSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slackUserId = session.slackUserId;
  if (!slackUserId) {
    return NextResponse.json({ error: 'No Slack ID in session' }, { status: 400 });
  }

  try {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const query = `SELECT Event__c, Event__r.Name, Event__r.Date__c, Event__r.Start_DateTime__c, Event__r.End_DateTime__c, Event__r.Status__c, Event__r.Event_Type__c, Event__r.Program__c, Event__r.Requested_Account_Name__c, Event__r.Slack_Channel_Link__c, Role__c FROM Event_Attendee__c WHERE Contact__r.Slack_User_Id__c = '${slackUserId}' AND Is_Guest__c = false AND Event__r.Status__c NOT IN ('Cancelled', 'Rejected') ORDER BY Event__r.Start_DateTime__c DESC LIMIT 50`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Salesforce events query failed:', errorText);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    const data = await response.json();
    const events = (data.records || []).map((record: Record<string, any>) => ({
      id: record.Event__c,
      name: record.Event__r?.Name,
      date: record.Event__r?.Date__c,
      startDateTime: record.Event__r?.Start_DateTime__c,
      endDateTime: record.Event__r?.End_DateTime__c,
      status: record.Event__r?.Status__c,
      eventType: record.Event__r?.Event_Type__c,
      program: record.Event__r?.Program__c,
      account: record.Event__r?.Requested_Account_Name__c,
      space: null,
      slackChannelLink: record.Event__r?.Slack_Channel_Link__c,
      role: record.Role__c,
    }));

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { getUserSession } from './user-session';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from './salesforce-auth';

interface EventAuthResult {
  authorized: boolean;
  role?: string;
  attendeeId?: string;
}

const authCache = new LRUCache<string, EventAuthResult>({
  max: 500,
  ttl: 60 * 1000,
});

export async function verifyEventTeamMembership(
  eventId: string,
  slackUserId: string
): Promise<EventAuthResult> {
  const cacheKey = `event-auth:${eventId}:${slackUserId}`;
  const cached = authCache.get(cacheKey);
  if (cached) return cached;

  const accessToken = await getSalesforceAccessToken();
  const baseUrl = getSalesforceDomainUrl();

  const query = `SELECT Id, Role__c FROM Event_Attendee__c WHERE Event__c = '${eventId}' AND Contact__r.Slack_User_Id__c = '${slackUserId}' AND Is_Guest__c = false LIMIT 1`;
  const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    return { authorized: false };
  }

  const data = await response.json();
  if (!data.records || data.records.length === 0) {
    const result: EventAuthResult = { authorized: false };
    authCache.set(cacheKey, result);
    return result;
  }

  const record = data.records[0];
  const result: EventAuthResult = {
    authorized: true,
    role: record.Role__c,
    attendeeId: record.Id,
  };
  authCache.set(cacheKey, result);
  return result;
}

const SF_ID_PATTERN = /^[a-zA-Z0-9]{15,18}$/;

export function isValidSalesforceId(id: string): boolean {
  return SF_ID_PATTERN.test(id);
}

export async function withEventAuth(
  eventId: string,
  handler: (authContext: { role: string; attendeeId: string; slackUserId: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isValidSalesforceId(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  const auth = await verifyEventTeamMembership(eventId, session.slackUserId);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'You are not a team member on this event' }, { status: 403 });
  }

  return handler({
    role: auth.role!,
    attendeeId: auth.attendeeId!,
    slackUserId: session.slackUserId,
  });
}

import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import type { EventFeedback } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const query = `SELECT Id, Count_Responses__c, Average_Response__c FROM Feedback__c WHERE Event__c = '${id}'`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      // Object or fields may not exist — return empty gracefully
      return NextResponse.json({ success: true, data: [] });
    }

    const data = await response.json();
    const feedback: EventFeedback[] = (data.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      type: null,
      responseCount: r.Count_Responses__c || 0,
      averageRating: r.Average_Response__c,
      responses: [],
    }));

    return NextResponse.json({ success: true, data: feedback });
  });
}

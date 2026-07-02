import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const query = `SELECT Id, Name, Description__c, Duration__c, Category__c FROM Immersive_Experience__c WHERE Event__c = '${id}' ORDER BY Name`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      // Experiences may not have an Event__c field — return empty gracefully
      return NextResponse.json({ success: true, data: [] });
    }

    const data = await response.json();
    const experiences = (data.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      name: r.Name,
      description: r.Description__c,
      duration: r.Duration__c,
      category: r.Category__c,
    }));

    return NextResponse.json({ success: true, data: experiences });
  });
}

import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import type { EventAccount, EventOpportunity } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const [accountsRes, oppsRes] = await Promise.all([
      fetch(`${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(`SELECT Id, Account__c, Account__r.Name, Account__r.Industry, Is_Primary__c FROM Event_Account__c WHERE Event__c = '${id}' ORDER BY Is_Primary__c DESC`)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(`SELECT Id, Opportunity__c, Opportunity__r.Name, Opportunity_Amount__c, Opportunity__r.StageName, Opportunity__r.CloseDate FROM Event_Opportunity__c WHERE Event__c = '${id}'`)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    if (!accountsRes.ok || !oppsRes.ok) {
      console.error('Event accounts/opps query failed');
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }

    const [accountsData, oppsData] = await Promise.all([
      accountsRes.json(),
      oppsRes.json(),
    ]);

    const accounts: EventAccount[] = (accountsData.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      accountId: r.Account__c,
      accountName: r.Account__r?.Name || 'Unknown',
      isPrimary: r.Is_Primary__c || false,
      industry: r.Account__r?.Industry || null,
    }));

    const opportunities: EventOpportunity[] = (oppsData.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      opportunityId: r.Opportunity__c,
      opportunityName: r.Opportunity__r?.Name || 'Unknown',
      amount: r.Opportunity_Amount__c,
      stage: r.Opportunity__r?.StageName || null,
      closeDate: r.Opportunity__r?.CloseDate || null,
    }));

    return NextResponse.json({ success: true, data: { accounts, opportunities } });
  });
}

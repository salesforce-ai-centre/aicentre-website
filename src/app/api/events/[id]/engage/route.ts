import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import type { EngageData } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const [quizRes, huntRes] = await Promise.all([
      fetch(`${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(`SELECT Id, Name, (SELECT Id FROM Quiz_Participants__r) FROM Quiz__c WHERE Event__c = '${id}'`)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(`SELECT Id, Name, (SELECT Id FROM Hunt_Teams__r) FROM Hunt__c WHERE Event__c = '${id}'`)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    const engageData: EngageData = {
      quizResults: [],
      huntResults: [],
      wordCloudEntries: [],
    };

    if (quizRes.ok) {
      const quizData = await quizRes.json();
      engageData.quizResults = (quizData.records || []).map((r: Record<string, any>) => ({
        id: r.Id,
        quizName: r.Name,
        participantCount: r.Quiz_Participants__r?.totalSize || 0,
        averageScore: null,
      }));
    }

    if (huntRes.ok) {
      const huntData = await huntRes.json();
      engageData.huntResults = (huntData.records || []).map((r: Record<string, any>) => ({
        id: r.Id,
        huntName: r.Name,
        completionCount: r.Hunt_Teams__r?.totalSize || 0,
      }));
    }

    return NextResponse.json({ success: true, data: engageData });
  });
}

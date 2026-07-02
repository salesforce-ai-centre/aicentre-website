import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { getUserSession } from '@/lib/user-session';

export async function GET(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const soql = `SELECT Id, Name, Title, Email, Slack_Profile_Image_192__c FROM Contact WHERE Name LIKE '%${q.replace(/'/g, "\\'")}%' AND Email LIKE '%salesforce.com' ORDER BY Name LIMIT 10`;
    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(soql)}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();
    const results = (data.records || []).map((r: any) => ({
      id: r.Id,
      name: r.Name,
      title: r.Title || '',
      email: r.Email || '',
      photoUrl: r.Slack_Profile_Image_192__c || '',
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

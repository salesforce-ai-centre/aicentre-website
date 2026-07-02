import type { TeamMember } from '@/types/content';
import { NextResponse } from 'next/server';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { getUserSession } from '@/lib/user-session';
import teamMembersFallback from '../../../../content/team-members.json';

function transformContact(record: Record<string, any>): TeamMember {
  return {
    id: record.Id,
    name: record.Name,
    role: record.Title || '',
    imageUrl: record.FullPhotoUrl || record.SmallPhotoUrl || '',
  };
}

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const teamIds = process.env.TEAM_MEMBER_CONTACT_IDS;
  if (!teamIds) {
    return NextResponse.json({ success: true, data: teamMembersFallback });
  }

  const ids = teamIds.split(',').map(id => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({ success: true, data: teamMembersFallback });
  }

  try {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const idList = ids.map(id => `'${id}'`).join(',');
    const query = `SELECT Id, Name, Title, FullPhotoUrl, SmallPhotoUrl FROM Contact WHERE Id IN (${idList})`;
    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Salesforce team members request failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch team members from Salesforce' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const members: TeamMember[] = (data.records || []).map(transformContact);

    // Preserve the order from the env var
    const ordered = ids
      .map(id => members.find(m => m.id === id))
      .filter((m): m is TeamMember => m !== undefined);

    return NextResponse.json({ success: true, data: ordered });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import type { EventAgenda, AgendaItem } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    // First get the event's agenda ID
    const eventQuery = `SELECT Agenda__c FROM Event__c WHERE Id = '${id}' LIMIT 1`;
    const eventUrl = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(eventQuery)}`;
    const eventRes = await fetch(eventUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!eventRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }

    const eventData = await eventRes.json();
    const agendaId = eventData.records?.[0]?.Agenda__c;

    if (!agendaId) {
      return NextResponse.json({ success: true, data: null });
    }

    // Fetch agenda and items in parallel
    const [agendaRes, itemsRes] = await Promise.all([
      fetch(`${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(`SELECT Id, Name FROM Agenda__c WHERE Id = '${agendaId}' LIMIT 1`)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(`SELECT Id, Name, Start_Time__c, End_Time__c, Duration__c, Speaker__c, Description__c, Sort_Order__c FROM Agenda_Item__c WHERE Agenda__c = '${agendaId}' ORDER BY Sort_Order__c ASC`)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    if (!agendaRes.ok || !itemsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch agenda' }, { status: 500 });
    }

    const agendaData = await agendaRes.json();
    const itemsData = await itemsRes.json();

    const agendaRecord = agendaData.records?.[0];
    if (!agendaRecord) {
      return NextResponse.json({ success: true, data: null });
    }

    const items: AgendaItem[] = (itemsData.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      title: r.Name,
      startTime: r.Start_Time__c,
      endTime: r.End_Time__c,
      duration: r.Duration__c,
      speaker: r.Speaker__c,
      description: r.Description__c,
      sortOrder: r.Sort_Order__c || 0,
    }));

    const agenda: EventAgenda = {
      id: agendaRecord.Id,
      name: agendaRecord.Name,
      items,
    };

    return NextResponse.json({ success: true, data: agenda });
  });
}

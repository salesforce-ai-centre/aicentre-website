import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { createSalesforceRecord } from '@/lib/salesforce-mutations';
import { createNoteSchema } from '@/lib/validation/events';
import type { EventNote } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const query = `SELECT Id, Title__c, Body__c, Type__c, CreatedDate, LastModifiedDate, CreatedBy.Name FROM Event_Note__c WHERE Event__c = '${id}' ORDER BY CreatedDate DESC`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event notes query failed:', errorText);
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }

    const data = await response.json();
    const notes: EventNote[] = (data.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      title: r.Title__c,
      body: r.Body__c || '',
      type: r.Type__c,
      createdDate: r.CreatedDate,
      lastModifiedDate: r.LastModifiedDate,
      createdBy: r.CreatedBy?.Name || null,
    }));

    return NextResponse.json({ success: true, data: notes });
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const body = await request.json();
    const parsed = createNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const fields: Record<string, unknown> = {
      Event__c: id,
      Body__c: parsed.data.body,
    };
    if (parsed.data.title) fields.Title__c = parsed.data.title;
    if (parsed.data.type) fields.Type__c = parsed.data.type;

    try {
      const result = await createSalesforceRecord('Event_Note__c', fields);
      return NextResponse.json({ success: true, data: { id: result.id } }, { status: 201 });
    } catch (error) {
      console.error('Failed to create note:', error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
  });
}

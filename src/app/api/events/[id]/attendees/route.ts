import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { createSalesforceRecord } from '@/lib/salesforce-mutations';
import { addAttendeeSchema } from '@/lib/validation/events';
import type { EventAttendee } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const query = `SELECT Id, Contact__c, Contact__r.Name, Contact__r.Account.Name, Role__c, RSVP_Status__c, Attendance_Status__c, Check_In_Time__c, Check_Out_Time__c FROM Event_Attendee__c WHERE Event__c = '${id}' AND Is_Guest__c = true ORDER BY Contact__r.Name`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event attendees query failed:', errorText);
      return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
    }

    const data = await response.json();
    const attendees: EventAttendee[] = (data.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      contactId: r.Contact__c,
      name: r.Contact__r?.Name || 'Unknown',
      company: r.Contact__r?.Account?.Name || null,
      role: r.Role__c,
      rsvpStatus: r.RSVP_Status__c,
      attendanceStatus: r.Attendance_Status__c,
      checkInTime: r.Check_In_Time__c,
      checkOutTime: r.Check_Out_Time__c,
    }));

    return NextResponse.json({ success: true, data: attendees });
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const body = await request.json();
    const parsed = addAttendeeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { contactId, role, rsvpStatus } = parsed.data;
    const fields: Record<string, unknown> = {
      Event__c: id,
      Contact__c: contactId,
      Is_Guest__c: true,
    };
    if (role) fields.Role__c = role;
    if (rsvpStatus) fields.RSVP_Status__c = rsvpStatus;

    try {
      const result = await createSalesforceRecord('Event_Attendee__c', fields);
      return NextResponse.json({ success: true, data: { id: result.id } }, { status: 201 });
    } catch (error) {
      console.error('Failed to create attendee:', error);
      return NextResponse.json({ error: 'Failed to add attendee' }, { status: 500 });
    }
  });
}

import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { updateSalesforceRecord } from '@/lib/salesforce-mutations';
import { updateAttendeeSchema } from '@/lib/validation/events';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  const { id, attendeeId } = await params;

  return withEventAuth(id, async () => {
    const body = await request.json();
    const parsed = updateAttendeeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const fields: Record<string, unknown> = {};
    if (parsed.data.rsvpStatus) fields.RSVP_Status__c = parsed.data.rsvpStatus;
    if (parsed.data.attendanceStatus) fields.Attendance_Status__c = parsed.data.attendanceStatus;

    try {
      await updateSalesforceRecord('Event_Attendee__c', attendeeId, fields);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Failed to update attendee:', error);
      return NextResponse.json({ error: 'Failed to update attendee' }, { status: 500 });
    }
  });
}

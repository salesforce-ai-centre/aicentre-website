import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { updateSalesforceRecord, deleteSalesforceRecord } from '@/lib/salesforce-mutations';
import { updateNoteSchema } from '@/lib/validation/events';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const { id, noteId } = await params;

  return withEventAuth(id, async () => {
    const body = await request.json();
    const parsed = updateNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const fields: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) fields.Title__c = parsed.data.title;
    if (parsed.data.body !== undefined) fields.Body__c = parsed.data.body;
    if (parsed.data.type !== undefined) fields.Type__c = parsed.data.type;

    try {
      await updateSalesforceRecord('Event_Note__c', noteId, fields);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Failed to update note:', error);
      return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const { id, noteId } = await params;

  return withEventAuth(id, async () => {
    try {
      await deleteSalesforceRecord('Event_Note__c', noteId);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Failed to delete note:', error);
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
  });
}

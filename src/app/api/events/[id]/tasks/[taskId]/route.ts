import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { updateSalesforceRecord } from '@/lib/salesforce-mutations';
import { updateTaskSchema } from '@/lib/validation/events';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;

  return withEventAuth(id, async () => {
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const fields: Record<string, unknown> = {};
    if (parsed.data.status) fields.Status__c = parsed.data.status;
    if (parsed.data.title) fields.Name = parsed.data.title;
    if (parsed.data.description !== undefined) fields.Description__c = parsed.data.description;
    if (parsed.data.assignee) fields.Assigned_To__c = parsed.data.assignee;
    if (parsed.data.dueDate) fields.Due_Date__c = parsed.data.dueDate;

    try {
      await updateSalesforceRecord('Event_Task__c', taskId, fields);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Failed to update task:', error);
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
  });
}

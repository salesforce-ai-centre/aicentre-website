import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { createSalesforceRecord } from '@/lib/salesforce-mutations';
import { createTaskSchema } from '@/lib/validation/events';
import type { EventTask } from '@/types/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    // Try Task__c first (standard custom task object), fall back gracefully
    const query = `SELECT Id, Name, Description__c, Status__c, Assigned_To__r.Name, Due_Date__c, Priority__c FROM Task__c WHERE Event__c = '${id}' ORDER BY Due_Date__c ASC NULLS LAST`;

    const url = `${baseUrl}/services/data/v64.0/query?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      // Object may not exist in this org — return empty list
      return NextResponse.json({ success: true, data: [] });
    }

    const data = await response.json();
    const tasks: EventTask[] = (data.records || []).map((r: Record<string, any>) => ({
      id: r.Id,
      title: r.Name,
      description: r.Description__c || null,
      status: r.Status__c || 'Not Started',
      assignee: r.Assigned_To__r?.Name || null,
      dueDate: r.Due_Date__c || null,
      priority: r.Priority__c || null,
    }));

    return NextResponse.json({ success: true, data: tasks });
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const fields: Record<string, unknown> = {
      Event__c: id,
      Name: parsed.data.title,
      Status__c: 'Not Started',
    };
    if (parsed.data.description) fields.Description__c = parsed.data.description;
    if (parsed.data.assignee) fields.Assigned_To__c = parsed.data.assignee;
    if (parsed.data.dueDate) fields.Due_Date__c = parsed.data.dueDate;
    if (parsed.data.priority) fields.Priority__c = parsed.data.priority;

    try {
      const result = await createSalesforceRecord('Event_Task__c', fields);
      return NextResponse.json({ success: true, data: { id: result.id } }, { status: 201 });
    } catch (error) {
      console.error('Failed to create task:', error);
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
  });
}

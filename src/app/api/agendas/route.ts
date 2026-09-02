import type { AgendaItem } from '@/types/content';
import { NextResponse, type NextRequest } from 'next/server';
import { getChildRecords } from '@/lib/salesforce-request';
import { format } from 'date-fns';
import { createSalesforceRoute } from '@/lib/salesforce-route';

const transformAgenda = (object: Record<string, any>): AgendaItem => {
  const timeString = object["Display_Start_Time__c"];
  const [hours, minutes] = timeString?.split(':') || [null, null];
  const time = new Date();
  time.setHours(parseInt(hours, 10));
  time.setMinutes(parseInt(minutes, 10));

  return {
    id: object["Id"],
    title: object["Name"],
    time: (!hours && !minutes) ? "" : format(time, 'h:mm a'),
    type: object["Type__c"]
  }
};

export const GET = createSalesforceRoute<AgendaItem>({
  label: 'agendas',
  // Requires an `id` query param identifying the parent agenda.
  validate: (request) => {
    const id = new URL(request.url).searchParams.get('id');
    return id
      ? null
      : NextResponse.json({ error: 'Missing required id parameter' }, { status: 400 });
  },
  fetcher: (request) => {
    const id = new URL(request.url).searchParams.get('id') as string;
    return getChildRecords("Agenda_Item__c", id, "Agenda__c", 20, false, "ORDER+BY+Display_Start_Time__c+ASC");
  },
  transform: transformAgenda,
  // Items without a time sort last.
  postProcess: (items) =>
    items.sort((a, b) => {
      if (a.time === "" && b.time !== "") return 1;
      if (a.time !== "" && b.time === "") return -1;
      return 0;
    }),
});

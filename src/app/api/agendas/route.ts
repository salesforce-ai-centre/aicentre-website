import type { AgendaItem } from '@/types/content';
import { NextResponse, NextRequest } from 'next/server';
import { getChildRecords } from '@/lib/salesforce-request';
import { parse, format } from 'date-fns';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required id parameter' },
        { status: 400 }
      );
    }
 
    const objects = await getChildRecords("Agenda_Item__c", id, "Agenda__c", 20, false, "ORDER+BY+Display_Start_Time__c+ASC");
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedAgenda: AgendaItem[] = objects.map(transformAgenda);
    
    // Sort so items without time come last
    const sortedAgenda = transforedAgenda.sort((a, b) => {
      if (a.time === "" && b.time !== "") return 1;
      if (a.time !== "" && b.time === "") return -1;
      return 0;
    });
    
    return NextResponse.json({
      success: true,
      data: sortedAgenda,
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

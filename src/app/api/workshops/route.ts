import type { Workshop } from '@/types/content';
import { NextResponse } from 'next/server';
import { getAllRecords } from '@/lib/salesforce-request';

const transformWorkshop = (object: Record<string, any>): Workshop => ({
  id: object["Name"],
  title: object["Title__c"],
  description: object["Small_description__c"],
  tags: object["Filters__c"].split(";"),
  audienceSize: object["Audience_Size__c"],
  duration: object["Duration__c"],
  category: object["Category__c"],
  whatYoullLearn: object["What_Youll_Learn__c"]?.split("\n"),
  agendaId: object["Agenda__c"]
});

export async function GET() {
  try {
    const objects = await getAllRecords("Engagement_Tools__c", 20, true);
console.log(objects[0]);
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedWorkshops: Workshop[] = objects.map(transformWorkshop);
    return NextResponse.json({
      success: true,
      data: transforedWorkshops,
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
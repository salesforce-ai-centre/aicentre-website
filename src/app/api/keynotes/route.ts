import type { Keynote } from '@/types/content';
import { NextResponse } from 'next/server';
import { getAllRecords } from '@/lib/salesforce-request';

const transformKeynote = (object: Record<string, any>): Keynote => ({
  id: object["Name"],
  title: object["Title__c"],
  description: object["Description__c"],
  presenter: object["Presenter__c"],
  presenterRole: object["Presenter_Role__c"],
  duration: object["Duration__c"],
  audienceSize: object["Audience_Size__c"],
  topics: object["Topics__c"].split(";"),
  focusArea: object["Focus_Area__c"],
  audience: object["Audience__c"].replace(";", ", ")
});

export async function GET() {
  try {
    const objects = await getAllRecords("Executive_Keynote__c");
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedKeynotes: Keynote[] = objects.map(transformKeynote);
    return NextResponse.json({
      success: true,
      data: transforedKeynotes,
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import type { Experience } from '@/types/content';
import { NextResponse } from 'next/server';
import { getSortedRecords } from '@/lib/salesforce-request';

const transformExperience = (object: Record<string, any>): Experience => ({
  id: object["Name"],
  title: object["Title__c"],
  description: object["Description__c"],
  type: object["Type__c"].toLowerCase(),
  duration: object["Duration__c"],
  audienceSize: object["Audience_Size__c"],
  tags: object["Tags__c"].split(";"),
  category: object["Status__c"]
});

export async function GET() {
  try {
    const objects = await getSortedRecords("Immersive_Experience__c", 20, true, "ORDER+BY+Status__c+ASC");
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedExperiences: Experience[] = objects.map(transformExperience);
    return NextResponse.json({
      success: true,
      data: transforedExperiences,
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
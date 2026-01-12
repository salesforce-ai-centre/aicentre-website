import type { Space } from '@/types/content';
import { NextResponse } from 'next/server';
import { getSortedRecords } from '@/lib/salesforce-request';

const transformSpace = (object: Record<string, any>): Space => ({
  id: object["Id"],
  name: object["Name"],
  description: object["Description__c"],
  imageUrl: object["Image_URL__c"],
  capacity: object["Capacity__c"],
  status: object["Status__c"]
});

export async function GET() {
  try {
    const objects = await getSortedRecords("Space__c", 20, false, "ORDER+BY+CreatedDate+ASC");
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedSpaces: Space[] = objects.map(transformSpace);
    return NextResponse.json({
      success: true,
      data: transforedSpaces.filter(space => space.status === 'Active'),
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
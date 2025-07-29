import type { Space } from '@/types/content';
import { NextResponse } from 'next/server';
import { getAllRecords } from '@/lib/salesforce-request';

const transformSpace = (object: Record<string, any>): Space => ({
  id: object["Id"],
  name: object["Name"],
  description: object["Description__c"],
  imageUrl: object["Image_URL__c"],
  capacity: object["Capacity__c"]
});

export async function GET() {
  try {
    const objects = await getAllRecords("Space__c", 20, false);
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedSpaces: Space[] = objects.map(transformSpace);
    return NextResponse.json({
      success: true,
      data: transforedSpaces,
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
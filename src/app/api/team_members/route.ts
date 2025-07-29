import type { TeamMember } from '@/types/content';
import { NextResponse } from 'next/server';
import { getSortedRecords } from '@/lib/salesforce-request';

const transformTeamMember = (object: Record<string, any>): TeamMember => ({
  id: object["Id"],
  name: object["Name"],
  description: object["Small_description__c"],
  imageUrl: object["Image_URL__c"],
  role: object["Role__c"]
});

export async function GET() {
  try {
    const objects = await getSortedRecords("AI_Team_Member__c", 20, false, "ORDER+BY+Priority__c+ASC");
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedTeamMembers: TeamMember[] = objects.map(transformTeamMember);
    return NextResponse.json({
      success: true,
      data: transforedTeamMembers,
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
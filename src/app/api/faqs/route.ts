import type { FAQ } from '@/types/content';
import { NextResponse } from 'next/server';
import { getAllRecords } from '@/lib/salesforce-request';

const transformFaq = (object: Record<string, any>): FAQ => ({
  id: object["Name"],
  question: object["Question__c"],
  answer: object["Answer__c"],
  category: object["Category__c"].toLowerCase()
});

export async function GET() {
  try {
    const objects = await getAllRecords("Frequently_Asked_Question__c");
    if (!objects) {
      return NextResponse.json(
        { error: 'No objects found' },
        { status: 500 }
      );
    }
    const transforedFaqs: FAQ[] = objects.map(transformFaq);
    return NextResponse.json({
      success: true,
      data: transforedFaqs,
    });
  } catch (error: any) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
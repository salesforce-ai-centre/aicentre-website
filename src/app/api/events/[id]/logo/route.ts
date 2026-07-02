import { NextResponse } from 'next/server';
import { withEventAuth } from '@/lib/event-auth';
import { getSalesforceAccessToken, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { updateSalesforceRecord } from '@/lib/salesforce-mutations';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: PNG, JPG, GIF, SVG' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Body = Buffer.from(arrayBuffer).toString('base64');

    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceDomainUrl();

    const sfResponse = await fetch(`${baseUrl}/services/apexrest/mesh/images/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recordId: id,
        fileName: file.name,
        base64Body,
        folder: 'ai-centre-event-logos',
      }),
    });

    if (!sfResponse.ok) {
      const errorText = await sfResponse.text();
      console.error('Salesforce image upload failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    const result = await sfResponse.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { logoUrl: result.data.imageUrl },
    });
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withEventAuth(id, async () => {
    await updateSalesforceRecord('Event__c', id, {
      Logo_URL__c: null,
      Logo_Public_Id__c: null,
      Logo_Image__c: null,
    });

    return NextResponse.json({ success: true });
  });
}

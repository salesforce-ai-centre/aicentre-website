import { NextResponse } from 'next/server';
import { getSalesforceAccessToken, getSalesforceBaseUrl, getSalesforceAgentId, getSalesforceDomainUrl } from '@/lib/salesforce-auth';
import { randomUUID } from 'crypto';

export async function POST() {
  try {
    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceBaseUrl();
    const domainUrl = getSalesforceDomainUrl();
    const agentId = getSalesforceAgentId();
    const externalSessionKey = randomUUID();

    const sessionUrl = `${baseUrl}/einstein/ai-agent/v1/agents/${agentId}/sessions`;
    
    const response = await fetch(sessionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        externalSessionKey: externalSessionKey,
        instanceConfig: {
          endpoint: domainUrl
        },
        streamingCapabilities: {
          chunkTypes: ["Text"]
        },
        bypassUser: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Salesforce session creation failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to create agent session' },
        { status: response.status }
      );
    }

    const sessionData = await response.json();
    
    return NextResponse.json({
      sessionId: sessionData.sessionId,
      success: true,
      data: sessionData,
    });

  } catch (error) {
    console.error('Error creating agent session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
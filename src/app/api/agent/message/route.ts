import { NextRequest } from 'next/server';
import { getSalesforceAccessToken, getSalesforceBaseUrl, getSalesforceAgentId } from '@/lib/salesforce-auth';

interface MessageRequest {
  sessionId: string;
  message: string;
  sequenceId: number;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, sequenceId }: MessageRequest = await request.json();
    
    if (!sessionId || !message || sequenceId === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: sessionId, message, sequenceId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceBaseUrl();
    const agentId = getSalesforceAgentId();

    const messageUrl = `${baseUrl}/services/einstein/platform/v1/agents/${agentId}/sessions/${sessionId}/messages/stream`;
    
    const response = await fetch(messageUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        message: message,
        sequenceId: sequenceId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Salesforce message failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send message to agent' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a ReadableStream to forward the SSE response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error('No response body'));
          return;
        }

        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }
            
            // Forward the chunk as-is for SSE
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('Stream reading error:', error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error in message endpoint:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
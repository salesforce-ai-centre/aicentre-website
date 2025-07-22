import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceAccessToken, getSalesforceBaseUrl } from '@/lib/salesforce-auth';

interface MessageRequest {
  sessionId: string;
  message: string;
  sequenceId?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, sequenceId = 1 }: MessageRequest = await request.json();
    
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, message' },
        { status: 400 }
      );
    }

    const accessToken = await getSalesforceAccessToken();
    const baseUrl = getSalesforceBaseUrl();

    // Use the new API endpoint
    const messageUrl = `${baseUrl}/einstein/ai-agent/v1/sessions/${sessionId}/messages/stream`;
    
    const response = await fetch(messageUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        message: {
          sequenceId: sequenceId,
          type: "Text",
          text: message
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Salesforce message failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to send message to agent' },
        { status: response.status }
      );
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: 'No response body' },
        { status: 500 }
      );
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.message) {
                if (data.message.type === 'TextChunk' && data.message.message) {
                  fullResponse += data.message.message;
                } else if (data.message.type === 'Inform' && data.message.message) {
                  // Use the final complete message if available
                  fullResponse = data.message.message;
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    return NextResponse.json({
      success: true,
      response: {
        messages: [{
          role: 'assistant',
          content: fullResponse || 'I received your message but had trouble generating a response.'
        }]
      },
    });

  } catch (error) {
    console.error('Error in sync message endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
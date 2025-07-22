interface TokenResponse {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

let tokenCache: CachedToken | null = null;

export async function getSalesforceAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const domain = process.env.SALESFORCE_DOMAIN;

  if (!clientId || !clientSecret || !domain) {
    throw new Error('Missing Salesforce configuration. Please check environment variables.');
  }

  const tokenUrl = `https://${domain}/services/oauth2/token`;
  
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
    }

    const tokenData: TokenResponse = await response.json();
    
    tokenCache = {
      token: tokenData.access_token,
      expiresAt: Date.now() + (25 * 60 * 1000), // 25 minutes (tokens expire at 30min)
    };

    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting Salesforce access token:', error);
    throw new Error('Failed to authenticate with Salesforce');
  }
}

export function getSalesforceBaseUrl(): string {
  return 'https://api.salesforce.com';
}

export function getSalesforceDomainUrl(): string {
  const domain = process.env.SALESFORCE_DOMAIN;
  if (!domain) {
    throw new Error('SALESFORCE_DOMAIN environment variable is required');
  }
  return `https://${domain}`;
}

export function getSalesforceAgentId(): string {
  const agentId = process.env.SALESFORCE_AGENT_ID;
  if (!agentId) {
    throw new Error('SALESFORCE_AGENT_ID environment variable is required');
  }
  return agentId;
}
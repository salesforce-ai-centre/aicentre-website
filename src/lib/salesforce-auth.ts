import { LRUCache } from 'lru-cache';

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

// LRU Cache for production - persists across requests in production
const lruCache = new LRUCache<string, CachedToken>({
  max: 100, // Maximum number of items
  ttl: 120 * 60 * 1000, // 25 minutes TTL
  updateAgeOnGet: false,
  updateAgeOnHas: false,
});

// Global cache for development - persists during dev server runtime
declare global {
  var salesforceTokenCache: CachedToken | null;
}

// Initialize global cache in development
if (process.env.NODE_ENV === 'development') {
  global.salesforceTokenCache = global.salesforceTokenCache || null;
}

export async function getSalesforceAccessToken(): Promise<string> {
  const cacheKey = 'salesforce-token';
  
  // Check development cache first (if in development mode)
  if (process.env.NODE_ENV === 'development') {
    if (global.salesforceTokenCache && Date.now() < global.salesforceTokenCache.expiresAt) {
      console.log('Using cached token from global cache (dev)');
      return global.salesforceTokenCache.token;
    }
  }
  
  // Check LRU cache for production
  const cachedToken = lruCache.get(cacheKey);
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    console.log('Using cached token from LRU cache');
    return cachedToken.token;
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
    
    const newCachedToken: CachedToken = {
      token: tokenData.access_token,
      expiresAt: Date.now() + (25 * 60 * 1000), // 25 minutes (tokens expire at 30min)
    };
    
    // Store in both caches
    lruCache.set(cacheKey, newCachedToken);
    
    if (process.env.NODE_ENV === 'development') {
      global.salesforceTokenCache = newCachedToken;
    }
    
    console.log('New token fetched and cached');
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
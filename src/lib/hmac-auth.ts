
export interface SignatureVerificationResult {
  valid: boolean;
  error?: string;
}

export class HMACAuthenticator {
  private readonly secret: string;
  private readonly timeoutMs: number;

  constructor(secret?: string, timeoutMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.secret = secret || process.env.SIGNED_URL_SECRET || 'defaultsharedsecret';
    this.timeoutMs = timeoutMs;
  }

  /**
   * Generates a signed URL with timestamp and signature
   * @param path - The path/resource identifier (e.g., wheel ID)
   * @param baseUrl - Base URL of the application
   * @returns Complete signed URL
   */
  async generateSignedUrl(path: string, baseUrl: string): Promise<string> {
    const timestamp = Date.now();
    const signature = await this.generateSignature(path, timestamp);
    
    const url = new URL(`/${encodeURIComponent(path)}`, baseUrl);
    url.searchParams.set('ts', timestamp.toString());
    url.searchParams.set('sig', signature);
    
    return url.toString();
  }

  /**
   * Generates HMAC signature for a given path and timestamp
   * @param path - The resource path/identifier
   * @param timestamp - Unix timestamp in milliseconds
   * @returns Hex-encoded HMAC signature
   */
  async generateSignature(path: string, timestamp: number): Promise<string> {
    const message = `${path}:${timestamp}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Verifies a signed request using HMAC signature and timestamp
   * @param path - The resource path/identifier from the URL
   * @param timestamp - Timestamp from query parameter
   * @param signature - Signature from query parameter
   * @returns Verification result with validity and optional error message
   */
  async verifySignature(path: string, timestamp: string, signature: string): Promise<SignatureVerificationResult> {
    // Check if timestamp and signature are provided
    if (!timestamp || !signature) {
      return { valid: false, error: 'Missing signature or timestamp' };
    }

    // Parse and validate timestamp
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) {
      return { valid: false, error: 'Invalid timestamp format' };
    }

    // Check timestamp freshness (within allowed window)
    const now = Date.now();
    if (Math.abs(now - ts) > this.timeoutMs) {
      return { valid: false, error: 'Timestamp expired or invalid' };
    }

    // Generate expected signature
    const expectedSignature = await this.generateSignature(path, ts);
    
    // Compare signatures using timing-safe comparison
    if (!this.constantTimeStringCompare(signature, expectedSignature)) {
      return { valid: false, error: 'Invalid signature' };
    }

    return { valid: true };
  }

  /**
   * Timing-safe string comparison to prevent timing attacks
   * @param a - First string
   * @param b - Second string
   * @returns True if strings are equal
   */
  private constantTimeStringCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}

// Export a default instance for convenience
export const hmacAuth = new HMACAuthenticator();
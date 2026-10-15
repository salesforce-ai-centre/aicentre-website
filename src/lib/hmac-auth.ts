
import type { AccessTier } from './auth-session';

export interface SignatureVerificationResult {
  valid: boolean;
  /** Access tier the verified link grants (full for legacy links). */
  scope?: AccessTier;
  error?: string;
}

/** Options embedded in a scoped signed URL. */
interface SignedUrlOptions {
  /** Access tier the link grants. Defaults to 'full' (legacy behaviour). */
  scope?: AccessTier;
  /** Absolute link lifetime in ms. Overrides the freshness window when set —
   *  used for long-lived client (lite) share links (AIC2-158). */
  ttlMs?: number;
  /** Hashed recipient email (see `hashEmail`). When set, the link is bound to
   *  that address: the recipient must re-enter their email on redemption. Used
   *  for the email-share flow — the hash is folded into the signed message so
   *  the binding can't be stripped or swapped client-side. */
  emailHash?: string;
}

export class HMACAuthenticator {
  private readonly secret: string;
  private readonly timeoutMs: number;

  constructor(secret?: string, timeoutMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.secret = secret || process.env.SIGNED_URL_SECRET || 'defaultsharedsecret';
    this.timeoutMs = timeoutMs;
  }

  /**
   * Generates a signed URL. By default this is a short-lived, full-access link
   * (unchanged legacy behaviour). Pass `scope` / `ttlMs` for a scoped link
   * (e.g. a long-lived `lite` client share link).
   *
   * @param path - The path/resource identifier
   * @param baseUrl - Base URL of the application
   * @param options - scope + ttl for scoped links
   */
  async generateSignedUrl(
    path: string,
    baseUrl: string,
    options: SignedUrlOptions = {},
  ): Promise<string> {
    const timestamp = Date.now();
    const scope: AccessTier = options.scope ?? 'full';
    // expiresAt: 0 means "use the freshness window" (legacy short-lived link).
    const expiresAt = options.ttlMs ? timestamp + options.ttlMs : 0;
    const emailHash = options.emailHash ?? '';
    const signature = await this.generateSignature(path, timestamp, scope, expiresAt, emailHash);

    const url = new URL(`/${encodeURIComponent(path)}`, baseUrl);
    url.searchParams.set('ts', timestamp.toString());
    url.searchParams.set('sig', signature);
    // Only add scope/expiry params when this is a scoped link, so legacy
    // full-access links stay byte-for-byte identical.
    if (scope !== 'full' || expiresAt) {
      url.searchParams.set('scope', scope);
      if (expiresAt) url.searchParams.set('exp', expiresAt.toString());
    }
    // Email-bound share links carry the recipient's hashed address as `eh`.
    if (emailHash) url.searchParams.set('eh', emailHash);

    return url.toString();
  }

  /**
   * HMAC signature over the signed message. Legacy links signed only
   * `path:timestamp`; scoped links sign `path:timestamp:scope:expiresAt`.
   * When scope is 'full' and expiresAt is 0 we sign the legacy message so old
   * links continue to verify. Email-bound share links append the recipient's
   * hashed email so it can't be stripped/swapped without breaking the sig.
   */
  async generateSignature(
    path: string,
    timestamp: number,
    scope: AccessTier = 'full',
    expiresAt: number = 0,
    emailHash: string = '',
  ): Promise<string> {
    const base =
      scope === 'full' && expiresAt === 0
        ? `${path}:${timestamp}`
        : `${path}:${timestamp}:${scope}:${expiresAt}`;
    const message = emailHash ? `${base}:${emailHash}` : base;
    return this.hmac(message);
  }

  /**
   * Deterministic HMAC of a normalised email, hex-encoded. Used to bind a lite
   * share link to a recipient without putting their address in the URL: the
   * link carries this hash, and on redemption the recipient re-enters their
   * email which we hash and compare. Because it's keyed by SIGNED_URL_SECRET,
   * a plain email→hash dictionary attack isn't possible without the secret.
   */
  async hashEmail(email: string): Promise<string> {
    return this.hmac(`email:${this.normaliseEmail(email)}`);
  }

  /** Lower-cased, trimmed email so casing/whitespace don't change the hash. */
  private normaliseEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /** Raw HMAC-SHA256 hex digest of a message using the shared secret. */
  private async hmac(message: string): Promise<string> {
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
   * Verifies a signed request. Accepts both legacy links (`path:timestamp`,
   * full scope, validated against the freshness window) and scoped links
   * (with `scope`/`exp`, validated against the embedded expiry).
   *
   * @param path - The resource path/identifier from the URL
   * @param timestamp - `ts` query parameter
   * @param signature - `sig` query parameter
   * @param scope - `scope` query parameter (absent → legacy full link)
   * @param exp - `exp` query parameter (absolute expiry ms; absent → freshness window)
   * @param emailHash - `eh` query parameter (hashed recipient email; absent → not email-bound)
   */
  async verifySignature(
    path: string,
    timestamp: string,
    signature: string,
    scope?: string | null,
    exp?: string | null,
    emailHash?: string | null,
  ): Promise<SignatureVerificationResult> {
    if (!timestamp || !signature) {
      return { valid: false, error: 'Missing signature or timestamp' };
    }

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) {
      return { valid: false, error: 'Invalid timestamp format' };
    }

    // Normalise scope. Only 'full' | 'lite' are valid; anything else is rejected.
    const scopeValue: AccessTier = scope == null || scope === '' ? 'full' : (scope as AccessTier);
    if (scopeValue !== 'full' && scopeValue !== 'lite') {
      return { valid: false, error: 'Invalid scope' };
    }
    const expiresAt = exp ? parseInt(exp, 10) : 0;
    if (exp && isNaN(expiresAt)) {
      return { valid: false, error: 'Invalid expiry format' };
    }

    // Expiry: scoped links carry an absolute expiry; legacy links use the
    // short freshness window around the signing time.
    const now = Date.now();
    if (expiresAt) {
      if (now > expiresAt) {
        return { valid: false, error: 'Link expired' };
      }
    } else if (Math.abs(now - ts) > this.timeoutMs) {
      return { valid: false, error: 'Timestamp expired or invalid' };
    }

    // The signature must cover scope + expiry (+ email hash when present), so
    // none of them can be tampered with.
    const emailHashValue = emailHash ?? '';
    const expectedSignature = await this.generateSignature(path, ts, scopeValue, expiresAt, emailHashValue);
    if (!this.constantTimeStringCompare(signature, expectedSignature)) {
      return { valid: false, error: 'Invalid signature' };
    }

    return { valid: true, scope: scopeValue };
  }

  /**
   * Signs an access tier for use as the session cookie value, so the tier
   * can't be edited client-side to escalate (e.g. lite → full). Format:
   * `<scope>.<hmac(scope)>`.
   */
  async signScopeCookie(scope: AccessTier): Promise<string> {
    const sig = await this.hmac(`cookie:${scope}`);
    return `${scope}.${sig}`;
  }

  /** Verifies a scope cookie value and returns the tier, or null if tampered. */
  async verifyScopeCookie(value: string | undefined): Promise<AccessTier | null> {
    if (!value) return null;
    // Backward-compat: the legacy opaque cookie value means full access.
    if (value === 'authenticated') return 'full';
    const dot = value.lastIndexOf('.');
    if (dot < 0) return null;
    const scope = value.slice(0, dot);
    const sig = value.slice(dot + 1);
    if (scope !== 'full' && scope !== 'lite') return null;
    const expected = await this.hmac(`cookie:${scope}`);
    if (!this.constantTimeStringCompare(sig, expected)) return null;
    return scope;
  }

  /** Public timing-safe equality (e.g. comparing an entered email hash to `eh`). */
  constantTimeEquals(a: string, b: string): boolean {
    return this.constantTimeStringCompare(a, b);
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

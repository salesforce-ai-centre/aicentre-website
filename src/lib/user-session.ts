import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'user_session';
const ALGORITHM = 'aes-256-gcm';

export interface UserSession {
  userId: string;
  slackUserId: string;
  slackTeamId: string;
  name: string;
  email: string;
  avatarUrl: string;
}

function getSessionSecret(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters');
  }
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptUserSession(session: UserSession): string {
  const key = getSessionSecret();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const json = JSON.stringify(session);
  let encrypted = cipher.update(json, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag().toString('base64');
  return `${iv.toString('base64')}.${authTag}.${encrypted}`;
}

export function decryptUserSession(value: string): UserSession {
  const key = getSessionSecret();
  const [ivB64, authTagB64, encrypted] = value.split('.');
  if (!ivB64 || !authTagB64 || !encrypted) {
    throw new Error('Invalid user session format');
  }
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

export async function getUserSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie) return null;
    return decryptUserSession(cookie.value);
  } catch {
    return null;
  }
}

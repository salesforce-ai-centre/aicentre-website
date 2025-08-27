// Simple test script to verify HMAC authentication
// Run with: node test-hmac.js

const crypto = require('crypto');

const URL_SECRET = process.env.SIGNED_URL_SECRET || 'defaultsharedsecret';
console.log('Using secret:', URL_SECRET);

function generateSignedUrl(path, baseUrl = 'http://localhost:3000') {
  const timestamp = Date.now();
  const message = `${path}:${timestamp}`;
  
  const hmac = crypto.createHmac('sha256', URL_SECRET);
  hmac.update(message);
  const signature = hmac.digest('hex');
  
  const url = new URL(`/${encodeURIComponent(path)}`, baseUrl);
  url.searchParams.set('ts', timestamp.toString());
  url.searchParams.set('sig', signature);
  
  return url.toString();
}

function verifySignature(path, timestamp, signature) {
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) {
    return { valid: false, error: 'Invalid timestamp' };
  }
  
  // Check if within 5 minutes
  const now = Date.now();
  if (Math.abs(now - ts) > 5 * 60 * 1000) {
    return { valid: false, error: 'Timestamp expired' };
  }
  
  // Generate expected signature
  const message = `${path}:${ts}`;
  const hmac = crypto.createHmac('sha256', URL_SECRET);
  hmac.update(message);
  const expectedSig = hmac.digest('hex');
  
  if (signature !== expectedSig) {
    return { valid: false, error: 'Invalid signature' };
  }
  
  return { valid: true };
}

// Test cases
console.log('\n=== HMAC Authentication Test ===\n');

const testPath = 'test-resource';
const signedUrl = generateSignedUrl(testPath);

console.log('Generated signed URL:', signedUrl);

// Parse the URL to extract components
const url = new URL(signedUrl);
const path = url.pathname.substring(1); // Remove leading slash
const ts = url.searchParams.get('ts');
const sig = url.searchParams.get('sig');

console.log('Extracted components:');
console.log('- Path:', path);
console.log('- Timestamp:', ts);
console.log('- Signature:', sig);

// Verify the signature
const verification = verifySignature(path, ts, sig);
console.log('\nVerification result:', verification);

// Test with invalid signature
console.log('\n=== Testing Invalid Signature ===');
const invalidVerification = verifySignature(path, ts, 'invalid-signature');
console.log('Invalid signature test:', invalidVerification);

// Test with expired timestamp (simulate by subtracting 6 minutes)
console.log('\n=== Testing Expired Timestamp ===');
const oldTs = (Date.now() - 6 * 60 * 1000).toString();
const expiredVerification = verifySignature(path, oldTs, sig);
console.log('Expired timestamp test:', expiredVerification);
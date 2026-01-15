import crypto from 'crypto';

/**
 * Generates a Base64-encoded HMAC SHA256 hash.
 *
 * @param {string} data - The data to be hashed.
 * @param {string} secret - The secret key used for hashing.
 * @returns {string} The Base64-encoded HMAC SHA256 hash.
 */
export function generateHmacSha256Hash(data, secret) {
  if (!data || !secret) {
    throw new Error("Both data and secret are required to generate a hash.");
  }

  // Create HMAC SHA256 hash and encode it in Base64
  const hash = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64");

  return hash;
}

export function safeStringify(obj) {
  const cache = new Set();
  const jsonString = JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return; // Discard circular reference
      }
      cache.add(value);
    }
    return value;
  });
  return jsonString;
}

// Frontend compatible base64 decode function
export function base64DecodeFrontend(base64) {
  try {
    // For frontend use (browser)
    const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(standardBase64);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Frontend Base64 decode error:', error);
    return null;
  }
}

// Helper function to decode base64 (for backend)
export function base64Decode(base64) {
  try {
    // Convert Base64Url to standard Base64
    const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if necessary
    const padding = '='.repeat((4 - standardBase64.length % 4) % 4);
    const base64WithPadding = standardBase64 + padding;
    // Decode Base64 to UTF-8 string
    const decoded = Buffer.from(base64WithPadding, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Base64 decode error:', error);
    throw new Error('Invalid payment data');
  }
}
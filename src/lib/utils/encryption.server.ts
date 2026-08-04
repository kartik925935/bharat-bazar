/**
 * Server-side AES-GCM encryption/decryption using Node.js WebCrypto.
 *
 * Uses Buffer instead of atob/btoa for base64 encoding.
 * Produces ciphertexts fully interoperable with the browser-side
 * encryption.ts (same algorithm, same iv+ciphertext layout).
 *
 * MUST ONLY be used in server-side code (server actions, scripts).
 */

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12; // 96-bit nonce

function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  return key;
}

async function importKey(
  keyBase64: string,
  usage: 'encrypt' | 'decrypt'
): Promise<CryptoKey> {
  const keyRaw = Buffer.from(keyBase64, 'base64');
  return crypto.subtle.importKey(
    'raw',
    keyRaw,
    { name: ALGORITHM },
    false,
    [usage]
  );
}

/**
 * Encrypt plaintext with AES-GCM.
 * Returns base64(iv + ciphertext).
 */
export async function encryptField(plain: string, keyBase64?: string): Promise<string> {
  const key = keyBase64 ?? getEncryptionKey();
  const cryptoKey = await importKey(key, 'encrypt');

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plain);
  const cipher = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    cryptoKey,
    encoded
  );

  const combined = new Uint8Array(iv.byteLength + cipher.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipher), iv.byteLength);

  return Buffer.from(combined).toString('base64');
}

/**
 * Decrypt base64(iv + ciphertext) produced by encryptField or the browser encryptText.
 * Returns the original plaintext.
 */
export async function decryptField(cipherBase64: string, keyBase64?: string): Promise<string> {
  const key = keyBase64 ?? getEncryptionKey();
  const cryptoKey = await importKey(key, 'decrypt');

  const combined = Buffer.from(cipherBase64, 'base64');
  const iv = combined.subarray(0, IV_LENGTH);
  const cipher = combined.subarray(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    cryptoKey,
    cipher
  );

  return new TextDecoder().decode(decrypted);
}

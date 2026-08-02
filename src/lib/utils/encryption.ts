export async function encryptText(plain: string, keyBase64: string): Promise<string> {
  // In the browser, we use atob and Uint8Array instead of Buffer
  const keyStr = atob(keyBase64);
  const keyRaw = new Uint8Array(keyStr.length);
  for (let i = 0; i < keyStr.length; i++) {
    keyRaw[i] = keyStr.charCodeAt(i);
  }
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyRaw,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit nonce
  const encoded = new TextEncoder().encode(plain);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);
  
  const cipherArr = new Uint8Array(cipher);
  const combined = new Uint8Array(iv.length + cipherArr.length);
  combined.set(iv, 0);
  combined.set(cipherArr, iv.length);
  
  let combinedStr = '';
  for (let i = 0; i < combined.length; i++) {
    combinedStr += String.fromCharCode(combined[i]);
  }
  return btoa(combinedStr);
}

export async function decryptText(cipherBase64: string, keyBase64: string): Promise<string> {
  try {
    const keyStr = atob(keyBase64);
    const keyRaw = new Uint8Array(keyStr.length);
    for (let i = 0; i < keyStr.length; i++) {
      keyRaw[i] = keyStr.charCodeAt(i);
    }
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyRaw,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const combinedStr = atob(cipherBase64);
    const combined = new Uint8Array(combinedStr.length);
    for (let i = 0; i < combinedStr.length; i++) {
      combined[i] = combinedStr.charCodeAt(i);
    }
    
    const iv = combined.slice(0, 12);
    const cipher = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, cipher);
    
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error('Decryption failed', err);
    return '*** ENCRYPTED ***'; // Fallback so app doesn't crash on bad data
  }
}

import crypto from 'crypto';

// The algorithm, key, and IV must be consistent for both encryption and decryption.
// Key must be 32 bytes (for AES-256), IV must be 16 bytes.
const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); // Generate a secure key (store this securely!)
const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption

export function encryptCookie(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // It is crucial to return the IV along with the encrypted data
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptCookie(encryptedText: string) {
  // Split the combined string to retrieve the IV and the actual ciphertext
  const [ivPart, textPart] = encryptedText.split(':');

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(ivPart, 'hex'),
  );
  let decrypted = decipher.update(textPart, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

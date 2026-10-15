const crypto = require('crypto');

/**
 * Chiffrement symétrique (AES-256-GCM) pour tout secret stocké en base
 * — en particulier les jetons OAuth LinkedIn (Phase 5+). Rien n'est
 * jamais écrit en clair : ni ici, ni dans les logs, ni dans le frontend.
 *
 * TOKEN_ENCRYPTION_KEY doit être une chaîne hexadécimale de 64
 * caractères (32 octets). Générer une clé :
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
function getKey() {
  const key = process.env.TOKEN_ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY manquant ou invalide (attendu : 64 caractères hexadécimaux).'
    );
  }
  return Buffer.from(key, 'hex');
}

function encrypt(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format stocké : iv.authTag.ciphertext (tout en base64), auto-suffisant pour déchiffrer.
  return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join('.');
}

function decrypt(payload) {
  const [ivB64, authTagB64, dataB64] = payload.split('.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };

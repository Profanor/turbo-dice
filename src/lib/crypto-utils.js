import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export const decryptData = (message) => {
  if (!message || !ENCRYPTION_KEY) return null;

  try {
    const decryptedMessage = CryptoJS.AES.decrypt(decodeURIComponent(message), ENCRYPTION_KEY);

    const dataMessage = decryptedMessage.toString(CryptoJS.enc.Utf8);
    return JSON.parse(dataMessage);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export const encryptData = (message) => {
  if (!message || !ENCRYPTION_KEY) return null;

  const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(message), ENCRYPTION_KEY).toString();

  return encodeURIComponent(encryptedMessage);
};

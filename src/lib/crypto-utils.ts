import * as CryptoJS from 'crypto-js';

export const encryptData =  (message:object) => {
  if (!message || !process.env.NEXT_PUBLIC_ENCRYPTION_KEY) return "";

  return encodeURIComponent(
    CryptoJS.AES.encrypt(JSON.stringify(message), process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(),
  );
};

export const decryptData =  (message:string) => {
  if (!message || !process.env.NEXT_PUBLIC_ENCRYPTION_KEY) return "";

  const decryptedMessage = CryptoJS.AES.decrypt(decodeURIComponent(message), process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
  return JSON.parse(decryptedMessage.toString(CryptoJS.enc.Utf8));
};

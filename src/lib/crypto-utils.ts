import AES from 'crypto-js/aes';
import Enc from 'crypto-js/enc-utf8';

export const encryptData =  (message:object) => {
  if (!message || !process.env.NEXT_PUBLIC_ENCRYPTION_KEY) return "";

  return encodeURIComponent(
    AES.encrypt(JSON.stringify(message), process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(),
  );
};

export const decryptData =  (message:string) => {
  if (!message || !process.env.NEXT_PUBLIC_ENCRYPTION_KEY) return "";

  const decryptedMessage = AES.decrypt(decodeURIComponent(message), process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
  return JSON.parse(decryptedMessage.toString(Enc));
};

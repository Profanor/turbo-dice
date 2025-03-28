export const encryptData = async (message) => {
  if (!message || !process.env.NEXT_PUBLIC_ENCRYPTION_KEY) return null;

  const CryptoJS = (await import("crypto-js")).default; // dynamic import to prevent deployment issues
  return encodeURIComponent(
    CryptoJS.AES.encrypt(JSON.stringify(message), process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString()
  );
};

export const decryptData = async (message) => {
  if (!message || !process.env.NEXT_PUBLIC_ENCRYPTION_KEY) return null;

  const CryptoJS = (await import("crypto-js")).default;
  const decryptedMessage = CryptoJS.AES.decrypt(decodeURIComponent(message), process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
  return JSON.parse(decryptedMessage.toString(CryptoJS.enc.Utf8));
};

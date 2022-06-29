type EncryptionConfig = {
  secret: string;
};

type EncryptedData = {
  iv: string;
  content: string;
};

export { EncryptionConfig, EncryptedData };

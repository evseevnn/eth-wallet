export const environment = {
  production: false,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_IN: process.env.JWT_REFRESH_IN || '7d',
  BCRYPT_SALT_OR_ROUND: parseInt(process.env.BCRYPT_SALT_OR_ROUND, 10) || 10,
  PK_ENCRYPTOR_SECRET: process.env.PK_ENCRYPTOR_SECRET,
};

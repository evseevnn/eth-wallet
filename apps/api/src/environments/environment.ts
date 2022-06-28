export const environment = {
  production: false,
  mongodbUrl: process.env.MONGODB_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshIn: process.env.JWT_REFRESH_IN || '7d',
  bcryptSaltOrRound: parseInt(process.env.BCRYPT_SALT_OR_ROUND, 10) || 10,
};

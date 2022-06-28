export const environment = {
  production: true,
  mongodbUrl: process.env.MONGODB_URL,
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshIn: process.env.JWT_REFRESH_IN || '7d',
  bcryptSaltOrRound: 13,
};

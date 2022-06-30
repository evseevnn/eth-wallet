import { Auth } from '../generated/graphql';

export const auth = (authResponse: Auth) => {
  localStorage.setItem('accessToken', authResponse.accessToken);
  localStorage.setItem('refreshToken', authResponse.refreshToken);
};

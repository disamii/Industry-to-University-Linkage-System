const base = `/auth`;

export const authUrls = {
  base: () => base,
  signin: () => `${base}/token/login/`,
  check_email: () => `${base}/sso/login/`,
  refreshToken: () => `${base}/refresh/`,
};

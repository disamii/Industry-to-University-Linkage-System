const base = `/auth`;

export const authUrls = {
  signin: () => `${base}/token/login/`,
  check_email: () => `${base}/sso/login/`,
};

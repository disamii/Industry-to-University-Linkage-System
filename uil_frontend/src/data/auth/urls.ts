const base = `/auth`;

export const authUrls = {
  base: () => base,
  signin: () => `${base}/login`,
  check_email: () => `${base}/check-email`,
};

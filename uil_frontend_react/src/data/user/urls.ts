const base = `auth/users`;

export const userUrls = {
  base: () => `${base}/`,
  profile: () => `${base}/me/`,
  change_password: () => `${base}/set_password/`,
};

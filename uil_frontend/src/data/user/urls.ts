const base = `auth/users`;

export const userUrls = {
  base: () => base,
  profile: () => `${base}/me`,
  byId: (id: string) => `${base}/${id}`,
};

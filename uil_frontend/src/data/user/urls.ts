const base = `/users`;

export const userUrls = {
  base: () => base,
  profile: () => `${base}/me`,
  byId: (id: string) => `${base}/${id}`,
};

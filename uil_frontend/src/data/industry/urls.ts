const base = `/industry`;

export const industryUrls = {
  base: () => base,
  register: () => `${base}/register`,
  profile: () => `${base}/me/profile`,
  byId: (id: string) => `${base}/${id}`,
  requests: (id: string) => `${base}/${id}/requests`,
};

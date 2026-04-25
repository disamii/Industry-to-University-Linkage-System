const base = `/industry_linkage/industries`;

export const industryUrls = {
  base: () => base,
  register: () => `${base}/`,
  profile: () => `${base}/me/profile`,
  byId: (id: string) => `${base}/${id}`,
  requests: (id: string) => `${base}/${id}/requests`,
};

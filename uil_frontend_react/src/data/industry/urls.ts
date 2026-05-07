const base = `/industry_linkage/industries`;

export const industryUrls = {
  base: () => `${base}/`,
  byId: (id: string) => `${base}/${id}`,
  requests: (id: string) => `${base}/${id}/requests`,
};

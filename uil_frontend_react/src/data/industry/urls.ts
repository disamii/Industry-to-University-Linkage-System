const base = `/industry_linkage/industries`;

export const industryUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
};

const base = "/industry-requests";

export const industryRequestUrls = {
  base: () => base,
  byId: (id: string) => `${base}/${id}`,
  adminAll: () => `${base}/admin/all`,
  adminById: (id: string) => `${base}/admin/details/${id}`,
};

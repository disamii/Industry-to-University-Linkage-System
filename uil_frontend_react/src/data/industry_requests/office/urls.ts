const base = "industry_linkage/request-manages";

export const industryRequestOfficeUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
};

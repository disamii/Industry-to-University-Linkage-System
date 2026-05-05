const base = "industry_linkage/requests";

export const industryRequestUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
  mine: () => `${base}/my-requests/`,
};

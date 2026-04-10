const base = "/industry-requests";

export const industryRequestUrls = {
  base: () => base,
  byId: (id: string) => `${base}/${id}`,
};

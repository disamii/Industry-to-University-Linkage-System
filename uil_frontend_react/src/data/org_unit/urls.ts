const base = "/organizational-structure/organizational-unit";

export const orgUnitUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
  direct_children: () => `${base}/direct-children/`,
};

const base = "/organizational-structure/organizational-unit";

export const orgUnitUrls = {
  base: () => `${base}/`,
  direct_children: () => `${base}/direct-children/`, // ?parent_id=3
};

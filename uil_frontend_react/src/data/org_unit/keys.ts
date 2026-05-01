export const orgUnitKeys = {
  all: () => ["org_units"] as const,
  list: () => [...orgUnitKeys.all(), "list"] as const,
  direct_children_list: () =>
    [...orgUnitKeys.all(), "direct-children", "list"] as const,
};

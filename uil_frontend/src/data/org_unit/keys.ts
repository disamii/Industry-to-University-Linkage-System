export const orgUnitKeys = {
  all: () => ["org_units"] as const,
  list: () => [...orgUnitKeys.all(), "list"] as const,
};

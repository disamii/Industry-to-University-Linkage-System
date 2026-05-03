import {
  OrgUnitDirectChildrenListParams,
  OrgUnitListParams,
} from "@/types/interfaces.org_units";

export const orgUnitKeys = {
  all: () => ["org_units"] as const,
  list: (params?: OrgUnitListParams) =>
    [...orgUnitKeys.all(), "list", params] as const,
  detail: (id?: number) => [...orgUnitKeys.all(), "detail", id] as const,
  direct_children_list: (params?: OrgUnitDirectChildrenListParams) =>
    [...orgUnitKeys.all(), "direct-children", "list", params] as const,
};

import { OrgUnitType } from "@/lib/enums";

export type OrgUnitDirectChildrenListParams = {
  parent_id?: number;
};

export type OrgUnitListParams = {
  search?: string;
};

type BaseOrgUnit = {
  id: number;
  name: string;
  unit_type: OrgUnitType;
};

export type OrgUnitResponse = BaseOrgUnit & {
  parent: number | null;
  abbreviation: string | null;
  description: string | null;
  total_subnodes: number;
  ancestors: BaseOrgUnit[];
};

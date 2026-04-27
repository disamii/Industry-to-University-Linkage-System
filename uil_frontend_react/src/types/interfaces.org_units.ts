import { Metadata } from "./interfaces";

// Should be removed
// ——————————————----------------————————————————————————
type OrgUnitBase = {
  name: string;
  abbreviation: string | null;
  unit_type: string;
  description: string | null;
  parent_id: string | null;
};

export type OrgUnitResponse = OrgUnitBase & {
  id: string;
  created_at: string;
  updated_at: string | null;
};
// ——————————————----------------————————————————————————

type BaseAcademicNode = {
  id: number;
  name: string;
  unit_type: string;
};

type HierarchyNode = BaseAcademicNode & {
  unit_type_display: string;
};

export type AcademicUnit = BaseAcademicNode &
  Metadata & {
    parent: number | null;
    abbreviation: string | null;
    description: string | null;
    total_subnodes: number;
    hierarchy: HierarchyNode[];
    leaf_descendants: any[];
  };

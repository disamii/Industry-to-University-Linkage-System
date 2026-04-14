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

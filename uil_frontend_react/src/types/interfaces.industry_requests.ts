import { IndustryRequestBase } from "@/validation/validation.industry_requests";
import { Metadata } from "./interfaces";
import { OrgUnitResponse } from "./interfaces.org_units";
import { ActionType, RequestingEntity } from "@/lib/enums";
import { IndustryResponse } from "./interfaces.industry";

export type IndustryRequestStats = {
  total_requests: number;
  created_requests: number;
  assigned_requests: number;
  completed_requests: number;
};

export type RequestAction = Metadata & {
  id: number;
  type: ActionType;
  description: string;
  performed_by: string;
  from_industry: string | null;
  to_industry: string | null;
  from_unit: string | null;
  to_unit: string | null;
  forwarded_to: string | null;
  forwarded_from: string | null;
};

export type IndustryRequestResponse = Omit<IndustryRequestBase, "attachment"> &
  Metadata & { id: number; attachment: string | null };

export type IndustryRequestMineResponse = Omit<
  IndustryRequestResponse,
  "academic_unit" | "extra_data"
> & {
  industry: number;
  academic_unit: OrgUnitResponse;
  latest_action: ActionType;
};

export type IndustryRequestOfficeResponse = IndustryRequestMineResponse & {};

export type IndustryRequestDetailResponse = Omit<
  IndustryRequestResponse,
  "academic_unit" | "extra_data"
> & {
  industry: IndustryResponse;
  detail: Record<string, string> | null;
  actions: RequestAction[];
  requesting_entity: RequestingEntity;
  academic_unit: OrgUnitResponse;
};

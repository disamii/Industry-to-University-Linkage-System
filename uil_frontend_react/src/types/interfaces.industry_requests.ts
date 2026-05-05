import { ActionType, RequestingEntity } from "@/lib/enums";
import { IndustryRequestBase } from "@/validation/validation.industry_requests";
import { Metadata } from "./interfaces";
import { RequestAction } from "./interfaces.actions";
import { IndustryResponse } from "./interfaces.industry";
import { OrgUnitResponse } from "./interfaces.org_units";

export type IndustryRequestStats = {
  total_requests: number;
  created_requests: number;
  assigned_requests: number;
  completed_requests: number;
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

export type IndustryRequestOfficeResponse = Omit<
  IndustryRequestMineResponse,
  "industry"
> & {
  industry: IndustryResponse;
};

export type IndustryRequestDetailResponse = Omit<
  IndustryRequestResponse,
  "academic_unit" | "extra_data" | "industry"
> & {
  industry: IndustryResponse;
  detail: Record<string, string> | null;
  actions: RequestAction[];
  requesting_entity: RequestingEntity;
  academic_unit: OrgUnitResponse;
};

export type IndustryRequestDetailOfficeResponse =
  IndustryRequestDetailResponse & {};

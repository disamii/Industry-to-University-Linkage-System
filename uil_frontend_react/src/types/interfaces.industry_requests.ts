import { IndustryRequestBase } from "@/validation/validation.industry_requests";
import { Metadata } from "./interfaces";
import { OrgUnitResponse } from "./interfaces.org_units";
import { RequestingEntity } from "@/lib/enums";
import { IndustryResponse } from "./interfaces.industry";

export type IndustryRequestMineParams = {
  page: number;
  page_size: number;
};

export type ActionType =
  | "created"
  | "assigned"
  | "forwarded"
  | "accept_forwarded"
  | "posted_as_thematic"
  | "replied"
  | "rejected"
  | "reassigned"
  | "completed";

type Action = Metadata & {
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

export type IndustryRequestResponse = IndustryRequestBase &
  Metadata & { id: number };

export type IndustryRequestMineResponse = Omit<
  IndustryRequestResponse,
  "academic_unit" | "extra_data"
> & {
  industry: number;
  academic_unit: OrgUnitResponse;
  latest_action: ActionType;
};

export type IndustryRequestDetailResponse = Omit<
  IndustryRequestResponse,
  "academic_unit" | "extra_data"
> & {
  industry: IndustryResponse;
  detail: Record<string, string>;
  actions: Action;
  requesting_entity: RequestingEntity;
  academic_unit: OrgUnitResponse;
};

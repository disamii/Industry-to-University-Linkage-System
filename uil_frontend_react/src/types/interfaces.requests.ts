import {
  ActionType,
  Entity,
  IndustryRequestType,
  OfficeRequestType,
  StaffRequestType,
} from "@/lib/enums";
import { RequestBase } from "@/validation/validation.requests";
import { Metadata } from "./interfaces";
import { RequestAction } from "./interfaces.actions";
import { IndustryResponse } from "./interfaces.industry";
import { OrgUnitResponse } from "./interfaces.org_units";
import { UserProfile } from "./interfaces.user";

export type RequestStats = {
  total_requests: number;
  initiated_requests: number;
  assigned_requests: number;
  completed_requests: number;
};

export type RequestResponse = Omit<RequestBase, "attachment"> &
  Metadata & {
    id: number;
    attachment: string | null;
    type: IndustryRequestType | OfficeRequestType | StaffRequestType;
    academic_unit: number;
    requesting_entity: Entity;
  };

export type MyRequestResponse = Omit<RequestResponse, "extra_data"> & {
  industry: number;
  academic_unit: OrgUnitResponse;
  latest_action: ActionType;
};

export type OfficeRequestResponse = Omit<MyRequestResponse, "industry"> & {
  industry: IndustryResponse;
};

export type RequestDetailResponse = OfficeRequestResponse & {
  requesting_entity: Entity;
  actions: RequestAction[];
  requested_by: UserProfile;
  supported_actions: ActionType[];
};

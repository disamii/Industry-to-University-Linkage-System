import { AssignmentStatus } from "@/lib/enums";
import { IndustryRequestOfficeResponse } from "./interfaces.industry_requests";
import { UserProfile } from "./interfaces.user";

export type AssignmentResponse = {
  id: number;
  request: IndustryRequestOfficeResponse;
  assigned_users: UserProfile[];
  industry_mentor?: string | null;
  start_date: string;
  end_date: string;
  status: AssignmentStatus;
};

import { AssignmentStatus } from "@/lib/enums";
import { RequestDetailResponse } from "./interfaces.requests";
import { UserProfile } from "./interfaces.user";

export type AssignmentResponse = {
  id: number;
  request: RequestDetailResponse;
  assigned_users: UserProfile[];
  industry_mentor?: string | null;
  start_date: string;
  end_date: string;
  status: AssignmentStatus;
  supported_actions: AssignmentStatus[];
};

export type AssignmentDetailResponse = AssignmentResponse & {};

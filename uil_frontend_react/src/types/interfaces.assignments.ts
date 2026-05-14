import { AssignmentStatus } from "@/lib/enums";
import { RequestDetailResponse } from "./interfaces.requests";
import { UserProfile } from "./interfaces.user";

export type AssignmentStats = {
  total_assignments: number;
  pending: number;
  accepted: number;
  rejected: number;
  in_progress: number;
  completed: number;
  cancelled: number;
};

export type AssignmentResponse = {
  id: number;
  request: RequestDetailResponse;
  assigned_users: UserProfile[];
  industry_mentor?: string | null;
  start_date: string;
  end_date: string;
  status: AssignmentStatus;
  supported_actions: AssignmentStatus[];
  visible_to_industry: boolean;
};

export type AssignmentDetailResponse = AssignmentResponse & {};

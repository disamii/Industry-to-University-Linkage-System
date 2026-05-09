import { ActionType } from "@/lib/enums";
import { Metadata } from "./interfaces";
import { AssignmentResponse } from "./interfaces.assignments";
import { IndustryResponse } from "./interfaces.industry";
import { OrgUnitResponse } from "./interfaces.org_units";
import { PostResponse } from "./interfaces.posts";
import { UserProfile } from "./interfaces.user";

type ActionActor = UserProfile | IndustryResponse | OrgUnitResponse;
type ActionResultedObject = PostResponse | AssignmentResponse;

export type RequestAction = Metadata & {
  id: number;
  type: ActionType;
  description: string;
  actor_from: ActionActor | null; // replied
  actor_to: ActionActor | null; // forwarded // replied
  resulted_object: ActionResultedObject | null; // post, assignment
  awaiting_decision: boolean;
  supported_actions: ActionType[];
};

export type PerformActionResponse = {
  id: number;
  type: ActionType;
  awaiting_decision?: boolean; // for altering
  message: string;
};

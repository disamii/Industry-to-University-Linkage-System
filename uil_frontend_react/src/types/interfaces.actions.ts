import { ActionType } from "@/lib/enums";
import { Metadata } from "./interfaces";

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

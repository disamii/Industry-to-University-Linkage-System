import { ActionType } from "@/lib/enums";
import {
  CheckCircle2,
  CheckSquare,
  FileText,
  Forward,
  LucideIcon,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldMinus,
  UserCheck,
  XCircle,
} from "lucide-react";

// 1. Define common field groups to keep it DRY
const BASE_FIELDS = ["description"] as const;
const ASSIGNMENT_FIELDS = [
  ...BASE_FIELDS,
  "assigned_user",
  "start_date",
  "end_date",
  "industry_mentor",
] as const;
const ROUTING_FIELDS = [...BASE_FIELDS, "from_unit", "to_unit"] as const;

type ActionConfig = {
  label: string;
  Icon: LucideIcon;
  color: string;
  formFields: string[]; // New field added
};

export const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  [ActionType.CREATED]: {
    label: "Create Request",
    Icon: Plus,
    color: "bg-zinc-100 text-zinc-700",
    formFields: [...BASE_FIELDS],
  },

  [ActionType.ASSIGNED]: {
    label: "Assign User",
    Icon: UserCheck,
    color: "bg-blue-100 text-blue-700",
    formFields: [...ASSIGNMENT_FIELDS],
  },

  [ActionType.FORWARDED]: {
    label: "Forward",
    Icon: Forward,
    color: "bg-indigo-100 text-indigo-700",
    formFields: [...ROUTING_FIELDS],
  },

  [ActionType.ACCEPT_FORWARDED]: {
    label: "Accept Forward",
    Icon: CheckCircle2,
    color: "bg-cyan-100 text-cyan-700",
    formFields: [...BASE_FIELDS],
  },

  [ActionType.POSTED_AS_THEMATIC]: {
    label: "Post as Thematic",
    Icon: FileText,
    color: "bg-fuchsia-100 text-fuchsia-700",
    formFields: [
      "title",
      "content",
      "description",
      "is_internal_only",
      "expires_at",
      "image",
    ],
  },

  [ActionType.REPLIED]: {
    label: "Reply",
    Icon: MessageSquare,
    color: "bg-lime-100 text-lime-700",
    formFields: [
      ...BASE_FIELDS,
      "from_unit",
      "to_unit",
      "from_industry",
      "to_industry",
    ],
  },

  [ActionType.REJECTED]: {
    label: "Reject",
    Icon: XCircle,
    color: "bg-red-100 text-red-700",
    formFields: [...BASE_FIELDS],
  },

  [ActionType.REASSIGNED]: {
    label: "Reassign",
    Icon: RefreshCw,
    color: "bg-amber-100 text-amber-800",
    formFields: [...ASSIGNMENT_FIELDS],
  },

  [ActionType.COMPLETED]: {
    label: "Mark Complete",
    Icon: CheckSquare,
    color: "bg-emerald-100 text-emerald-700",
    formFields: [...BASE_FIELDS],
  },

  [ActionType.REVOKED]: {
    label: "Revoke Assignment",
    Icon: ShieldMinus,
    color: "bg-red-100 text-red-700",
    formFields: [...BASE_FIELDS],
  },
};

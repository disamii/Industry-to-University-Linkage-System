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
  UserCheck,
  XCircle,
} from "lucide-react";

type ActionConfig = {
  label: string;
  Icon: LucideIcon;
  color: string;
};

export const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  created: {
    label: "Create Request",
    Icon: Plus,
    color: "bg-zinc-100 text-zinc-700",
  },

  assigned: {
    label: "Assign User",
    Icon: UserCheck,
    color: "bg-blue-100 text-blue-700",
  },

  forwarded: {
    label: "Forward",
    Icon: Forward,
    color: "bg-indigo-100 text-indigo-700",
  },

  accept_forwarded: {
    label: "Accept Forward",
    Icon: CheckCircle2,
    color: "bg-cyan-100 text-cyan-700",
  },

  posted_as_thematic: {
    label: "Post as Thematic",
    Icon: FileText,
    color: "bg-fuchsia-100 text-fuchsia-700",
  },

  replied: {
    label: "Reply",
    Icon: MessageSquare,
    color: "bg-lime-100 text-lime-700",
  },

  rejected: {
    label: "Reject",
    Icon: XCircle,
    color: "bg-red-100 text-red-700",
  },

  reassigned: {
    label: "Reassign",
    Icon: RefreshCw,
    color: "bg-amber-100 text-amber-800",
  },

  completed: {
    label: "Mark Complete",
    Icon: CheckSquare,
    color: "bg-emerald-100 text-emerald-700",
  },
};

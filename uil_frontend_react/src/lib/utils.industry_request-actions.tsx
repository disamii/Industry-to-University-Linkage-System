import { ActionType } from "@/types/interfaces.industry_requests";
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

export const actionStyles: Record<ActionType, string> = {
  created: "bg-zinc-100 text-zinc-700",

  assigned: "bg-blue-100 text-blue-700",
  forwarded: "bg-indigo-100 text-indigo-700",
  accept_forwarded: "bg-cyan-100 text-cyan-700",

  posted_as_thematic: "bg-fuchsia-100 text-fuchsia-700",

  replied: "bg-lime-100 text-lime-700",

  rejected: "bg-red-100 text-red-700",

  reassigned: "bg-amber-100 text-amber-800",

  completed: "bg-emerald-100 text-emerald-700",
};

export const actionIcons: Record<ActionType, LucideIcon> = {
  created: Plus,
  assigned: UserCheck,
  forwarded: Forward,
  accept_forwarded: CheckCircle2,
  posted_as_thematic: FileText,
  replied: MessageSquare,
  rejected: XCircle,
  reassigned: RefreshCw,
  completed: CheckSquare,
};

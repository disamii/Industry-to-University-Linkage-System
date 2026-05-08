import {
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  CheckSquare,
  Ban,
  LucideIcon,
} from "lucide-react";
import { AssignmentStatus } from "@/lib/enums"; // Adjust path as needed

export type StatusConfig = {
  label: string;
  Icon: LucideIcon;
  color: string;
  description: string;
};

export const ASSIGNMENT_STATUS_CONFIG: Record<AssignmentStatus, StatusConfig> =
  {
    [AssignmentStatus.PENDING]: {
      label: "Mark pending",
      Icon: Clock,
      color: "bg-amber-100 text-amber-700",
      description: "Waiting for initial action or approval.",
    },
    [AssignmentStatus.ACCEPTED]: {
      label: "Accept",
      Icon: CheckCircle2,
      color: "bg-blue-100 text-blue-700",
      description: "Assignment has been acknowledged by the assignee.",
    },
    [AssignmentStatus.REJECTED]: {
      label: "Reject",
      Icon: XCircle,
      color: "bg-red-100 text-red-700",
      description: "The request was turned down.",
    },
    [AssignmentStatus.IN_PROGRESS]: {
      label: "Mark in Progress",
      Icon: PlayCircle,
      color: "bg-indigo-100 text-indigo-700",
      description: "Work is currently being performed.",
    },
    [AssignmentStatus.COMPLETED]: {
      label: "Mark Complete",
      Icon: CheckSquare,
      color: "bg-emerald-100 text-emerald-700",
      description: "Task has been finished successfully.",
    },
    [AssignmentStatus.CANCELLED]: {
      label: "Cancel",
      Icon: Ban,
      color: "bg-slate-200 text-slate-600",
      description: "The assignment was terminated before completion.",
    },
  };

/**
 * Helper to get config safely
 */
export const getAssignmentStatusConfig = (status: AssignmentStatus) => {
  return ASSIGNMENT_STATUS_CONFIG[status];
};

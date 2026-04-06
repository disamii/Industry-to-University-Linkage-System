import { RequestPriority, RequestStatus } from "@/lib/enums";
import { cn } from "@/lib/utils";

const statusStyles: Record<RequestStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  IN_REVIEW: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  ASSIGNED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
};

export const StatusBadge = ({ status }: { status: RequestStatus }) => (
  <span
    className={cn(
      "inline-flex items-center px-3 py-1 border rounded-full font-bold text-[10px] uppercase tracking-wider",
      statusStyles[status],
    )}
  >
    {status.replace("-", " ")}
  </span>
);

const priorityStyles: Record<RequestPriority, string> = {
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  HIGH: "bg-red-500/10 text-red-600 border-red-500/20",
};

export const PriorityBadge = ({ priority }: { priority: RequestPriority }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 border rounded-full font-bold text-[10px] uppercase tracking-wider",
        priorityStyles[priority],
      )}
    >
      {priority}
    </span>
  );
};

import { cn } from "@/lib/utils";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "in-progress": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export const StatusBadge = ({
  status,
}: {
  status: keyof typeof statusStyles;
}) => (
  <span
    className={cn(
      "inline-flex items-center px-3 py-1 border rounded-full font-bold text-[10px] uppercase tracking-wider",
      statusStyles[status],
    )}
  >
    {status.replace("-", " ")}
  </span>
);

export const PriorityBadge = ({
  priority,
}: {
  priority: "low" | "medium" | "high";
}) => {
  const styles = {
    low: "bg-slate-100 text-slate-600 border-slate-200",
    medium: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    high: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 border rounded-full font-bold text-[10px] uppercase tracking-wider",
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
};

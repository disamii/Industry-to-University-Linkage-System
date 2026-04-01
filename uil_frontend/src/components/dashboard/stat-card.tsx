import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "bg-primary",
}: any) {
  return (
    <div className="group bg-card shadow-sm hover:shadow-md p-6 border border-border/50 rounded-[2rem] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div
          className={cn(
            "p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300",
            color,
            "bg-opacity-10",
          )}
        >
          <Icon className={cn("w-6 h-6", color.replace("bg-", "text-"))} />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs",
              trend.isPositive
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-destructive bg-destructive/10",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground text-3xl tracking-tight">
          {value}
        </h3>
        <p className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
          {title}
        </p>
      </div>
    </div>
  );
}

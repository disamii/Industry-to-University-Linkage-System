"use client";

import { Clock, MessageSquare, Upload, UserPlus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  type: "status" | "assignment" | "comment" | "upload";
}

const typeConfig = {
  status: { color: "bg-blue-500", icon: Zap },
  assignment: { color: "bg-purple-500", icon: UserPlus },
  comment: { color: "bg-emerald-500", icon: MessageSquare },
  upload: { color: "bg-orange-500", icon: Upload },
};

export function ActivityTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="before:left-2 before:absolute relative before:inset-0 space-y-8 before:bg-border/50 before:w-0.5 before:h-full">
      {items.map((item) => {
        const Config = typeConfig[item.type];
        return (
          <div
            key={item.id}
            className="relative flex gap-6 slide-in-from-left-4 pl-8 animate-in duration-500 fade-in"
          >
            {/* Dot & Icon */}
            <div
              className={cn(
                "left-0 z-10 absolute border-2 border-background rounded-full w-4 h-4",
                Config.color,
              )}
            />

            <div className="flex-1 bg-accent/30 p-4 border border-transparent hover:border-border/60 rounded-3xl transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-foreground text-sm">
                  {item.title}
                </h4>
                <span className="flex items-center gap-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                  <Clock size={12} /> {item.timestamp}
                </span>
              </div>
              <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex justify-center items-center bg-primary/10 rounded-full w-5 h-5 font-bold text-[10px] text-primary">
                  {item.user.charAt(0)}
                </div>
                <span className="font-semibold text-foreground/70 text-xs">
                  by {item.user}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

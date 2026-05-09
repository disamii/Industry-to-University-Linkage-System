// stat-card.tsx
import { colorVariants } from "@/lib/mappings";
import { cn } from "@/lib/utils";
import { StatCardKeys } from "@/types/interfaces";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type SubStat = {
  label: string;
  value: string;
  colorVariant: StatCardKeys;
};

export type Stat = {
  title: string;
  value: string;
  desc?: string;
  Icon: LucideIcon;
  colorVariant: StatCardKeys;
  subStats?: SubStat[];
};

type Props = {
  stats: Stat[];
};

const StatCard = ({ stats }: Props) => {
  return (
    <div
      className={cn("gap-4 grid")}
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map(({ title, value, Icon, colorVariant, subStats }, idx) => (
        <Card key={`${title}—${idx}`} className="shadow-none border-none">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn("p-3 rounded-full", colorVariants[colorVariant])}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground text-sm">
                  {title}
                </h3>
                <p className="font-bold text-2xl">{value}</p>
              </div>
            </div>

            {subStats && subStats.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-1 pt-3 border-t">
                {subStats.map(({ label, value, colorVariant }) => (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-full font-medium text-xs",
                      colorVariants[colorVariant],
                    )}
                  >
                    <span>{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatCard;

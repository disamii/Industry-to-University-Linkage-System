import { cn, statCardColors } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export type Stat = {
  title: string;
  value: string;
  desc?: string;
  Icon: LucideIcon;
  colorVariant: keyof typeof statCardColors;
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
      {stats.map(({ title, value, Icon, colorVariant }, idx) => {
        return (
          <Card key={`${title}—${idx}`} className="shadow-none border-none">
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={cn("p-3 rounded-full", statCardColors[colorVariant])}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-muted-foreground text-sm">
                  {title}
                </h3>
                <p className="font-bold text-2xl">{value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatCard;

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react";
import {
  CheckCircle2,
  Clock,
  FileCheck,
  FilePlus2,
  Forward,
  Megaphone,
  Rocket,
  RotateCcw,
  Send,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RequestItem = {
  latest_action?: string;
  [key: string]: any;
};

type Props = {
  data: RequestItem[];
  /** Which `latest_action` values count as a "successful" outcome */
  successActions?: string[];
};

type ActionMeta = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
};

const ACTION_META: Record<string, ActionMeta> = {
  initiated: { label: "Initiated", icon: FilePlus2, color: "var(--chart-1)" },
  assigned: { label: "Assigned", icon: Send, color: "var(--chart-2)" },
  forwarded: { label: "Forwarded", icon: Forward, color: "var(--chart-3)" },
  posted_as_thematic: { label: "Posted as Thematic Call", icon: Megaphone, color: "var(--chart-4)" },
  rejected: { label: "Rejected", icon: XCircle, color: "var(--destructive)" },
  completed: { label: "Completed", icon: CheckCircle2, color: "var(--chart-5)" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "var(--muted-foreground)" },
  accept_forwarded: { label: "Accept Forwarded", icon: ThumbsUp, color: "var(--chart-2)" },
  replied: { label: "Replied", icon: FileCheck, color: "var(--chart-1)" },
  reverted: { label: "Reverted", icon: RotateCcw, color: "var(--chart-3)" },
  promoted_to_project: { label: "Promoted to Project", icon: Rocket, color: "var(--chart-4)" },
};

function successRateColor(rate: number) {
  if (rate >= 70) return "var(--chart-5)"; // green-ish
  if (rate >= 40) return "var(--chart-2)"; // amber-ish
  return "var(--destructive)"; // red
}

export function LatestActionKpiDashboard({
  data,
  successActions = ["completed"],
}: Props) {
  const counts = (data ?? []).reduce<Record<string, number>>((acc, item) => {
    const action = item.latest_action;
    if (!action) return acc;
    acc[action] = (acc[action] ?? 0) + 1;
    return acc;
  }, {});

  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

  const successCount = successActions.reduce(
    (sum, action) => sum + (counts[action] ?? 0),
    0
  );
  const successRate = total ? Math.round((successCount / total) * 100) : 0;
  const rateColor = successRateColor(successRate);

  const gaugeData = [
    { name: "success", value: successRate },
    { name: "rest", value: Math.max(100 - successRate, 0) },
  ];

  const chartData = Object.entries(ACTION_META)
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      count: counts[key] ?? 0,
      color: meta.color,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">

      {/* Success rate gauge + Breakdown chart, side by side */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>
              Completed requests out of total submitted
            </CardDescription>
          </CardHeader>

          <CardContent className="flex h-87.5 items-center justify-center">
            <div className="relative h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius="72%"
                    outerRadius="100%"
                    stroke="none"
                    isAnimationActive
                  >
                    <Cell fill={rateColor} />
                    <Cell fill="var(--muted)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold" style={{ color: rateColor }}>
                  {successRate}%
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {successCount} of {total} completed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Action Breakdown</CardTitle>
            <CardDescription>
              Distribution of requests by their current latest action
            </CardDescription>
          </CardHeader>

          <CardContent className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip cursor={{ opacity: 0.1 }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={28}>
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
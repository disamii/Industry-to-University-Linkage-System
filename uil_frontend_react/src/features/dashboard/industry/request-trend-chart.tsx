"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type TrendPoint = {
  quarter: string;
  incoming: number;
  outgoing: number;
};

export function RequestTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <AreaChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
      <defs>
        <linearGradient id="gradIncoming" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--color-incoming)" stopOpacity={0.4} />
          <stop offset="95%" stopColor="var(--color-incoming)" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="gradOutgoing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--color-outgoing)" stopOpacity={0.4} />
          <stop offset="95%" stopColor="var(--color-outgoing)" stopOpacity={0} />
        </linearGradient>
      </defs>

      <CartesianGrid vertical={false} strokeDasharray="3 3" />

      <XAxis
        dataKey="quarter"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tick={{ fontSize: 12 }}
      />

      <YAxis
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        allowDecimals={false}
        tick={{ fontSize: 12 }}
      />

      <ChartTooltip
        cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
        content={<ChartTooltipContent indicator="dot" />}
      />

      <Area
        type="monotone"
        dataKey="incoming"
        name="Incoming"
        stroke="var(--color-incoming)"
        strokeWidth={2}
        fill="url(#gradIncoming)"
        dot={{ r: 3, fill: "var(--color-incoming)", strokeWidth: 0 }}
        activeDot={{ r: 5 }}
      />

      <Area
        type="monotone"
        dataKey="outgoing"
        name="Outgoing"
        stroke="var(--color-outgoing)"
        strokeWidth={2}
        strokeDasharray="5 3"
        fill="url(#gradOutgoing)"
        dot={{ r: 3, fill: "var(--color-outgoing)", strokeWidth: 0 }}
        activeDot={{ r: 5 }}
      />

      <ChartLegend content={<ChartLegendContent />} />
    </AreaChart>
  );
}
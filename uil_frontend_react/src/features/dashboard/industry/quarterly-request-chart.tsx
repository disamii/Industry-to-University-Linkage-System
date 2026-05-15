import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Inbox } from "lucide-react"; // Ensure you have lucide-react installed

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { MyRequestResponse } from "@/types/interfaces.requests";

interface RequestChartProps {
  incomingRequests?: MyRequestResponse[];
  outgoingRequests?: MyRequestResponse[];
}

const chartConfig = {
  requests: { label: "Total Requests" },
  incoming: { label: "Incoming Requests", color: "var(--chart-1)" },
  outgoing: { label: "Outgoing Requests", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function QuarterlyRequestChart({
  incomingRequests = [],
  outgoingRequests = [],
}: RequestChartProps) {
  // 1. Process Raw Data into Quarterly Totals
  const processedChartData = React.useMemo(() => {
    const quarterlyMap: Record<
      string,
      { quarter: string; incoming: number; outgoing: number }
    > = {};

    const getQuarterString = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();

      const quarterRanges = [
        "Jan - Mar",
        "Apr - Jun",
        "Jul - Sep",
        "Oct - Dec",
      ];

      const quarter = Math.floor(date.getMonth() / 3);

      return `${quarterRanges[quarter]} ${year}`;
    };

    incomingRequests.forEach((req) => {
      if (!req.created_at) return;
      const qKey = getQuarterString(req.created_at);
      if (!quarterlyMap[qKey])
        quarterlyMap[qKey] = { quarter: qKey, incoming: 0, outgoing: 0 };
      quarterlyMap[qKey].incoming += 1;
    });

    outgoingRequests.forEach((req) => {
      if (!req.created_at) return;
      const qKey = getQuarterString(req.created_at);
      if (!quarterlyMap[qKey])
        quarterlyMap[qKey] = { quarter: qKey, incoming: 0, outgoing: 0 };
      quarterlyMap[qKey].outgoing += 1;
    });

    return Object.values(quarterlyMap).sort((a, b) =>
      a.quarter.localeCompare(b.quarter),
    );
  }, [incomingRequests, outgoingRequests]);

  // 2. Identify State Variants
  const hasNoData = processedChartData.length === 0;
  const isSingleDataPoint = processedChartData.length === 1;

  return (
    <Card className="relative w-full overflow-hidden">
      <CardHeader className="flex flex-col gap-1 border-b">
        <CardTitle>Quarterly Request Analysis</CardTitle>
        <CardDescription>
          Quarterly Metrics of Incoming and outgoing requests.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative px-2 pt-4 sm:pt-6 min-h-75">
        {/* SAFETY NET A: Clean Empty State Overlay */}
        {hasNoData && (
          <div className="z-10 absolute inset-0 flex flex-col justify-center items-center gap-2 bg-background/40 backdrop-blur-[1px] transition-all">
            <div className="bg-muted p-3 rounded-full text-muted-foreground">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="font-medium text-muted-foreground text-sm">
              No requests found
            </p>
            <p className="text-muted-foreground/70 text-xs">
              Incoming and outgoing metrics will appear here once initiated.
            </p>
          </div>
        )}

        <ChartContainer
          config={chartConfig}
          className={`aspect-auto h-75 w-full ${hasNoData ? "opacity-20 select-none pointer-events-none" : ""}`}
        >
          {/* SAFETY NET B: Swap dynamically to a crisp Bar chart if there's only 1 point to avoid broken lines */}
          {isSingleDataPoint ? (
            <BarChart
              data={processedChartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="quarter"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="incoming"
                fill="var(--color-incoming)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
                name="Incoming"
              />
              <Bar
                dataKey="outgoing"
                fill="var(--color-outgoing)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
                name="Outgoing"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          ) : (
            /* Standard Area View for multi-point data arrays */
            <AreaChart
              data={
                hasNoData
                  ? [{ quarter: "No Data", incoming: 0, outgoing: 0 }]
                  : processedChartData
              }
              margin={{ left: 12, right: 12 }}
            >
              <defs>
                <linearGradient id="fillIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-incoming)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-incoming)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
                <linearGradient id="fillOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-outgoing)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-outgoing)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="quarter"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                name="Incoming"
                dataKey="incoming"
                type="monotone" // SAFETY NET C: Monotone curve renders smoother interpolation on sparse ticks
                fill="url(#fillIncoming)"
                stroke="var(--color-incoming)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                name="Outgoing"
                dataKey="outgoing"
                type="monotone"
                fill="url(#fillOutgoing)"
                stroke="var(--color-outgoing)"
                strokeWidth={2}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

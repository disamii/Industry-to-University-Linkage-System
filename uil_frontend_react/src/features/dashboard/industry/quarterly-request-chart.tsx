"use client";

import * as React from "react";
import { Inbox } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import { MyRequestResponse } from "@/types/interfaces.requests";
import { RequestTrendChart } from "./request-trend-chart";

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
  const processedChartData = React.useMemo(() => {
    const quarterlyMap: Record<
      string,
      { quarter: string; incoming: number; outgoing: number }
    > = {};

    const getQuarterString = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const quarterRanges = ["Jan - Mar", "Apr - Jun", "Jul - Sep", "Oct - Dec"];
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
      a.quarter.localeCompare(b.quarter)
    );
  }, [incomingRequests, outgoingRequests]);

  const hasNoData = processedChartData.length === 0;

  return (
    <Card className="relative w-full overflow-hidden">
      <CardHeader className="flex flex-col gap-1 border-b">
        <CardTitle>Quarterly Request Analysis</CardTitle>
        <CardDescription>
          Quarterly metrics of incoming and outgoing requests.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative px-2 pt-4 sm:pt-6 min-h-75">
        {hasNoData && (
          <div className="z-10 absolute inset-0 flex flex-col justify-center items-center gap-2 bg-background/40 backdrop-blur-[1px]">
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
          className={`aspect-auto h-75 w-full ${
            hasNoData ? "opacity-20 select-none pointer-events-none" : ""
          }`}
        >
          <RequestTrendChart
            data={
              hasNoData
                ? [{ quarter: "No Data", incoming: 0, outgoing: 0 }]
                : processedChartData
            }
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
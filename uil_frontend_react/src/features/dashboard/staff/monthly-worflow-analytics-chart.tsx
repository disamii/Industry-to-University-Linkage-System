/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import { format } from "date-fns";

type Props = {
  data: any;
};

export function MonthlyWorkflowAnalyticsChart({ data }: Props) {
  const monthlyData = data
    ?.reduce((acc: any[], item: any) => {
      const createdAt = item.created_at || item.request?.created_at;

      if (!createdAt) return acc;

      const date = new Date(createdAt);

      if (isNaN(date.getTime())) return acc;

      const month = format(date, "MMM");
      const monthIndex = date.getMonth();

      const existing = acc.find((i) => i.month === month);

      const isAssignment = !!item.request;

      if (existing) {
        if (isAssignment) {
          existing.assignments += 1;
        } else {
          existing.requests += 1;
        }
      } else {
        acc.push({
          month,
          monthIndex,
          requests: isAssignment ? 0 : 1,
          assignments: isAssignment ? 1 : 0,
        });
      }

      return acc;
    }, [])
    ?.sort((a: any, b: any) => a.monthIndex - b.monthIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Analytics</CardTitle>
        <CardDescription>
          Monthly requests vs assignments activity
        </CardDescription>
      </CardHeader>

      <CardContent className="h-87.5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            barCategoryGap={24}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            <YAxis tickLine={false} axisLine={false} />

            <Tooltip cursor={{ opacity: 0.1 }} />

            <Legend />

            <Bar
              dataKey="requests"
              name="Requests"
              radius={[8, 8, 0, 0]}
              fill="var(--chart-1)"
              maxBarSize={40}
            />

            <Bar
              dataKey="assignments"
              name="Assignments"
              radius={[8, 8, 0, 0]}
              fill="var(--chart-2)"
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { AssignmentResponse } from "@/types/interfaces.assignments";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  data?: AssignmentResponse[];
};

const REQUEST_TYPE_COLORS: Record<string, string> = {
  internship: "var(--chart-1)",
  consultancy: "var(--chart-2)",
  testing: "var(--chart-3)",
  externship: "var(--chart-4)",
  training: "var(--chart-5)",
  recruitment: "var(--chart-1)",
  rnd: "var(--chart-2)",
  tech_support: "var(--chart-3)",
  other: "var(--chart-5)",
};

const formatLabel = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function RequestTypePieChart({ data }: Props) {
  // Group API data by request type
  const groupedData = data?.reduce<Record<string, number>>((acc, item) => {
    acc[item.request.type] = (acc[item.request.type] || 0) + 1;
    return acc;
  }, {});

  // Transform into recharts format
  const chartData = Object.entries(groupedData || {}).map(([type, count]) => ({
    type,
    count,
    fill: REQUEST_TYPE_COLORS[type] || "var(--chart-5)",
  }));

  // Dynamic chart config
  const chartConfig = {
    count: {
      label: "Total Items",
    },
    ...Object.fromEntries(
      chartData.map((item) => [
        item.type,
        {
          label: formatLabel(item.type),
          color: item.fill,
        },
      ]),
    ),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Assignment breakdown</CardTitle>

        <CardDescription>Assignment breakdown by request type</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-72 aspect-square"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => formatLabel(String(value))}
                wrapperStyle={{
                  paddingTop: 20,
                }}
              />

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="type"
                innerRadius={60}
                paddingAngle={4}
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

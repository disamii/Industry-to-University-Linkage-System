import StatCard, { Stat } from "@/components/reusable/stat-card";
import { RequestStats } from "@/types/interfaces.requests";
import { MoveDownLeft, MoveUpRight } from "lucide-react";

type Props = {
  stats: { incoming?: RequestStats; outgoing?: RequestStats };
};

const IndustryDashboardStats = ({ stats }: Props) => {
  const formattedStats: Stat[] = [
    {
      title: "Total Incoming Requests",
      value: stats?.incoming?.total_requests?.toString(),
      Icon: MoveDownLeft,
      colorVariant: "primary",
      subStats: [
        {
          label: "Initiated",
          value: stats?.incoming?.initiated_requests?.toString(),
          colorVariant: "muted",
        },
        {
          label: "Assigned",
          value: stats?.incoming?.assigned_requests?.toString(),
          colorVariant: "secondary",
        },
        {
          label: "Completed",
          value: stats?.incoming?.completed_requests?.toString(),
          colorVariant: "success",
        },
      ],
    },
    {
      title: "Total Outgoing Requests",
      value: stats?.outgoing?.total_requests?.toString(),
      Icon: MoveUpRight,
      colorVariant: "secondary",
      subStats: [
        {
          label: "Initiated",
          value: stats?.outgoing?.initiated_requests?.toString(),
          colorVariant: "muted",
        },
        {
          label: "Assigned",
          value: stats?.outgoing?.assigned_requests?.toString(),
          colorVariant: "primary",
        },
        {
          label: "Completed",
          value: stats?.outgoing?.completed_requests?.toString(),
          colorVariant: "success",
        },
      ],
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default IndustryDashboardStats;

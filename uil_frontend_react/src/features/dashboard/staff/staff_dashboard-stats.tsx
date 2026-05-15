import StatCard, { Stat } from "@/components/reusable/stat-card";
import { CheckSquare, FileText } from "lucide-react";

type Props = {
  stats: any;
};

const DashboardStat = ({ stats }: Props) => {
  const formattedStats: Stat[] = [
    {
      title: "Total Assignments",
      value: stats?.total_assignments?.toString(),
      Icon: CheckSquare,
      colorVariant: "info",
      subStats: [
        {
          label: "Pending",
          value: stats?.pending?.toString(),
          colorVariant: "secondary",
        },
        {
          label: "Accepted",
          value: stats?.accepted?.toString(),
          colorVariant: "primary",
        },
        {
          label: "Rejected",
          value: stats?.accepted?.toString(),
          colorVariant: "danger",
        },
      ],
    },
    {
      title: "Total Requests",
      value: stats?.total_requests?.toString(),
      Icon: FileText,
      colorVariant: "primary",
      subStats: [
        {
          label: "Completed",
          value: stats?.completed_requests?.toString(),
          colorVariant: "success",
        },
      ],
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default DashboardStat;

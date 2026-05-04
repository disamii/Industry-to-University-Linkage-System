import StatCard, { Stat } from "@/components/reusable/stat-card";
import { IndustryRequestMineStats } from "@/types/interfaces.industry_requests";
import { CheckCircle, Inbox, PlusCircle, UserCheck } from "lucide-react";

type Props = {
  stats: IndustryRequestMineStats;
};

const IndustryRequestsStat = ({ stats }: Props) => {
  const {
    total_requests,
    created_requests,
    assigned_requests,
    completed_requests,
  } = stats;

  const formattedStats: Stat[] = [
    {
      title: "Total Requests",
      value: total_requests.toString(),
      Icon: Inbox,
      colorVariant: "info",
    },
    {
      title: "Created Requests",
      value: created_requests.toString(),
      Icon: PlusCircle,
      colorVariant: "secondary",
    },
    {
      title: "Assigned Requests",
      value: assigned_requests.toString(),
      Icon: UserCheck,
      colorVariant: "warning",
    },
    {
      title: "Completed Requests",
      value: completed_requests.toString(),
      Icon: CheckCircle,
      colorVariant: "success",
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default IndustryRequestsStat;

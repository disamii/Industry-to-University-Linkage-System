import StatCard, { Stat } from "@/components/reusable/stat-card";
import { RequestStats } from "@/types/interfaces.requests";
import { CheckCircle, Inbox, PlusCircle, UserCheck } from "lucide-react";

type Props = {
  stats: RequestStats;
};

const RequestsStat = ({ stats }: Props) => {
  const {
    total_requests,
    initiated_requests,
    assigned_requests,
    completed_requests,
  } = stats;

  const formattedStats: Stat[] = [
    {
      title: "Total Requests",
      value: total_requests?.toString(),
      Icon: Inbox,
      colorVariant: "info",
    },
    {
      title: "Initiated Requests",
      value: initiated_requests?.toString(),
      Icon: PlusCircle,
      colorVariant: "secondary",
    },
    {
      title: "Assigned Requests",
      value: assigned_requests?.toString(),
      Icon: UserCheck,
      colorVariant: "warning",
    },
    {
      title: "Completed Requests",
      value: completed_requests?.toString(),
      Icon: CheckCircle,
      colorVariant: "success",
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default RequestsStat;

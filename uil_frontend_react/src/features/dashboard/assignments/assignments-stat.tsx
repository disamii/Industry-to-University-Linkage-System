import StatCard, { Stat } from "@/components/reusable/stat-card";
import { AssignmentStats } from "@/types/interfaces.assignments";
import { CheckCircle, Inbox, Loader, ThumbsUp } from "lucide-react";

type Props = {
  stats: AssignmentStats;
};

const AssignmentStat = ({ stats }: Props) => {
  const {
    total_assignments,
    pending,
    accepted,
    rejected,
    in_progress,
    completed,
    cancelled,
  } = stats;

  const formattedStats: Stat[] = [
    {
      title: "Total Assignments",
      value: total_assignments?.toString(),
      Icon: Inbox,
      colorVariant: "info",
    },
    {
      title: "Pending",
      value: pending?.toString(),
      Icon: ThumbsUp,
      colorVariant: "secondary",
      subStats: [
        {
          label: "Accepted",
          value: accepted?.toString(),
          colorVariant: "primary",
        },
        {
          label: "Rejected",
          value: rejected?.toString(),
          colorVariant: "danger",
        },
      ],
    },
    {
      title: "In Progress",
      value: in_progress?.toString(),
      Icon: Loader,
      colorVariant: "in_progress",
    },
    {
      title: "Completed",
      value: completed?.toString(),
      Icon: CheckCircle,
      colorVariant: "success",
      subStats: [
        {
          label: "Cancelled",
          value: cancelled?.toString(),
          colorVariant: "muted",
        },
      ],
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default AssignmentStat;

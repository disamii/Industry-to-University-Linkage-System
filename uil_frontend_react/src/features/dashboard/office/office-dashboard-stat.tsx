import StatCard, { Stat } from "@/components/reusable/stat-card";
import { AssignmentStats } from "@/types/interfaces.assignments";
import { PostStats } from "@/types/interfaces.posts";
import { RequestStats } from "@/types/interfaces.requests";
import { MoveDownLeft, MoveUpRight, Newspaper, UserCheck } from "lucide-react";

type Props = {
  stats: {
    incomingRequests?: RequestStats;
    outgoingRequests?: RequestStats;
    assignments?: AssignmentStats;
    posts?: PostStats;
  };
};

const OfficeDashboardStats = ({ stats }: Props) => {
  const formattedStats: Stat[] = [
    {
      title: "Total Incoming Requests",
      value: stats?.incomingRequests?.total_requests?.toString(),
      Icon: MoveDownLeft,
      colorVariant: "primary",
      subStats: [
        {
          label: "Initiated",
          value: stats?.incomingRequests?.initiated_requests?.toString(),
          colorVariant: "muted",
        },
        {
          label: "Assigned",
          value: stats?.incomingRequests?.assigned_requests?.toString(),
          colorVariant: "secondary",
        },
        {
          label: "Completed",
          value: stats?.incomingRequests?.completed_requests?.toString(),
          colorVariant: "success",
        },
      ],
    },
    {
      title: "Total Outgoing Requests",
      value: stats?.outgoingRequests?.total_requests?.toString(),
      Icon: MoveUpRight,
      colorVariant: "secondary",
      subStats: [
        {
          label: "Initiated",
          value: stats?.outgoingRequests?.initiated_requests?.toString(),
          colorVariant: "muted",
        },
        {
          label: "Assigned",
          value: stats?.outgoingRequests?.assigned_requests?.toString(),
          colorVariant: "primary",
        },
        {
          label: "Completed",
          value: stats?.outgoingRequests?.completed_requests?.toString(),
          colorVariant: "success",
        },
      ],
    },
    {
      title: "Total Assignments",
      value: stats?.assignments?.total_assignments?.toString(),
      Icon: UserCheck,
      colorVariant: "info",
      subStats: [
        {
          label: "Pending",
          value: stats?.assignments?.pending?.toString(),
          colorVariant: "secondary",
        },
        {
          label: "In Progress",
          value: stats?.assignments?.pending?.toString(),
          colorVariant: "in_progress",
        },
        {
          label: "Rejected",
          value: stats?.assignments?.rejected?.toString(),
          colorVariant: "danger",
        },
        {
          label: "Completed",
          value: stats?.assignments?.completed?.toString(),
          colorVariant: "success",
        },
      ],
    },
    {
      title: "Total Posts",
      value: stats.posts?.total_posts?.toString(),
      Icon: Newspaper,
      colorVariant: "info",
      subStats: [
        {
          label: "Thematic Area",
          value: stats.posts?.thematic_call?.toString(),
          colorVariant: "warning",
        },
        {
          label: "Open Requests",
          value: stats.posts?.open_request?.toString(),
          colorVariant: "primary",
        },
      ],
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default OfficeDashboardStats;

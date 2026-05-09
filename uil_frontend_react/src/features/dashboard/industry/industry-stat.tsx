import StatCard, { Stat } from "@/components/reusable/stat-card";
import { IndustryStats } from "@/types/interfaces.industry";
import { Building2, CalendarPlus, FileText } from "lucide-react";

type Props = {
  stats: IndustryStats;
};

const IndustryStat = ({ stats }: Props) => {
  const { total, industries_with_requests, industries_registered_this_year } =
    stats;

  const formattedStats: Stat[] = [
    {
      title: "Total Industries",
      value: total.toString(),
      Icon: Building2,
      colorVariant: "info",
    },
    {
      title: "With Requests",
      value: industries_with_requests.toString(),
      Icon: FileText,
      colorVariant: "warning",
    },
    {
      title: "Registered This Year",
      value: industries_registered_this_year.toString(),
      Icon: CalendarPlus,
      colorVariant: "success",
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default IndustryStat;

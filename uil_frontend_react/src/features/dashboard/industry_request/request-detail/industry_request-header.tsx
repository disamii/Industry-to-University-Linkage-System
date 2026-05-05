import { Badge } from "@/components/ui/badge";
import IndustryRequestActions from "@/features/dashboard/industry_request/indutry_request-actions";
import { actionStyles } from "@/features/dashboard/industry_request/utils.industry_request-actions";
import { cn, formatDate } from "@/lib/utils";
import { IndustryRequestDetailResponse } from "@/types/interfaces.industry_requests";
import { Building2, Calendar } from "lucide-react";

type Props = IndustryRequestDetailResponse & {};

const IndustryRequestHeader = ({
  id,
  title,
  description,
  type,
  created_at,
  academic_unit,
  actions,
}: Props) => {
  const latestAction = actions[0];

  return (
    <div className="flex justify-between items-start col-span-full">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-3xl">{title}</h1>
          <Badge className="capitalize">{type}</Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(created_at)}
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" />
            {academic_unit.name}
          </div>
          <Badge className={cn(actionStyles[latestAction.type], "capitalize")}>
            {latestAction.type}
          </Badge>
        </div>
      </div>

      {/* Action Dropdown */}
      <IndustryRequestActions
        id={id}
        title={title}
        description={description}
        variant="detail"
      />
    </div>
  );
};

export default IndustryRequestHeader;

import { Badge } from "@/components/ui/badge";
import IndustryRequestActions from "@/features/dashboard/industry_request/indutry_request-actions";
import { ACTION_CONFIG } from "@/features/dashboard/industry_request/utils.industry_request-actions";
import { ActionType, UserRole } from "@/lib/enums";
import { cn, formatDate, getRoleByPath } from "@/lib/utils";
import { IndustryRequestDetailResponse } from "@/types/interfaces.industry_requests";
import { Building2, Calendar } from "lucide-react";
import { useLocation } from "react-router-dom";

type Props = IndustryRequestDetailResponse & {};

const IndustryRequestHeader = ({
  id,
  title,
  description,
  type,
  created_at,
  academic_unit,
  actions,
  industry,
}: Props) => {
  const latestAction = actions[0];
  const { pathname } = useLocation();
  const isOffice = getRoleByPath(pathname) === UserRole.ADMIN;

  return (
    <div className="flex justify-between items-start col-span-full">
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-primary text-3xl">{title}</h1>
            <Badge className="capitalize" variant="secondary">
              {type}
            </Badge>
          </div>

          {isOffice && industry?.name && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs">Industry:</span>
              <span className="font-medium text-base">{industry.name}</span>
            </div>
          )}
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
          <Badge
            className={cn(ACTION_CONFIG[latestAction.type].color, "capitalize")}
          >
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
        supported_actions={Object.values(ActionType)}
      />
    </div>
  );
};

export default IndustryRequestHeader;

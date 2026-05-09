import RequestActionBadge from "@/components/reusable/request-action-badge";
import { Badge } from "@/components/ui/badge";
import RequestActions from "@/features/dashboard/request/request-actions";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import { UserRole } from "@/lib/enums";
import { formatDate } from "@/lib/utils";
import { RequestDetailResponse } from "@/types/interfaces.requests";
import { Building2, Calendar } from "lucide-react";

type Props = RequestDetailResponse & {};

const IndustryRequestHeader = ({
  id,
  title,
  description,
  type,
  created_at,
  academic_unit,
  actions,
  industry,
  supported_actions,
}: Props) => {
  const latestAction = actions.at(-1);

  const currentRole = useGetRoleByPath();
  const isOffice = currentRole === UserRole.ADMIN;

  return (
    <header className="flex justify-between items-start col-span-full">
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

          <RequestActionBadge type={latestAction?.type} />
        </div>
      </div>

      {/* Action Dropdown */}
      <RequestActions
        id={id}
        title={title}
        description={description}
        variant="detail"
        supported_actions={supported_actions}
      />
    </header>
  );
};

export default IndustryRequestHeader;

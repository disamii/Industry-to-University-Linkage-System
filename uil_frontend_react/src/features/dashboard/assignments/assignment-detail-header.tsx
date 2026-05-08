import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatType } from "@/lib/utils";
import { AssignmentDetailResponse } from "@/types/interfaces.assignments";

import { Building2, Calendar } from "lucide-react";
import AssignmentActions from "./assignment-actions";
import { getAssignmentStatusConfig } from "./utils.assignments";

type Props = AssignmentDetailResponse & {};

const AssignmentDetailHeader = ({
  id: assignment_id,
  request,
  assigned_users,
  // industry_mentor,
  // start_date,
  // end_date,
  status,
  supported_actions,
}: Props) => {
  const { Icon, color } = getAssignmentStatusConfig(status);

  return (
    <header className="flex justify-between items-start col-span-full">
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-primary text-3xl">{request.title}</h1>
            <Badge className="capitalize" variant="secondary">
              {formatType(request.type)}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-xs">Industry:</span>
            <span className="font-medium text-base">
              {request.industry.name}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(request.created_at)}
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" />
            {request.academic_unit.name}
          </div>
          <Badge variant="secondary" className={cn("capitalize", color)}>
            <Icon className="size-3.5" />
            {formatType(status)}
          </Badge>
        </div>
      </div>

      {/* Action Dropdown */}
      <AssignmentActions
        assignment_id={assignment_id}
        request_title={request.title}
        request_description={request.description}
        assigned_users={assigned_users}
        variant="detail"
        supported_actions={supported_actions}
      />
    </header>
  );
};

export default AssignmentDetailHeader;

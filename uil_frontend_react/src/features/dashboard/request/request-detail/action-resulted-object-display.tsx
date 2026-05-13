import { cn, formatDate, formatType } from "@/lib/utils";
import { RequestAction } from "@/types/interfaces.actions";
import React from "react";
import { ASSIGNMENT_STATUS_CONFIG } from "../../assignments/utils.assignments";
import { Badge } from "@/components/ui/badge";
import { POST_TYPE_CONFIG } from "../../office/posts/utils.posts";
import { Calendar } from "lucide-react";
import UsersAvatarPopover from "@/components/reusable/users-avatar-popver";

interface ResultDisplayData {
  title: string;
  meta: string;
  dateLabel: string;
  dateValue: string | null;
  badgeColor: string;
}

const getResultDisplayData = (
  result: RequestAction["resulted_object"],
): ResultDisplayData | null => {
  if (!result) return null;

  // Check for Assignment (unique: request or assigned_users)
  if ("request" in result) {
    return {
      title: result.request.title || `Assignment #${result.id}`,
      meta: result.status.replace(/_/g, " "),
      dateLabel: "Duration",
      dateValue: `${formatDate(result.start_date)} - ${formatDate(result.end_date)}`,
      badgeColor: ASSIGNMENT_STATUS_CONFIG[result.status].color,
    };
  }

  // Check for Post (unique: post_type)
  if ("post_type" in result) {
    return {
      title: result.title,
      meta: result.post_type,
      dateLabel: "Published",
      dateValue: formatDate(result.published_at) || "Draft",
      badgeColor: POST_TYPE_CONFIG[result.post_type].color,
    };
  }

  return null;
};

interface ResultCardProps {
  result: RequestAction["resulted_object"];
}

const ActionResultedObjectDisplay: React.FC<ResultCardProps> = ({ result }) => {
  const data = getResultDisplayData(result);

  if (!data) return null;

  return (
    <div className="space-y-2">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold">{data.title}</h4>
          <Badge variant="secondary" className={cn(data.badgeColor)}>
            {formatType(data.meta)}
          </Badge>
        </div>

        {/* Assignment Specific: Show user count if it exists */}
        {result && "assigned_users" in result && (
          <div className="flex items-center gap-2">
            <p className="text-xs">Assigned Experts:</p>

            {/* Assigned Users Avatars/List */}
            <UsersAvatarPopover users={result.assigned_users} maxVisible={4} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <p className="flex items-center gap-1 text-muted-foreground text-xs">
          <Calendar className="size-3" />
          {data.dateLabel}: {data.dateValue}
        </p>
      </div>
    </div>
  );
};

export default ActionResultedObjectDisplay;

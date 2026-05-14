import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttachmentView from "@/features/dashboard/request/request-detail/attachment-view";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import useTabParams from "@/hooks/use-tab-params";
import { UserRole } from "@/lib/enums";
import { cn, formatDate, formatType, getFullName } from "@/lib/utils";
import { AssignmentDetailResponse } from "@/types/interfaces.assignments";
import { RequestDetailResponse } from "@/types/interfaces.requests";
import {
  Activity,
  Briefcase,
  Calendar,
  Crown,
  Info,
  MessageSquare,
  Users,
} from "lucide-react";

type Props = RequestDetailResponse & {
  assignment?: AssignmentDetailResponse;
};

const RequestDetailCard = ({
  description,
  type,
  attachment,
  requesting_entity,
  assignment,
}: Props) => {
  const currentRole = useGetRoleByPath();
  const {
    params: { tab: currentTab },
  } = useTabParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <Info className="w-5 h-5 text-primary" />
          Request Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Description Section */}
          <div className="space-y-2">
            <p className="font-semibold text-base">Description</p>
            <p className="bg-muted/50 p-4 rounded-lg text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Meta Info Grid */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-semibold text-base">Information</p>
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Activity className="mt-0.5 w-4 min-w-4 max-w-4 h-4 min-h-4 max-h-4 text-muted-foreground" />
                  <p className="font-medium text-muted-foreground text-sm">
                    Request Type:{" "}
                    <span className="text-foreground">{formatType(type)}</span>
                  </p>
                </div>
                {currentRole === UserRole.INDUSTRY &&
                  currentTab === "incoming" && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 w-4 min-w-4 max-w-4 h-4 min-h-4 max-h-4 text-muted-foreground" />
                      <p className="font-medium text-muted-foreground text-sm">
                        Requested By:{" "}
                        <span className="text-foreground">
                          {formatType(requesting_entity)}
                        </span>
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Assignment Section */}
            {assignment && (
              <div className="space-y-2">
                <p className="font-semibold text-base">Assignment Details</p>
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                  {/* Status */}
                  <div className="flex items-start gap-2">
                    <Activity className="mt-0.5 w-4 min-w-4 max-w-4 h-4 min-h-4 max-h-4 text-muted-foreground" />
                    <p className="font-medium text-sm">
                      Status:{" "}
                      <span className="bg-primary/10 px-2 py-0.5 rounded-full font-normal text-primary text-xs capitalize">
                        {formatType(assignment.status)}
                      </span>
                    </p>
                  </div>

                  {/* Assigned Users */}
                  <div className="flex items-start gap-2">
                    <Users className="mt-0.5 w-4 min-w-4 max-w-4 h-4 min-h-4 max-h-4 text-muted-foreground" />

                    <div className="font-medium text-sm">
                      Assigned Experts:
                      <div className="flex flex-wrap gap-1 mt-1">
                        {assignment.assigned_users.map((user) => {
                          const isPI = user.is_pi;

                          return (
                            <span
                              key={user.id}
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 border rounded-full font-normal text-xs",
                                isPI
                                  ? "bg-amber-50 border-amber-200 text-amber-700"
                                  : "bg-background",
                              )}
                            >
                              {getFullName(user, 2)}

                              {isPI && (
                                <>
                                  <Crown className="w-3 h-3" />
                                  <span className="font-medium text-[10px]">
                                    PI
                                  </span>
                                </>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Mentor */}
                  {assignment.industry_mentor && (
                    <div className="flex items-start gap-2">
                      <Briefcase className="mt-0.5 w-4 min-w-4 max-w-4 h-4 min-h-4 max-h-4 text-muted-foreground" />
                      <p className="font-medium text-sm">
                        Mentor:{" "}
                        <span className="font-normal">
                          {assignment.industry_mentor}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 w-4 min-w-4 max-w-4 h-4 min-h-4 max-h-4 text-muted-foreground" />
                    <p className="font-medium text-sm">
                      Duration:{" "}
                      <span className="font-normal text-xs">
                        {formatDate(assignment.start_date)} -{" "}
                        {formatDate(assignment.end_date)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attachment Section */}
          <div className="pt-2">
            <AttachmentView attachment={attachment} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestDetailCard;

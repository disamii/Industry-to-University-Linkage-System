import UsersAvatarPopover from "@/components/reusable/users-avatar-popver";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate, formatType } from "@/lib/utils";
import { AssignmentResponse } from "@/types/interfaces.assignments";
import { Calendar, Logs, MoveUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssignmentStatusConfig } from "./utils.assignments";

type Props = {
  viewAllLink: string;
  viewEachLink: (id: number) => string;
  max_assignments?: number;
  assignments: AssignmentResponse[];
  renderDesc: (max_assignments: number) => string;
};

const RecentAssignmentsCard = ({
  viewAllLink,
  viewEachLink,
  max_assignments = 5,
  assignments,
  renderDesc,
}: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 font-bold text-lg">
            <Logs className="w-5 h-5 text-primary" />
            Recent Assignments
          </CardTitle>
          <CardDescription className="font-normal text-muted-foreground text-xs">
            {renderDesc(max_assignments)}
          </CardDescription>
        </div>

        {!!assignments.length && (
          <Button asChild size="sm" variant="ghost">
            <Link
              to={viewAllLink}
              className="flex items-center gap-1 hover:bg-transparent text-primary hover:text-primary/90 hover:underline transition-all"
            >
              View All
              <MoveUpRight className="size-3" />
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="divide-y">
          {!assignments.length ? (
            <div className="py-6">
              <p className="text-muted-foreground text-sm text-center">
                It looks like there aren't any assignments here yet.
              </p>
            </div>
          ) : (
            assignments
              .slice(0, max_assignments)
              .reverse()
              .map((assignment) => {
                const statusInfo = getAssignmentStatusConfig(assignment.status);
                const StatusIcon = statusInfo.Icon;

                return (
                  <div
                    key={assignment.id}
                    className="space-y-1.5 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={viewEachLink(assignment.id)}
                            className="block font-semibold hover:text-primary text-sm sm:text-base hover:underline leading-tight transition-all"
                          >
                            {assignment.request.title}
                          </Link>

                          <Badge
                            variant="outline"
                            className="px-1 h-4 text-[10px]"
                          >
                            {formatType(assignment.request.type)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="size-3" />
                            <span>
                              {formatDate(assignment.start_date)} -{" "}
                              {formatDate(assignment.end_date)}
                            </span>
                          </div>

                          <UsersAvatarPopover
                            users={assignment.assigned_users}
                            maxVisible={4}
                          />
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className={cn("flex items-center", statusInfo.color)}
                      >
                        <StatusIcon className="size-3" />
                        {formatType(assignment.status)}
                      </Badge>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAssignmentsCard;

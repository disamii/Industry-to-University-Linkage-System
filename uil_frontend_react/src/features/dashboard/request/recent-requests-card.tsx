import RequestActionBadge from "@/components/reusable/request-action-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatType } from "@/lib/utils";
import { RequestDetailResponse } from "@/types/interfaces.requests";
import { ArrowRight, Calendar, Logs } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  industry_id?: number;
  max_requests?: number;
  requests: RequestDetailResponse[];
};

const RecentRequestsCard = ({
  industry_id,
  max_requests = 5,
  requests,
}: Props) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2 font-bold text-lg">
            <Logs className="w-5 h-5 text-primary" />
            Recent Requests
          </CardTitle>
          <CardDescription className="font-normal text-muted-foreground text-xs">
            Last {max_requests} requests by this industry
          </CardDescription>
        </div>

        {!!requests.length && (
          <Button asChild size="sm" variant="ghost">
            <Link
              to={`/dashboard/office/requests?tab=incoming&requests.industry=${industry_id}`}
              className="hover:bg-transparent text-primary hover:text-primary/90 hover:underline transition-all"
            >
              View All
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="divide-y">
          {!requests.length ? (
            <p className="text-muted-foreground text-sm text-center">
              It looks like there aren't any requests here yet.
            </p>
          ) : (
            requests
              .slice(0, max_requests)
              .reverse()
              .map((request) => (
                <div key={request.id} className="space-y-0.5 py-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <Link
                      to={`/dashboard/office/requests/${request.id}?tab=incoming`}
                      className="block font-semibold hover:text-primary text-base hover:underline transition-all"
                    >
                      {request.title}
                    </Link>

                    <Badge variant="outline" className="px-1 h-4 text-[10px]">
                      {formatType(request.type)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span>{formatDate(request.created_at)}</span>
                    </div>
                    <RequestActionBadge
                      type={request.latest_action}
                      size="sm"
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRequestsCard;

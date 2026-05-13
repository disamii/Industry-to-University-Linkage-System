import BackButton from "@/components/reusable/back-button";
import { QueryState } from "@/components/reusable/query-state-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetIndustryDetail } from "@/data/industry/industry-detail-query";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import { useRequestParams } from "@/data/requests/use-request-params";
import IndustryHeader from "@/features/dashboard/office/industry-management/industry-header";
import IndustryInfoCard from "@/features/dashboard/office/industry-management/industry-info-card";
import RecentRequestsCard from "@/features/dashboard/request/recent-requests-card";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import { Entity } from "@/lib/enums";
import { MoveUpRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const IndustryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setParams } = useRequestParams();

  const incomingQuery = useGetIndustryDetail(Number(id));

  const entity = Entity.ACADEMIC_UNIT;
  const outgoingQuery = useGetMyRequestsList({
    entity,
    direction: "outgoing",
    enabled: true,
  });

  useEffect(() => {
    setParams({ industry: Number(id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <QueryState
      query={incomingQuery}
      checkEmpty={(data) => !data}
      variant="page"
    >
      {(data) => {
        return (
          <div className="space-y-3">
            <BackButton />

            <div className="items-start gap-6 grid grid-cols-[1fr_30rem]">
              <IndustryHeader {...data} />

              <IndustryInfoCard industry={data} />
              <RecentRequestsCard
                industry_id={data.id}
                requests={data.requests}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bold text-xl">
                  <MoveUpRight className="w-5 h-5 text-primary" />
                  Outgoing Requests
                </CardTitle>
                <CardDescription className="font-normal text-muted-foreground text-sm">
                  Your requests for this industry
                </CardDescription>
              </CardHeader>

              <CardContent>
                <QueryState
                  query={outgoingQuery}
                  checkEmpty={(data) => data.results.length === 0}
                  variant="section"
                >
                  {(data) => (
                    <RequestsTable
                      data={data}
                      onEdit={(id) =>
                        navigate(`/dashboard/staff/requests/${id}/edit`)
                      }
                      onDelete={() =>
                        navigate("/dashboard/staff/requests?tab=outgoing")
                      }
                      onView={(id) =>
                        navigate(`/dashboard/staff/requests/${id}?tab=outgoing`)
                      }
                      excludedCols={["Industry Name"]}
                    />
                  )}
                </QueryState>
              </CardContent>
            </Card>
          </div>
        );
      }}
    </QueryState>
  );
};

export default IndustryDetailPage;

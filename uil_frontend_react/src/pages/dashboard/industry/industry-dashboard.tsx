import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import IndustryDashboardStats from "@/features/dashboard/industry/industry-dashboard-stat";
import { QuarterlyRequestChart } from "@/features/dashboard/industry/quarterly-request-chart";
import RecentRequestsCard from "@/features/dashboard/request/recent-requests-card";
import { Entity } from "@/lib/enums";
import { getFullName } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { MoveDownLeft, MoveUpRight } from "lucide-react";

const IndustryDashboard = () => {
  const { user } = useAuthStore();

  const outgoingQuery = useGetMyRequestsList({
    entity: Entity.INDUSTRY,
    direction: "outgoing",
    enabled: true,
  });

  const incomingQuery = useGetMyRequestsList({
    entity: Entity.INDUSTRY,
    direction: "incoming",
    enabled: true,
  });

  const stats = {
    incoming: incomingQuery.data?.stats,
    outgoing: outgoingQuery.data?.stats,
  };

  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title={`Hello, ${getFullName(user!, 2)}`}
        desc="Manage your industry incoming & outgoing requests."
        hasBackBtn={false}
      />

      <IndustryDashboardStats stats={stats} />

      <QuarterlyRequestChart
        incomingRequests={incomingQuery.data?.results}
        outgoingRequests={outgoingQuery.data?.results}
      />

      <div className="items-stretch gap-6 grid grid-cols-2">
        {/* Recent Incoming Requests */}
        <QueryState
          query={incomingQuery}
          checkEmpty={(data) => !data || data.results.length === 0}
          variant="section"
        >
          {(data) => (
            <RecentRequestsCard
              viewAllLink={`/dashboard/industry/requests?tab=incoming`}
              viewEachLink={(id) =>
                `/dashboard/industry/requests/${id}?tab=incoming`
              }
              renderDesc={(max_requests) =>
                `Your last ${max_requests} incoming requests`
              }
              requests={data.results}
              title="Recent Incoming Requests"
              Icon={MoveDownLeft}
            />
          )}
        </QueryState>

        {/* Recent Outgoing Requests */}
        <QueryState
          query={outgoingQuery}
          checkEmpty={(data) => !data || data.results.length === 0}
          variant="section"
        >
          {(data) => (
            <RecentRequestsCard
              viewAllLink={`/dashboard/industry/requests?tab=outgoing`}
              viewEachLink={(id) =>
                `/dashboard/industry/requests/${id}?tab=outgoing`
              }
              renderDesc={(max_requests) =>
                `Your last ${max_requests} outgoing requests`
              }
              requests={data.results}
              title="Recent Outgoing Requests"
              Icon={MoveUpRight}
            />
          )}
        </QueryState>
      </div>
    </div>
  );
};

export default IndustryDashboard;

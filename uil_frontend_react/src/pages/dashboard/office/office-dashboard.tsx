import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetAssignmentsList } from "@/data/assignments/assignments-list-query";
import { useGetPostsList } from "@/data/posts/posts-list-query";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import RecentAssignmentsCard from "@/features/dashboard/assignments/recent-assignments-card";
import { QuarterlyRequestChart } from "@/features/dashboard/industry/quarterly-request-chart";
import OfficeDashboardStats from "@/features/dashboard/office/office-dashboard-stat";
import RecentRequestsCard from "@/features/dashboard/request/recent-requests-card";
import { LatestActionKpiDashboard } from "@/features/dashboard/staff/monthly-requestVassignment-analytics-chart";
import { RequestTypePieChart } from "@/features/dashboard/staff/request-type-pie-chart";
import { Entity } from "@/lib/enums";
import { getFullName } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { MoveDownLeft } from "lucide-react";

const OfficeDashboard = () => {
  const { user } = useAuthStore();

  // Requests
  const outgoingQuery = useGetMyRequestsList({
    entity: Entity.ACADEMIC_UNIT,
    direction: "outgoing",
    enabled: true,
  });

  const incomingQuery = useGetMyRequestsList({
    entity: Entity.ACADEMIC_UNIT,
    direction: "incoming",
    enabled: true,
  });

  // Assignments
  const assignmentsQuery = useGetAssignmentsList();

  // Posts
  const postsQuery = useGetPostsList();

  const stats = {
    incomingRequests: incomingQuery.data?.stats,
    outgoingRequests: outgoingQuery.data?.stats,
    assignments: assignmentsQuery.data?.stats,
    posts: postsQuery.data?.stats,
  };

  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title={`Hello, ${getFullName(user!, 2)}`}
        desc="Monitor and coordinate university–industry operations."
        hasBackBtn={false}
      />

      <OfficeDashboardStats stats={stats} />

      <QuarterlyRequestChart
        incomingRequests={incomingQuery.data?.results}
        outgoingRequests={outgoingQuery.data?.results}
      />

      <div className="">
        <LatestActionKpiDashboard 
          data={[
            ...(incomingQuery.data?.results ?? []),
            ...(outgoingQuery.data?.results ?? []),
          ]}
        />
      </div>

      <div className="items-stretch gap-6 grid grid-cols-2">
        {/* Recent Assignments */}
        <QueryState
          query={assignmentsQuery}
          checkEmpty={(data) => !data || data.results.length === 0}
          variant="section"
        >
          {(data) => (
            <RecentAssignmentsCard
              viewAllLink={`/dashboard/office/assignments`}
              viewEachLink={(id) => `/dashboard/office/assignments/${id}`}
              renderDesc={(max_assignments) =>
                `Last ${max_assignments} assignments`
              }
              assignments={data.results}
            />
          )}
        </QueryState>

        {/* Recent Requests */}
        <QueryState
          query={incomingQuery}
          checkEmpty={(data) => !data || data.results.length === 0}
          variant="section"
        >
          {(data) => (
            <RecentRequestsCard
              viewAllLink={`/dashboard/staff/requests`}
              viewEachLink={(id) => `/dashboard/staff/requests/${id}`}
              renderDesc={(max_requests) =>
                `Last ${max_requests} Incoming requests`
              }
              requests={data.results}
              title="Recent Incoming Requests"
              Icon={MoveDownLeft}
            />
          )}
        </QueryState>
      </div>
    </div>
  );
};

export default OfficeDashboard;

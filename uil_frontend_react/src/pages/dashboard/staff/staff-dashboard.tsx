import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetAssignmentsListByUserId } from "@/data/assignments/assignments-list-by-user_id-query";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import RecentAssignmentsCard from "@/features/dashboard/assignments/recent-assignments-card";
import StaffDashboardStats from "@/features/dashboard/staff/staff-dashboard-stat";
import RecentRequestsCard from "@/features/dashboard/request/recent-requests-card";
import { Entity } from "@/lib/enums";
import { getFullName } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { RequestTypePieChart } from "@/features/dashboard/staff/request-type-pie-chart";
import { MonthlyWorkflowAnalyticsChart } from "@/features/dashboard/staff/monthly-requestVassignment-analytics-chart";

const StaffDashboard = () => {
  const requestsQuery = useGetMyRequestsList({
    entity: Entity.STAFF,
    direction: "outgoing",
    enabled: true,
  });

  const { user } = useAuthStore();
  const assignmentsQuery = useGetAssignmentsListByUserId(user?.id);

  const stats = {
    ...(requestsQuery.data?.stats ?? {}),
    ...(assignmentsQuery.data?.stats ?? {}),
  };

  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title={`Hello, ${getFullName(user!, 2)}`}
        desc="Manage your industry requests and project assignments."
        hasBackBtn={false}
      />
      <StaffDashboardStats stats={stats} />

      <div className="gap-6 grid grid-cols-[1fr_30rem]">
        <MonthlyWorkflowAnalyticsChart
          data={[
            ...(requestsQuery.data?.results ?? []),
            ...(assignmentsQuery.data?.results ?? []),
          ]}
        />
        <RequestTypePieChart data={assignmentsQuery.data?.results} />
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
              viewAllLink={`/dashboard/staff/assignments`}
              viewEachLink={(id) => `/dashboard/staff/assignments/${id}`}
              renderDesc={(max_assignments) =>
                `Your last ${max_assignments} assignments`
              }
              assignments={data.results}
            />
          )}
        </QueryState>

        {/* Recent Requests */}
        <QueryState
          query={requestsQuery}
          checkEmpty={(data) => !data || data.results.length === 0}
          variant="section"
        >
          {(data) => (
            <RecentRequestsCard
              viewAllLink={`/dashboard/staff/requests`}
              viewEachLink={(id) => `/dashboard/staff/requests/${id}`}
              renderDesc={(max_requests) =>
                `Your last ${max_requests} requests`
              }
              requests={data.results}
            />
          )}
        </QueryState>
      </div>
    </div>
  );
};

export default StaffDashboard;

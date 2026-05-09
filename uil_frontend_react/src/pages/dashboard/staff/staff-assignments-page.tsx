import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetAssignmentsListByUserId } from "@/data/assignments/assignments-list-by-user_id-query";
import AssignmentStat from "@/features/dashboard/assignments/assignments-stat";
import AssignmentsTable from "@/features/dashboard/assignments/assignments-table";
import AssignmentsTableOperations from "@/features/dashboard/assignments/assignments-table-operations";
import { useAuthStore } from "@/store/use-auth-store";

const StaffAssignmentsPage = () => {
  const { user } = useAuthStore();

  const query = useGetAssignmentsListByUserId(user?.id);

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Assignments Management"
        desc="Manage assignments"
        hasBackBtn={false}
        scope={query.data?.scope}
      />

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <AssignmentStat stats={data.stats} />
              <AssignmentsTableOperations />
              <AssignmentsTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </div>
  );
};

export default StaffAssignmentsPage;

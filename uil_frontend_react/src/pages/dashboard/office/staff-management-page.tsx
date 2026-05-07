import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetUsers } from "@/data/user/user-list-query";
import StaffTable from "@/features/dashboard/office/staff-management/staff-table";
import StaffTableOperations from "@/features/dashboard/office/staff-management/staff-table-operations";

const IndustryManagementPage = () => {
  const query = useGetUsers();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Staff Members Management"
        desc="Manage staff members"
        hasBackBtn={false}
        scope={query.data?.scope}
      />

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <StaffTableOperations />
              <StaffTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </div>
  );
};

export default IndustryManagementPage;

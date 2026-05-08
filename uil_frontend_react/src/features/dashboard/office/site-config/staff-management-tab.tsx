import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { TabsContent } from "@/components/ui/tabs";
import { useGetUsers } from "@/data/user/user-list-query";
import StaffTable from "@/features/dashboard/office/staff-management/staff-table";
import StaffTableOperations from "@/features/dashboard/office/staff-management/staff-table-operations";

const StaffManagementTab = () => {
  const query = useGetUsers();

  return (
    <TabsContent value="staff_management" className="space-y-6 mt-4">
      <DashboardContentHeader
        title="Staff Management"
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
    </TabsContent>
  );
};

export default StaffManagementTab;

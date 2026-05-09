import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import SubmitNewRequestBtn from "@/components/reusable/submit-new-request-btn";
import { TabsContent } from "@/components/ui/tabs";
import { useGetMyRequestsList } from "@/data/industry_requests/industry/my-requests-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";
import { Entity } from "@/lib/enums";

const OutgoingIndustryRequestsTab = () => {
  const query = useGetMyRequestsList({
    entity: Entity.INDUSTRY,
    direction: "outgoing",
  });

  return (
    <TabsContent value="outgoing" className="space-y-6 mt-4">
      <div className="flex justify-between">
        <DashboardContentHeader
          title="Outgoing Requests Management"
          desc="Manage your requests"
          hasBackBtn={false}
        />

        <SubmitNewRequestBtn to="/dashboard/industry/requests/create" />
      </div>

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <RequestsStat stats={data.stats} />
              <RequestsTableOperations />
              <RequestsTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </TabsContent>
  );
};

export default OutgoingIndustryRequestsTab;
